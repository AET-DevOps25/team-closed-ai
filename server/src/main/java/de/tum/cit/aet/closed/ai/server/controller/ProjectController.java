package de.tum.cit.aet.closed.ai.server.controller;

import de.tum.cit.aet.closed.ai.server.persistence.model.Project;
import de.tum.cit.aet.closed.ai.server.persistence.model.Task;
import de.tum.cit.aet.closed.ai.server.service.ProjectService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
@AllArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @GetMapping
    public List<Project> all() {
        return projectService.findAll();
    }

    @GetMapping("/{id}")
    public Project one(@PathVariable Long id) {
        return projectService.findById(id).orElseThrow();
    }

    @PostMapping
    public Project create(@RequestBody Project project) {
        return projectService.save(project);
    }

    @PutMapping("/{id}")
    public Project update(@PathVariable Long id, @RequestBody Project project) {
        project.setId(id);
        return projectService.save(project);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        projectService.delete(id);
    }

    @PostMapping("/{id}/tasks")
    public Task addTask(@PathVariable Long id, @RequestParam String title,
                 @RequestParam String desc) {
        return projectService.createTask(id, title, desc);
    }
}
