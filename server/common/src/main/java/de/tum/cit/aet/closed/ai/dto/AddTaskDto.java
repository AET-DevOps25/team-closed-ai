package de.tum.cit.aet.closed.ai.dto;

import de.tum.cit.aet.closed.ai.model.TaskStatus;

public record AddTaskDto(
        String title,
        String description,
        TaskStatus taskStatus,
        Long assigneeId
) {
    // Constructor that provides default status when null
    public AddTaskDto(String title, String description, TaskStatus taskStatus, Long assigneeId) {
        this.title = title;
        this.description = description;
        this.taskStatus = taskStatus != null ? taskStatus : TaskStatus.BACKLOG;
        this.assigneeId = assigneeId;
    }
}
