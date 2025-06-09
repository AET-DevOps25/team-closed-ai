package de.tum.cit.aet.closed.ai.dto;

import de.tum.cit.aet.closed.ai.model.TaskStatus;

public record AddTaskDto(
        String title,
        String description,
        TaskStatus taskStatus
) {
}
