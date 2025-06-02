package de.tum.cit.aet.closed.ai.server.controller.dto;

import de.tum.cit.aet.closed.ai.server.persistence.model.Task;

public record AddTaskDto(
        String title,
        String description
) {
}
