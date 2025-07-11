package de.tum.cit.aet.closed.ai;

import de.tum.cit.aet.closed.ai.model.Task;
import de.tum.cit.aet.closed.ai.model.TaskStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
  List<Task> findByAssigneeId(Long userId);

  List<Task> findByProjectId(Long projectId);

  List<Task> findByStatus(TaskStatus status);
}
