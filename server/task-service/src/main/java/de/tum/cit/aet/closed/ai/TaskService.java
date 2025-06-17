package de.tum.cit.aet.closed.ai;


import de.tum.cit.aet.closed.ai.exception.TaskNotFoundException;
import de.tum.cit.aet.closed.ai.model.Task;
import de.tum.cit.aet.closed.ai.model.TaskStatus;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class TaskService {
    private final TaskRepository tasks;

    @Transactional(readOnly = true)
    public List<Task> findAll() {
        return tasks.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Task> findById(Long id) {
        return tasks.findById(id);
    }

    @Transactional
    public Task save(Task task) {
        return tasks.save(task);
    }

    @Transactional
    public void delete(Long id) {
        tasks.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Task> findByAssignee(Long userId) {
        return tasks.findByAssigneeId(userId);
    }

    @Transactional(readOnly = true)
    public List<Task> findByProject(Long projectId) {
        return tasks.findByProjectId(projectId);
    }

    @Transactional(readOnly = true)
    public List<Task> findByStatus(TaskStatus status) {
        return tasks.findByStatus(status);
    }

    @Transactional
    public Task setStatus(Long taskId, TaskStatus status) {
        Task task = tasks.findById(taskId).orElseThrow(() -> new TaskNotFoundException("No Task found with ID " + taskId));
        task.setStatus(status);
        return tasks.save(task);
    }
}
