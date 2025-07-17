package de.tum.cit.aet.closed.ai;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import de.tum.cit.aet.closed.ai.exception.TaskNotFoundException;
import de.tum.cit.aet.closed.ai.metrics.TaskMetrics;
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
public class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;
    @Mock
    private TaskMetrics taskMetrics;

    @InjectMocks
    private TaskService taskService;

    private Task testTask1;
    private Task testTask2;
    private User testUser;
    private Project testProject;

    @BeforeEach
    void setUp() {
        // Create test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Test User");

        // Create test project
        testProject = new Project();
        testProject.setId(1L);
        testProject.setName("Test Project");

        // Create test tasks
        testTask1 = new Task();
        testTask1.setId(1L);
        testTask1.setTitle("Test Task 1");
        testTask1.setDescription("Description 1");
        testTask1.setStatus(TaskStatus.OPEN);
        testTask1.setAssignee(testUser);
        testTask1.setProject(testProject);

        testTask2 = new Task();
        testTask2.setId(2L);
        testTask2.setTitle("Test Task 2");
        testTask2.setDescription("Description 2");
        testTask2.setStatus(TaskStatus.IN_PROGRESS);
        testTask2.setAssignee(testUser);
        testTask2.setProject(testProject);
    }

    @Test
    void findAll_ShouldReturnAllTasks() {
        // Arrange
        List<Task> expectedTasks = Arrays.asList(testTask1, testTask2);
        when(taskRepository.findAll()).thenReturn(expectedTasks);

        // Act
        List<Task> actualTasks = taskService.findAll();

        // Assert
        assertEquals(expectedTasks, actualTasks);
        verify(taskRepository).findAll();
    }

    @Test
    void findById_WhenTaskExists_ShouldReturnTask() {
        // Arrange
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask1));

        // Act
        Optional<Task> result = taskService.findById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(testTask1, result.get());
        verify(taskRepository).findById(1L);
    }

    @Test
    void save_ShouldSaveAndReturnTask() {
        // Arrange
        when(taskRepository.save(testTask1)).thenReturn(testTask1);

        // Act
        Task savedTask = taskService.save(testTask1);

        // Assert
        assertEquals(testTask1, savedTask);
        verify(taskRepository).save(testTask1);
    }

    @Test
    void delete_ShouldCallRepositoryAndUpdateMetrics() {
        // Act
        taskService.delete(1L);

        // Assert
        verify(taskRepository).deleteById(1L);
        verify(taskMetrics).incrementTasksDeleted();
    }

    @Test
    void findByStatus_ShouldReturnTasksWithGivenStatus() {
        // Arrange
        List<Task> expectedTasks = List.of(testTask1);
        when(taskRepository.findByStatus(TaskStatus.OPEN)).thenReturn(expectedTasks);

        // Act
        List<Task> actualTasks = taskService.findByStatus(TaskStatus.OPEN);

        // Assert
        assertEquals(expectedTasks, actualTasks);
        verify(taskRepository).findByStatus(TaskStatus.OPEN);
    }

    @Test
    void setStatus_WhenTaskExists_ShouldUpdateStatus() {
        // Arrange
        when(taskRepository.findById(1L)).thenReturn(Optional.of(testTask1));
        when(taskRepository.save(testTask1)).thenReturn(testTask1);

        // Act
        Task updatedTask = taskService.setStatus(1L, TaskStatus.DONE);

        // Assert
        assertEquals(TaskStatus.DONE, updatedTask.getStatus());
        verify(taskRepository).findById(1L);
        verify(taskRepository).save(testTask1);
    }

    @Test
    void setStatus_WhenTaskDoesNotExist_ShouldThrowException() {
        // Arrange
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(TaskNotFoundException.class, () -> taskService.setStatus(99L, TaskStatus.DONE));
        verify(taskRepository).findById(99L);
        verify(taskRepository, never()).save(any(Task.class));
    }
}
