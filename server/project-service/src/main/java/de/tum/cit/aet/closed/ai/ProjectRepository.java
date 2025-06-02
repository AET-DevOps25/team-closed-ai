package de.tum.cit.aet.closed.ai;

import de.tum.cit.aet.closed.ai.model.Project;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    @EntityGraph(attributePaths = "tasks")
    Optional<Project> findById(Long id);
}
