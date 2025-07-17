package de.tum.cit.aet.closed.ai.dto;

import de.tum.cit.aet.closed.ai.model.Project;
import de.tum.cit.aet.closed.ai.model.Task;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ProjectDtoTest {

    @Test
    void testProjectDtoConstructor() {
        // Given
        Long id = 1L;
        String name = "Test Project";
        String color = "#FF5733";
        Instant createdAt = Instant.now();
        Instant updatedAt = Instant.now();
        List<Long> taskIds = List.of(1L, 2L, 3L);

        // When
        ProjectDto dto = new ProjectDto(id, name, color, createdAt, updatedAt, taskIds);

        // Then
        assertEquals(id, dto.id(), "ID should match");
        assertEquals(name, dto.name(), "Name should match");
        assertEquals(color, dto.color(), "Color should match");
        assertEquals(createdAt, dto.createdAt(), "Created at should match");
        assertEquals(updatedAt, dto.updatedAt(), "Updated at should match");
        assertEquals(taskIds, dto.taskIds(), "Task IDs should match");
    }

    @Test
    void testFromProject() {
        // Given
        Project project = new Project();
        project.setId(1L);
        project.setName("Project Name");
        project.setColor("#00FF00");

        Instant createdAt = Instant.now();
        Instant updatedAt = Instant.now().plusSeconds(3600);
        project.setCreatedAt(createdAt);
        project.setUpdatedAt(updatedAt);

        // Create tasks
        List<Task> tasks = new ArrayList<>();

        Task task1 = new Task();
        task1.setId(101L);
        tasks.add(task1);

        Task task2 = new Task();
        task2.setId(102L);
        tasks.add(task2);

        project.setTasks(tasks);

        // When
        ProjectDto dto = ProjectDto.fromProject(project);

        // Then
        assertEquals(project.getId(), dto.id(), "ID should match");
        assertEquals(project.getName(), dto.name(), "Name should match");
        assertEquals(project.getColor(), dto.color(), "Color should match");
        assertEquals(project.getCreatedAt(), dto.createdAt(), "Created at should match");
        assertEquals(project.getUpdatedAt(), dto.updatedAt(), "Updated at should match");

        assertEquals(2, dto.taskIds().size(), "Should have 2 task IDs");
        assertTrue(dto.taskIds().contains(101L), "Should contain task ID 101");
        assertTrue(dto.taskIds().contains(102L), "Should contain task ID 102");
    }

    @Test
    void testFromProjectWithNoTasks() {
        // Given
        Project project = new Project();
        project.setId(1L);
        project.setName("Empty Project");
        project.setTasks(new ArrayList<>());

        // When
        ProjectDto dto = ProjectDto.fromProject(project);

        // Then
        assertEquals(0, dto.taskIds().size(), "Task IDs list should be empty");
    }
}
