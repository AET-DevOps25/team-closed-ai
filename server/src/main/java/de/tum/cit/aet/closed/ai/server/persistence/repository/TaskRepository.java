package de.tum.cit.aet.closed.ai.server.persistence.repository;

import de.tum.cit.aet.closed.ai.server.persistence.model.Task;
import de.tum.cit.aet.closed.ai.server.persistence.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssigneeId(Long userId);
    List<Task> findByProjectId(Long projectId);
    List<Task> findByStatus(TaskStatus status);
}