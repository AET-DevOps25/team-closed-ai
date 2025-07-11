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
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tasks")
@AllArgsConstructor
public class TaskController {
  private final TaskService taskService;
  private final UserServiceClient userServiceClient;
  private final ProjectServiceClient projectServiceClient;

  @GetMapping
  public List<TaskDto> getAll() {
    return taskService.findAll().stream().map(TaskDto::fromTask).toList();
  }

  @GetMapping("/{id}")
  public TaskDto getTask(@PathVariable Long id) {
    Task task =
        taskService
            .findById(id)
            .orElseThrow(() -> new TaskNotFoundException("No Task found with ID " + id));
    return TaskDto.fromTask(task);
  }

  @PutMapping("/{id}")
  public TaskDto updateTask(@PathVariable Long id, @RequestBody TaskDto taskDto) {
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
  public void delete(@PathVariable Long id) {
    taskService
        .findById(id)
        .ifPresentOrElse(
            t -> taskService.delete(id),
            () -> {
              throw new TaskNotFoundException("No Task found with ID " + id);
            });
  }

  @PatchMapping("/{id}/status")
  public TaskDto changeStatus(@PathVariable Long id, @RequestParam TaskStatus status) {
    Task task = taskService.setStatus(id, status);
    return TaskDto.fromTask(task);
  }

  @GetMapping("/by-assignee/{id}")
  public List<TaskDto> getByAssignee(@PathVariable("id") Long id) {
    return userServiceClient
        .findById(id)
        .map(u -> taskService.findByAssignee(id).stream().map(TaskDto::fromTask).toList())
        .orElseThrow(() -> new UserNotFoundException("No User found with ID " + id));
  }

  @GetMapping("/by-project/{id}")
  public List<TaskDto> byProject(@PathVariable("id") Long id) {
    return projectServiceClient
        .findById(id)
        .map(p -> taskService.findByProject(p.id()).stream().map(TaskDto::fromTask).toList())
        .orElseThrow(() -> new ProjectNotFoundException("No Project found with ID " + id));
  }
}
