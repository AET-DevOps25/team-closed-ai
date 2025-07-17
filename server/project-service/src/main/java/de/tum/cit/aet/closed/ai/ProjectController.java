package de.tum.cit.aet.closed.ai;


import de.tum.cit.aet.closed.ai.dto.AddTaskDto;
import de.tum.cit.aet.closed.ai.dto.CreateProjectDto;
import de.tum.cit.aet.closed.ai.dto.ProjectDto;
import de.tum.cit.aet.closed.ai.dto.TaskDto;
import de.tum.cit.aet.closed.ai.exception.ProjectNotFoundException;
import de.tum.cit.aet.closed.ai.model.Project;
import de.tum.cit.aet.closed.ai.model.TaskStatus;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
@AllArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @GetMapping
    @Transactional(readOnly = true)
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
        Project project = projectService.createProject(createProjectDto.name(), createProjectDto.color());
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
    public List<TaskDto> addTasks(@PathVariable Long id, @RequestBody List<AddTaskDto> addTaskDtos) {
        return addTaskDtos.stream()
                .map(addTaskDto -> projectService.createTask(id, addTaskDto.title(), addTaskDto.description(), addTaskDto.taskStatus(), addTaskDto.assigneeId()))
                .map(TaskDto::fromTask)
                .toList();
    }
}
