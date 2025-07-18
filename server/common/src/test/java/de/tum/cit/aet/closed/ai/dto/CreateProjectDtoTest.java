package de.tum.cit.aet.closed.ai.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class CreateProjectDtoTest {

    @Test
    void testCreateProjectDto() {
        // Given
        String name = "Test Project";
        String color = "#FF5733";

        // When
        CreateProjectDto dto = new CreateProjectDto(name, color);

        // Then
        assertEquals(name, dto.name(), "Project name should match the input");
        assertEquals(color, dto.color(), "Project color should match the input");
    }

    @Test
    void testEquality() {
        // Given
        CreateProjectDto dto1 = new CreateProjectDto("Project 1", "#FF5733");
        CreateProjectDto dto2 = new CreateProjectDto("Project 1", "#FF5733");
        CreateProjectDto dto3 = new CreateProjectDto("Project 2", "#FF5733");

        // Then
        assertEquals(dto1, dto2, "DTOs with same values should be equal");
        assertNotEquals(dto1, dto3, "DTOs with different values should not be equal");
    }
}
