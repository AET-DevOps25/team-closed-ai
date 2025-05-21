package de.tum.cit.aet.closed.ai.server.service;

import de.tum.cit.aet.closed.ai.server.exception.TaskNotFoundException;
import de.tum.cit.aet.closed.ai.server.persistence.model.Task;
import de.tum.cit.aet.closed.ai.server.persistence.model.TaskStatus;
import de.tum.cit.aet.closed.ai.server.persistence.repository.TaskRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class TaskService {
    private final TaskRepository tasks;

    public List<Task> findAll() {
        return tasks.findAll();
    }

    public Optional<Task> findById(Long id) {
        return tasks.findById(id);
    }

    public Task save(Task task) {
        return tasks.save(task);
    }

    public void delete(Long id) {
        tasks.deleteById(id);
    }

    public List<Task> findByAssignee(Long userId) {
        return tasks.findByAssigneeId(userId);
    }

    public List<Task> findByProject(Long projectId) {
        return tasks.findByProjectId(projectId);
    }

    public List<Task> findByStatus(TaskStatus status) {
        return tasks.findByStatus(status);
    }

    public Task setStatus(Long taskId, TaskStatus status) {
        Task task = tasks.findById(taskId).orElseThrow(() -> new TaskNotFoundException("No Task found with ID " + taskId));
        task.setStatus(status);
        return tasks.save(task);
    }
}
