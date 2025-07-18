package de.tum.cit.aet.closed.ai.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ProjectTest {

    @Test
    void testCreateTask() {
        // Given
        Project project = new Project();
        project.setId(1L);
        project.setName("Test Project");
        project.setColor("#FF5733");

        String taskTitle = "Task Title";
        String taskDesc = "Task Description";
        TaskStatus taskStatus = TaskStatus.OPEN;

        // When
        Task task = project.createTask(taskTitle, taskDesc, taskStatus);

        // Then
        assertEquals(taskTitle, task.getTitle(), "Task title should match");
        assertEquals(taskDesc, task.getDescription(), "Task description should match");
        assertEquals(taskStatus, task.getStatus(), "Task status should match");
        assertEquals(project, task.getProject(), "Task should be linked to the project");

        // The task should be added to the project's tasks list
        assertTrue(project.getTasks().contains(task), "Project should contain the created task");
        assertEquals(1, project.getTasks().size(), "Project should have one task");
    }
}
