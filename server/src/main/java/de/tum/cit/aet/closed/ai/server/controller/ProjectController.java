package de.tum.cit.aet.closed.ai.server.controller;

import de.tum.cit.aet.closed.ai.server.controller.dto.AddTaskDto;
import de.tum.cit.aet.closed.ai.server.controller.dto.CreateProjectDto;
import de.tum.cit.aet.closed.ai.server.controller.dto.ProjectDto;
import de.tum.cit.aet.closed.ai.server.controller.dto.TaskDto;
import de.tum.cit.aet.closed.ai.server.exception.ProjectNotFoundException;
import de.tum.cit.aet.closed.ai.server.persistence.model.Project;
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
    public List<ProjectDto> all() {
        return projectService.findAll().stream()
                .map(ProjectDto::fromProject)
                .toList();
    }

    @GetMapping("/{id}")
    public ProjectDto one(@PathVariable Long id) {
        Project project = projectService.findById(id).orElseThrow(() -> new ProjectNotFoundException("No project with ID " + id));
        return ProjectDto.fromProject(project);
    }

    @PostMapping
    public ProjectDto create(@RequestBody CreateProjectDto createProjectDto) {
        Project project = projectService.createProject(createProjectDto.name());
        return ProjectDto.fromProject(project);
    }

    @PutMapping("/{id}")
    public ProjectDto update(@PathVariable Long id, @RequestBody ProjectDto projectDto) {
        Project project = projectService.findById(id).orElseThrow(() -> new ProjectNotFoundException("No project with ID " + id));
        project.setName(projectDto.name());
        return ProjectDto.fromProject(projectService.save(project));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        projectService.delete(id);
    }

    @PostMapping("/{id}/tasks")
    public TaskDto addTask(@PathVariable Long id, @RequestBody AddTaskDto addTaskDto) {
        return TaskDto.fromTask(projectService.createTask(id, addTaskDto.title(), addTaskDto.description()));
    }
}
