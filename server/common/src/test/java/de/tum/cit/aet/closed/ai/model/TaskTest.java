package de.tum.cit.aet.closed.ai.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class TaskTest {

    @Test
    void testTaskGettersAndSetters() {
        // Given
        Task task = new Task();

        // When
        task.setId(1L);
        task.setTitle("Task Title");
        task.setDescription("Task Description");
        task.setStatus(TaskStatus.IN_PROGRESS);

        Project project = new Project();
        project.setId(2L);
        project.setName("Project Name");
        task.setProject(project);

        // Then
        assertEquals(1L, task.getId(), "ID should match");
        assertEquals("Task Title", task.getTitle(), "Title should match");
        assertEquals("Task Description", task.getDescription(), "Description should match");
        assertEquals(TaskStatus.IN_PROGRESS, task.getStatus(), "Status should match");
        assertEquals(project, task.getProject(), "Project should match");
    }

    @Test
    void testTaskStatusTransition() {
        // Given
        Task task = new Task();
        task.setStatus(TaskStatus.BACKLOG);

        // When
        task.setStatus(TaskStatus.OPEN);

        // Then
        assertEquals(TaskStatus.OPEN, task.getStatus(), "Status should be updated");

        // When
        task.setStatus(TaskStatus.IN_PROGRESS);

        // Then
        assertEquals(TaskStatus.IN_PROGRESS, task.getStatus(), "Status should be updated to IN_PROGRESS");

        // When
        task.setStatus(TaskStatus.DONE);

        // Then
        assertEquals(TaskStatus.DONE, task.getStatus(), "Status should be updated to DONE");
    }
}
