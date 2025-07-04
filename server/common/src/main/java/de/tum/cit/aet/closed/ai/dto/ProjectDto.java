package de.tum.cit.aet.closed.ai.dto;


import de.tum.cit.aet.closed.ai.model.Project;
import de.tum.cit.aet.closed.ai.model.Task;

import java.time.Instant;
import java.util.List;

public record ProjectDto(
        Long id,
        String name,
        String color,
        Instant createdAt,
        Instant updatedAt,
        List<Long> taskIds
) {
    public static ProjectDto fromProject(Project project) {
        var taskIds = project.getTasks().stream().map(Task::getId).toList();
        return new ProjectDto(
                project.getId(), 
                project.getName(), 
                project.getColor(),
                project.getCreatedAt(),
                project.getUpdatedAt(),
                taskIds
        );
    }
}
