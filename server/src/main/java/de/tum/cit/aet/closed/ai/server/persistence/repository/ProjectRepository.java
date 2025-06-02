package de.tum.cit.aet.closed.ai.server.persistence.repository;

import de.tum.cit.aet.closed.ai.server.persistence.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findByName(String name);
}
