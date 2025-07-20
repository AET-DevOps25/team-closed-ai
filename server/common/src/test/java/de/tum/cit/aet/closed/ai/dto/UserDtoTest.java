package de.tum.cit.aet.closed.ai.dto;

import de.tum.cit.aet.closed.ai.model.User;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import java.time.Instant;

class UserDtoTest {

    @Test
    void testUserDtoConstructor() {
        // Given
        Long id = 1L;
        String name = "John Doe";
        String profilePicture = "avatar.jpg";
        Instant createdAt = Instant.now();
        Instant updatedAt = Instant.now();

        // When
        UserDto dto = new UserDto(id, name, profilePicture, createdAt, updatedAt);

        // Then
        assertEquals(id, dto.id(), "ID should match");
        assertEquals(name, dto.name(), "Name should match");
        assertEquals(profilePicture, dto.profilePicture(), "Profile picture should match");
        assertEquals(createdAt, dto.createdAt(), "Created at should match");
        assertEquals(updatedAt, dto.updatedAt(), "Updated at should match");
    }

    @Test
    void testFromUser() {
        // Given
        User user = new User();
        user.setId(1L);
        user.setName("Jane Smith");
        user.setProfilePicture("profile.png");
        Instant createdAt = Instant.now();
        Instant updatedAt = Instant.now().plusSeconds(3600);
        user.setCreatedAt(createdAt);
        user.setUpdatedAt(updatedAt);

        // When
        UserDto dto = UserDto.fromUser(user);

        // Then
        assertEquals(user.getId(), dto.id(), "ID should match the user");
        assertEquals(user.getName(), dto.name(), "Name should match the user");
        assertEquals(user.getProfilePicture(), dto.profilePicture(), "Profile picture should match the user");
        assertEquals(user.getCreatedAt(), dto.createdAt(), "Created at should match the user");
        assertEquals(user.getUpdatedAt(), dto.updatedAt(), "Updated at should match the user");
    }
}
