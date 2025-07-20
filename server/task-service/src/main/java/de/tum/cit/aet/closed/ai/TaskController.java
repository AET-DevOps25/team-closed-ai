package de.tum.cit.aet.closed.ai;

import de.tum.cit.aet.closed.ai.client.ProjectServiceClient;
import de.tum.cit.aet.closed.ai.client.UserServiceClient;
import de.tum.cit.aet.closed.ai.dto.TaskDto;
import de.tum.cit.aet.closed.ai.exception.ProjectNotFoundException;
import de.tum.cit.aet.closed.ai.exception.TaskNotFoundException;
import de.tum.cit.aet.closed.ai.exception.UserNotFoundException;
import de.tum.cit.aet.closed.ai.model.Task;
import de.tum.cit.aet.closed.ai.model.TaskStatus;
import de.tum.cit.aet.closed.ai.model.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tasks")
@AllArgsConstructor
@Tag(
    name = "Task Management",
    description =
        "Operations for managing tasks including CRUD operations, status updates, and task filtering")
public class TaskController {
  private final TaskService taskService;
  private final UserServiceClient userServiceClient;
  private final ProjectServiceClient projectServiceClient;

  @GetMapping
  @Operation(summary = "Get all tasks", description = "Retrieve a list of all tasks in the system")
  @ApiResponse(responseCode = "200", description = "Successfully retrieved list of tasks")
  public List<TaskDto> getAll() {
    return taskService.findAll().stream().map(TaskDto::fromTask).toList();
  }

  @GetMapping("/{id}")
  @Operation(
      summary = "Get task by ID",
      description = "Retrieve a specific task by its unique identifier")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Task found and returned successfully"),
        @ApiResponse(responseCode = "404", description = "Task not found with the provided ID")
      })
  public TaskDto getTask(
      @Parameter(description = "Unique identifier of the task", required = true) @PathVariable
          Long id) {
    Task task =
        taskService
            .findById(id)
            .orElseThrow(() -> new TaskNotFoundException("No Task found with ID " + id));
    return TaskDto.fromTask(task);
  }

  @PutMapping("/{id}")
  @Operation(
      summary = "Update task",
      description =
          "Update an existing task's information including title, description, status, comments, and attachments")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Task updated successfully"),
        @ApiResponse(responseCode = "404", description = "Task not found with the provided ID"),
        @ApiResponse(responseCode = "400", description = "Invalid task data provided")
      })
  public TaskDto updateTask(
      @Parameter(description = "Unique identifier of the task to update", required = true)
          @PathVariable
          Long id,
      @RequestBody TaskDto taskDto) {
    Task task =
        taskService
            .findById(id)
            .orElseThrow(() -> new TaskNotFoundException("No Task found with ID " + id));
    task.setTitle(taskDto.title());
    task.setDescription(taskDto.description());
    task.setStatus(taskDto.taskStatus());
    task.setComments(taskDto.comments());
    task.setAttachments(taskDto.attachments());

    User currentAssignee = task.getAssignee();
    Long currentAssigneeId = currentAssignee != null ? currentAssignee.getId() : null;
    Long newAssigneeId = taskDto.assigneeId();

    if ((currentAssigneeId == null && newAssigneeId != null)
        || (currentAssigneeId != null && !currentAssigneeId.equals(newAssigneeId))) {
      // Assignee changed
      User assignee = null;
      if (newAssigneeId != null) {
        assignee =
            userServiceClient
                .findById(newAssigneeId)
                .map(
                    userDto -> {
                      User user = new User();
                      user.setId(userDto.id());
                      user.setName(userDto.name());
                      user.setProfilePicture(userDto.profilePicture());
                      return user;
                    })
                .orElseThrow(
                    () -> new UserNotFoundException("No User found with ID " + newAssigneeId));
      }
      task.setAssignee(assignee);
    }
    task = taskService.save(task);
    return TaskDto.fromTask(task);
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete task", description = "Delete a task from the system")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Task deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Task not found with the provided ID")
      })
  public void delete(
      @Parameter(description = "Unique identifier of the task to delete", required = true)
          @PathVariable
          Long id) {
    taskService
        .findById(id)
        .ifPresentOrElse(
            t -> taskService.delete(id),
            () -> {
              throw new TaskNotFoundException("No Task found with ID " + id);
            });
  }

  @PatchMapping("/{id}/status")
  @Operation(summary = "Change task status", description = "Update the status of a specific task")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Task status updated successfully"),
        @ApiResponse(responseCode = "404", description = "Task not found with the provided ID"),
        @ApiResponse(responseCode = "400", description = "Invalid status provided")
      })
  public TaskDto changeStatus(
      @Parameter(description = "Unique identifier of the task", required = true) @PathVariable
          Long id,
      @Parameter(description = "New status for the task", required = true) @RequestParam
          TaskStatus status) {
    Task task = taskService.setStatus(id, status);
    return TaskDto.fromTask(task);
  }

  @GetMapping("/by-assignee/{id}")
  @Operation(
      summary = "Get tasks by assignee",
      description = "Retrieve all tasks assigned to a specific user")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved tasks for assignee"),
        @ApiResponse(responseCode = "404", description = "User not found with the provided ID")
      })
  public List<TaskDto> getByAssignee(
      @Parameter(description = "Unique identifier of the user assignee", required = true)
          @PathVariable("id")
          Long id) {
    return userServiceClient
        .findById(id)
        .map(u -> taskService.findByAssignee(id).stream().map(TaskDto::fromTask).toList())
        .orElseThrow(() -> new UserNotFoundException("No User found with ID " + id));
  }

  @GetMapping("/by-project/{id}")
  @Operation(
      summary = "Get tasks by project",
      description = "Retrieve all tasks belonging to a specific project")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved tasks for project"),
        @ApiResponse(responseCode = "404", description = "Project not found with the provided ID")
      })
  public List<TaskDto> byProject(
      @Parameter(description = "Unique identifier of the project", required = true)
          @PathVariable("id")
          Long id) {
    return projectServiceClient
        .findById(id)
        .map(p -> taskService.findByProject(p.id()).stream().map(TaskDto::fromTask).toList())
        .orElseThrow(() -> new ProjectNotFoundException("No Project found with ID " + id));
  }
}
