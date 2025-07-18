package de.tum.cit.aet.closed.ai.dto;

import de.tum.cit.aet.closed.ai.model.Task;
import de.tum.cit.aet.closed.ai.model.TaskStatus;
import de.tum.cit.aet.closed.ai.model.User;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class TaskDtoTest {

    @Test
    void testTaskDtoConstructor() {
        // Given
        Long id = 1L;
        String title = "Test Task";
        String description = "Task Description";
        TaskStatus status = TaskStatus.OPEN;
        Instant createdAt = Instant.now();
        Instant updatedAt = Instant.now();
        List<String> comments = new ArrayList<>();
        List<String> attachments = new ArrayList<>();
        Long assigneeId = 3L;

        // When
        TaskDto dto = new TaskDto(id, title, description, status, createdAt, updatedAt,
                comments, attachments, assigneeId);

        // Then
        assertEquals(id, dto.id(), "ID should match");
        assertEquals(title, dto.title(), "Title should match");
        assertEquals(description, dto.description(), "Description should match");
        assertEquals(status, dto.taskStatus(), "Status should match");
        assertEquals(createdAt, dto.createdAt(), "Created at should match");
        assertEquals(updatedAt, dto.updatedAt(), "Updated at should match");
        assertEquals(comments, dto.comments(), "Comments should match");
        assertEquals(attachments, dto.attachments(), "Attachments should match");
        assertEquals(assigneeId, dto.assigneeId(), "Assignee ID should match");
    }

    @Test
    void testFromTask() {
        // Given
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Task Title");
        task.setDescription("Task Description");
        task.setStatus(TaskStatus.IN_PROGRESS);

        Instant createdAt = Instant.now();
        Instant updatedAt = Instant.now().plusSeconds(3600);
        task.setCreatedAt(createdAt);
        task.setUpdatedAt(updatedAt);

        List<String> comments = List.of("Comment 1", "Comment 2");
        task.setComments(comments);

        List<String> attachments = List.of("attachment1.pdf");
        task.setAttachments(attachments);

        User assignee = new User();
        assignee.setId(5L);
        task.setAssignee(assignee);

        // When
        TaskDto dto = TaskDto.fromTask(task);

        // Then
        assertEquals(task.getId(), dto.id(), "ID should match");
        assertEquals(task.getTitle(), dto.title(), "Title should match");
        assertEquals(task.getDescription(), dto.description(), "Description should match");
        assertEquals(task.getStatus(), dto.taskStatus(), "Status should match");
        assertEquals(task.getCreatedAt(), dto.createdAt(), "Created at should match");
        assertEquals(task.getUpdatedAt(), dto.updatedAt(), "Updated at should match");
        assertEquals(task.getComments(), dto.comments(), "Comments should match");
        assertEquals(task.getAttachments(), dto.attachments(), "Attachments should match");
        assertEquals(assignee.getId(), dto.assigneeId(), "Assignee ID should match");
    }

    @Test
    void testFromTaskWithNullAssignee() {
        // Given
        Task task = new Task();
        task.setId(1L);
        task.setTitle("Task Title");
        task.setDescription("Task Description");
        task.setStatus(TaskStatus.OPEN);
        task.setAssignee(null); // Null assignee

        // When
        TaskDto dto = TaskDto.fromTask(task);

        // Then
        assertNull(dto.assigneeId(), "Assignee ID should be null when task has no assignee");
    }
}
