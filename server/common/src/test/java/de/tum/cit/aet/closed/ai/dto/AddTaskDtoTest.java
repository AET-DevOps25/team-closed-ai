package de.tum.cit.aet.closed.ai.dto;

import de.tum.cit.aet.closed.ai.model.TaskStatus;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AddTaskDtoTest {

    @Test
    void testAddTaskDtoWithAllFields() {
        // Given
        String title = "Task Title";
        String description = "Task Description";
        TaskStatus status = TaskStatus.OPEN;
        Long assigneeId = 1L;

        // When
        AddTaskDto dto = new AddTaskDto(title, description, status, assigneeId);

        // Then
        assertEquals(title, dto.title(), "Title should match the input");
        assertEquals(description, dto.description(), "Description should match the input");
        assertEquals(status, dto.taskStatus(), "Task status should match the input");
        assertEquals(assigneeId, dto.assigneeId(), "Assignee ID should match the input");
    }

    @Test
    void testAddTaskDtoDefaultStatusWhenNull() {
        // Given
        String title = "Task Title";
        String description = "Task Description";
        Long assigneeId = 1L;

        // When
        AddTaskDto dto = new AddTaskDto(title, description, null, assigneeId);

        // Then
        assertEquals(TaskStatus.BACKLOG, dto.taskStatus(),
                "Task status should default to BACKLOG when null is provided");
    }

    @Test
    void testEquality() {
        // Given
        AddTaskDto dto1 = new AddTaskDto("Task 1", "Description", TaskStatus.OPEN, 1L);
        AddTaskDto dto2 = new AddTaskDto("Task 1", "Description", TaskStatus.OPEN, 1L);
        AddTaskDto dto3 = new AddTaskDto("Task 2", "Description", TaskStatus.OPEN, 1L);

        // Then
        assertEquals(dto1, dto2, "DTOs with same values should be equal");
        assertNotEquals(dto1, dto3, "DTOs with different values should not be equal");
    }
}
