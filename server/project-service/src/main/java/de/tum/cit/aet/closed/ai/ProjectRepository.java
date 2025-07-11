package de.tum.cit.aet.closed.ai;

import de.tum.cit.aet.closed.ai.model.Project;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

  @Transactional
  @EntityGraph(attributePaths = "tasks")
  Optional<Project> findById(Long id);
}
