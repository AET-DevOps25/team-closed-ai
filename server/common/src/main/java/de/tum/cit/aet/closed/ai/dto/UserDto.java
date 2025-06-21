package de.tum.cit.aet.closed.ai.dto;

import de.tum.cit.aet.closed.ai.model.User;

import java.time.LocalDateTime;

public record UserDto(
        Long id,
        String name,
        String profilePicture,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static UserDto fromUser(User user) {
        return new UserDto(
                user.getId(), 
                user.getName(), 
                user.getProfilePicture(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}
