package de.tum.cit.aet.closed.ai;

import de.tum.cit.aet.closed.ai.dto.AddTaskDto;
import de.tum.cit.aet.closed.ai.dto.CreateProjectDto;
import de.tum.cit.aet.closed.ai.dto.ProjectDto;
import de.tum.cit.aet.closed.ai.dto.TaskDto;
import de.tum.cit.aet.closed.ai.exception.ProjectNotFoundException;
import de.tum.cit.aet.closed.ai.model.Project;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/projects")
@AllArgsConstructor
@Tag(
    name = "Project Management",
    description = "Operations for managing projects including CRUD operations and task assignment")
public class ProjectController {
  private final ProjectService projectService;

  @GetMapping
  @Transactional(readOnly = true)
  @Operation(
      summary = "Get all projects",
      description = "Retrieve a list of all projects in the system")
  @ApiResponse(responseCode = "200", description = "Successfully retrieved list of projects")
  public List<ProjectDto> all() {
    return projectService.findAll().stream().map(ProjectDto::fromProject).toList();
  }

  @GetMapping("/{id}")
  @Operation(
      summary = "Get project by ID",
      description = "Retrieve a specific project by its unique identifier")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Project found and returned successfully"),
        @ApiResponse(responseCode = "404", description = "Project not found with the provided ID")
      })
  public ProjectDto one(
      @Parameter(description = "Unique identifier of the project", required = true) @PathVariable
          Long id) {
    Project project =
        projectService
            .findById(id)
            .orElseThrow(() -> new ProjectNotFoundException("No project with ID " + id));
    return ProjectDto.fromProject(project);
  }

  @PostMapping
  @Operation(
      summary = "Create a new project",
      description = "Create a new project with the provided information")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Project created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid project data provided")
      })
  public ProjectDto create(@RequestBody CreateProjectDto createProjectDto) {
    Project project =
        projectService.createProject(createProjectDto.name(), createProjectDto.color());
    return ProjectDto.fromProject(project);
  }

  @PutMapping("/{id}")
  @Operation(summary = "Update project", description = "Update an existing project's information")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Project updated successfully"),
        @ApiResponse(responseCode = "404", description = "Project not found with the provided ID"),
        @ApiResponse(responseCode = "400", description = "Invalid project data provided")
      })
  public ProjectDto update(
      @Parameter(description = "Unique identifier of the project to update", required = true)
          @PathVariable
          Long id,
      @RequestBody ProjectDto projectDto) {
    Project project =
        projectService
            .findById(id)
            .orElseThrow(() -> new ProjectNotFoundException("No project with ID " + id));
    project.setName(projectDto.name());
    return ProjectDto.fromProject(projectService.save(project));
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete project", description = "Delete a project from the system")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "Project deleted successfully"),
        @ApiResponse(responseCode = "404", description = "Project not found with the provided ID")
      })
  public void delete(
      @Parameter(description = "Unique identifier of the project to delete", required = true)
          @PathVariable
          Long id) {
    projectService.delete(id);
  }

  @PostMapping("/{id}/tasks")
  @Operation(
      summary = "Add task to project",
      description = "Create and assign a new task to the specified project")
  @ApiResponses(
      value = {
        @ApiResponse(
            responseCode = "200",
            description = "Task created and assigned to project successfully"),
        @ApiResponse(responseCode = "404", description = "Project not found with the provided ID"),
        @ApiResponse(responseCode = "400", description = "Invalid task data provided")
      })
  public TaskDto addTask(
      @Parameter(description = "Unique identifier of the project", required = true) @PathVariable
          Long id,
      @RequestBody AddTaskDto addTaskDto) {
    return TaskDto.fromTask(
        projectService.createTask(
            id,
            addTaskDto.title(),
            addTaskDto.description(),
            addTaskDto.taskStatus(),
            addTaskDto.assigneeId()));
  }
}
