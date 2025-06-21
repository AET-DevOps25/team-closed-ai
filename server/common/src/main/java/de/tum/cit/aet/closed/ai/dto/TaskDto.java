package de.tum.cit.aet.closed.ai.dto;

import de.tum.cit.aet.closed.ai.model.Task;
import de.tum.cit.aet.closed.ai.model.TaskStatus;
import de.tum.cit.aet.closed.ai.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public record TaskDto(
        Long id,
        String title,
        String description,
        TaskStatus taskStatus,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        List<String> comments,
        List<String> attachments,
        Long assigneeId
) {
    public static TaskDto fromTask(Task task) {
        return new TaskDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getCreatedAt(),
                task.getUpdatedAt(),
                task.getComments(),
                task.getAttachments(),
                Optional.ofNullable(task.getAssignee()).map(User::getId).orElse(null)
        );
    }
}
