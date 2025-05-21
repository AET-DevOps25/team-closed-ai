package de.tum.cit.aet.closed.ai.server.service;

import de.tum.cit.aet.closed.ai.server.exception.ProjectNotFoundException;
import de.tum.cit.aet.closed.ai.server.persistence.model.Project;
import de.tum.cit.aet.closed.ai.server.persistence.model.Task;
import de.tum.cit.aet.closed.ai.server.persistence.repository.ProjectRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProjectService {
    private final ProjectRepository projects;

    public List<Project> findAll() {
        return projects.findAll();
    }

    public Optional<Project> findById(Long id) {
        return projects.findById(id);
    }

    public Project save(Project project) {
        return projects.save(project);
    }

    public void delete(Long id) {
        projects.deleteById(id);
    }

    public Task createTask(Long projectId, String title, String desc) {
        Project project = projects.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("No such project"));
        Task task = project.createTask(title, desc);
        projects.save(project);
        return task;
    }
}
