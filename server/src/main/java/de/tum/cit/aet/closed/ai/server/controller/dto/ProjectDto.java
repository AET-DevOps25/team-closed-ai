package de.tum.cit.aet.closed.ai.server.controller.dto;

import de.tum.cit.aet.closed.ai.server.persistence.model.Project;
import de.tum.cit.aet.closed.ai.server.persistence.model.Task;

import java.util.List;

public record ProjectDto(
        Long id,
        String name,
        List<Long> taskIds
) {
    public static ProjectDto fromProject(Project project) {
        var taskIds = project.getTasks().stream().map(Task::getId).toList();
        return new ProjectDto(project.getId(), project.getName(), taskIds);
    }
}
