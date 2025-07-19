package de.tum.cit.aet.closed.ai;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import de.tum.cit.aet.closed.ai.client.UserServiceClient;
import de.tum.cit.aet.closed.ai.exception.ProjectNotFoundException;
import de.tum.cit.aet.closed.ai.metrics.ProjectMetrics;
import de.tum.cit.aet.closed.ai.model.Project;
import de.tum.cit.aet.closed.ai.model.Task;
import de.tum.cit.aet.closed.ai.model.TaskStatus;
import de.tum.cit.aet.closed.ai.model.User;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class ProjectServiceTest {

  @Mock private ProjectRepository projectRepository;

  @Mock private UserServiceClient userServiceClient;

  @Mock private ProjectMetrics projectMetrics;

  @InjectMocks private ProjectService projectService;

  private Project testProject1;
  private Project testProject2;
  private User testUser;
  private Task testTask;

  @BeforeEach
  void setUp() {
    // Create test user
    testUser = new User();
    testUser.setId(1L);
    testUser.setName("Test User");

    // Create test projects
    testProject1 = new Project();
    testProject1.setId(1L);
    testProject1.setName("Test Project 1");
    testProject1.setColor("#FF0000");

    testProject2 = new Project();
    testProject2.setId(2L);
    testProject2.setName("Test Project 2");
    testProject2.setColor("#00FF00");

    // Create test task
    testTask = new Task();
    testTask.setId(1L);
    testTask.setTitle("Test Task");
    testTask.setDescription("Test Description");
    testTask.setStatus(TaskStatus.OPEN);
    testTask.setProject(testProject1);
    testTask.setAssignee(testUser);

    testProject1.getTasks().add(testTask);
  }

  @Test
  void findAll_ShouldReturnAllProjects() {
    // Arrange
    List<Project> expectedProjects = Arrays.asList(testProject1, testProject2);
    when(projectRepository.findAll()).thenReturn(expectedProjects);

    // Act
    List<Project> actualProjects = projectService.findAll();

    // Assert
    assertEquals(expectedProjects, actualProjects);
    verify(projectRepository).findAll();
  }

  @Test
  void findById_WhenProjectExists_ShouldReturnProject() {
    // Arrange
    when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject1));

    // Act
    Optional<Project> result = projectService.findById(1L);

    // Assert
    assertTrue(result.isPresent());
    assertEquals(testProject1, result.get());
    verify(projectRepository).findById(1L);
  }

  @Test
  void save_ShouldSaveAndReturnProject() {
    // Arrange
    when(projectRepository.save(testProject1)).thenReturn(testProject1);

    // Act
    Project savedProject = projectService.save(testProject1);

    // Assert
    assertEquals(testProject1, savedProject);
    verify(projectRepository).save(testProject1);
  }

  @Test
  void delete_WhenProjectExists_ShouldCallRepositoryAndUpdateMetrics() {
    // Arrange
    when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject1));

    // Act
    projectService.delete(1L);

    // Assert
    verify(projectRepository).findById(1L);
    verify(projectRepository).deleteById(1L);
    verify(projectMetrics).incrementProjectsDeleted();
  }

  @Test
  void delete_WhenProjectDoesNotExist_ShouldThrowException() {
    // Arrange
    when(projectRepository.findById(99L)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(ProjectNotFoundException.class, () -> projectService.delete(99L));
    verify(projectRepository).findById(99L);
    verify(projectRepository, never()).deleteById(anyLong());
    verify(projectMetrics, never()).incrementProjectsDeleted();
  }

  @Test
  void createProject_ShouldCreateAndSaveProject() {
    // Arrange
    String projectName = "New Project";
    String projectColor = "#0000FF";
    Project newProject = new Project();
    newProject.setName(projectName);
    newProject.setColor(projectColor);

    when(projectRepository.save(any(Project.class))).thenReturn(newProject);

    // Act
    Project createdProject = projectService.createProject(projectName, projectColor);

    // Assert
    assertEquals(projectName, createdProject.getName());
    assertEquals(projectColor, createdProject.getColor());
    verify(projectRepository).save(any(Project.class));
    verify(projectMetrics).incrementProjectsCreated();
  }

  @Test
  void createTask_WhenProjectExistsAndNoAssignee_ShouldCreateTask() {
    // Arrange
    String taskTitle = "New Task";
    String taskDesc = "New Description";
    TaskStatus taskStatus = TaskStatus.OPEN;

    Project projectWithTask = new Project();
    projectWithTask.setId(1L);
    projectWithTask.setName("Test Project");
    projectWithTask.createTask(taskTitle, taskDesc, taskStatus);

    when(projectRepository.findById(1L))
        .thenReturn(Optional.of(testProject1))
        .thenReturn(Optional.of(projectWithTask));

    // Act
    Task createdTask = projectService.createTask(1L, taskTitle, taskDesc, taskStatus, null);

    // Assert
    assertNotNull(createdTask);
    assertEquals(taskTitle, createdTask.getTitle());
    assertEquals(taskDesc, createdTask.getDescription());
    assertEquals(taskStatus, createdTask.getStatus());
    verify(projectRepository, times(2)).findById(1L);
    verify(projectMetrics).incrementTasksCreated();
    verify(userServiceClient, never()).findById(anyLong());
  }

  @Test
  void createTask_WhenProjectExistsAndAssigneeExists_ShouldCreateTaskWithAssignee() {
    // Arrange
    String taskTitle = "New Task";
    String taskDesc = "New Description";
    TaskStatus taskStatus = TaskStatus.OPEN;
    Long assigneeId = 1L;

    Project projectWithTask = new Project();
    projectWithTask.setId(1L);
    projectWithTask.setName("Test Project");
    Task newTask = projectWithTask.createTask(taskTitle, taskDesc, taskStatus);
    newTask.setAssignee(testUser);

    when(projectRepository.findById(1L))
        .thenReturn(Optional.of(testProject1))
        .thenReturn(Optional.of(projectWithTask));

    when(userServiceClient.findById(assigneeId))
        .thenReturn(
            Optional.of(
                new de.tum.cit.aet.closed.ai.dto.UserDto(
                    testUser.getId(),
                    testUser.getName(),
                    testUser.getProfilePicture(),
                    null,
                    null)));

    // Act
    Task createdTask = projectService.createTask(1L, taskTitle, taskDesc, taskStatus, assigneeId);

    // Assert
    assertNotNull(createdTask);
    assertEquals(taskTitle, createdTask.getTitle());
    assertEquals(taskDesc, createdTask.getDescription());
    assertEquals(taskStatus, createdTask.getStatus());
    assertNotNull(createdTask.getAssignee());
    assertEquals(assigneeId, createdTask.getAssignee().getId());
    verify(projectRepository, times(2)).findById(1L);
    verify(projectMetrics).incrementTasksCreated();
    verify(userServiceClient).findById(assigneeId);
  }

  @Test
  void createTask_WhenProjectDoesNotExist_ShouldThrowException() {
    // Arrange
    String taskTitle = "New Task";
    String taskDesc = "New Description";
    TaskStatus taskStatus = TaskStatus.OPEN;
    when(projectRepository.findById(99L)).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(
        ProjectNotFoundException.class,
        () -> projectService.createTask(99L, taskTitle, taskDesc, taskStatus, null));
    verify(projectRepository).findById(99L);
    verify(projectMetrics, never()).incrementTasksCreated();
  }

  @Test
  void createTask_WhenAssigneeDoesNotExist_ShouldCreateTaskWithoutAssignee() {
    // Arrange
    String taskTitle = "New Task";
    String taskDesc = "New Description";
    TaskStatus taskStatus = TaskStatus.OPEN;
    Long assigneeId = 99L;

    Project projectWithTask = new Project();
    projectWithTask.setId(1L);
    projectWithTask.setName("Test Project");
    projectWithTask.createTask(taskTitle, taskDesc, taskStatus);

    when(projectRepository.findById(1L))
        .thenReturn(Optional.of(testProject1))
        .thenReturn(Optional.of(projectWithTask));

    when(userServiceClient.findById(assigneeId)).thenReturn(Optional.empty());

    // Act
    Task createdTask = projectService.createTask(1L, taskTitle, taskDesc, taskStatus, assigneeId);

    // Assert
    assertNotNull(createdTask);
    assertEquals(taskTitle, createdTask.getTitle());
    assertEquals(taskDesc, createdTask.getDescription());
    assertEquals(taskStatus, createdTask.getStatus());
    assertNull(createdTask.getAssignee());
    verify(projectRepository, times(2)).findById(1L);
    verify(projectMetrics).incrementTasksCreated();
    verify(userServiceClient).findById(assigneeId);
  }
}
