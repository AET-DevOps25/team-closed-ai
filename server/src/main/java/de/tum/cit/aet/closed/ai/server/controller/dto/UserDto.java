package de.tum.cit.aet.closed.ai.server.controller.dto;

import de.tum.cit.aet.closed.ai.server.persistence.model.User;

public record UserDto(
        Long id,
        String name,
        String profilePicture
) {
    public static UserDto fromUser(User user) {
        return new UserDto(user.getId(), user.getName(), user.getProfilePicture());
    }
}
