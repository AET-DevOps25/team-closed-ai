package de.tum.cit.aet.closed.ai.server.controller;

import de.tum.cit.aet.closed.ai.server.controller.dto.TaskDto;
import de.tum.cit.aet.closed.ai.server.exception.ProjectNotFoundException;
import de.tum.cit.aet.closed.ai.server.exception.TaskNotFoundException;
import de.tum.cit.aet.closed.ai.server.exception.UserNotFoundException;
import de.tum.cit.aet.closed.ai.server.persistence.model.Task;
import de.tum.cit.aet.closed.ai.server.persistence.model.TaskStatus;
import de.tum.cit.aet.closed.ai.server.persistence.model.User;
import de.tum.cit.aet.closed.ai.server.service.ProjectService;
import de.tum.cit.aet.closed.ai.server.service.TaskService;
import de.tum.cit.aet.closed.ai.server.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@AllArgsConstructor
public class TaskController {
    private final TaskService taskService;
    private final UserService userService;
    private final ProjectService projectService;

    @GetMapping
    public List<TaskDto> getAll() {
        return taskService.findAll().stream()
                .map(TaskDto::fromTask)
                .toList();
    }

    @GetMapping("/{id}")
    public TaskDto getTask(@PathVariable Long id) {
        Task task = taskService.findById(id).orElseThrow(() -> new TaskNotFoundException("No Task found with ID " + id));
        return TaskDto.fromTask(task);
    }

    @PutMapping("/{id}")
    public TaskDto updateTask(@PathVariable Long id, @RequestBody TaskDto taskDto) {
        Task task = taskService.findById(id).orElseThrow(() -> new TaskNotFoundException("No Task found with ID " + id));
        task.setTitle(taskDto.title());
        task.setDescription(taskDto.description());
        task.setStatus(taskDto.taskStatus());
        task.setComments(taskDto.comments());
        task.setAttachments(taskDto.attachments());
        if (!taskDto.assigneeId().equals(task.getAssignee().getId())) {
            User assignee = userService.findById(taskDto.assigneeId()).orElseThrow(() -> new UserNotFoundException("No User found with ID " + taskDto.assigneeId()));
            task.setAssignee(assignee);
        }
        task = taskService.save(task);
        return TaskDto.fromTask(task);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        taskService.findById(id)
                .ifPresentOrElse(
                        t -> taskService.delete(id),
                        () -> { throw new TaskNotFoundException("No Task found with ID " + id); }
                );
    }

    @PatchMapping("/{id}/status")
    public TaskDto changeStatus(@PathVariable Long id, @RequestParam TaskStatus status) {
        Task task = taskService.setStatus(id, status);
        return TaskDto.fromTask(task);
    }

    @GetMapping("/by-assignee/{id}")
    public List<TaskDto> getByAssignee(@PathVariable("id") Long id) {
        return userService.findById(id)
                .map(u -> taskService.findByAssignee(id).stream()
                                .map(TaskDto::fromTask)
                                .toList())
                .orElseThrow(() -> new UserNotFoundException("No User found with ID " + id));
    }

    @GetMapping("/by-project/{id}")
    public List<TaskDto> byProject(@PathVariable("id") Long id) {
        return projectService.findById(id)
                .map(p -> taskService.findByProject(p.getId()).stream()
                        .map(TaskDto::fromTask)
                        .toList())
                .orElseThrow(() -> new ProjectNotFoundException("No Project found with ID " + id));
    }
}
