package de.tum.cit.aet.closed.ai.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import static org.junit.jupiter.api.Assertions.*;

class UserNotFoundExceptionTest {

    @Test
    void testExceptionMessage() {
        // Given
        String errorMessage = "User not found with ID: 123";

        // When
        UserNotFoundException exception = new UserNotFoundException(errorMessage);

        // Then
        assertEquals(errorMessage, exception.getMessage(), "Exception message should match");
    }

    @Test
    void testResponseStatusAnnotation() {
        // Given
        Class<UserNotFoundException> exceptionClass = UserNotFoundException.class;

        // When
        ResponseStatus annotation = exceptionClass.getAnnotation(ResponseStatus.class);

        // Then
        assertNotNull(annotation, "Class should have @ResponseStatus annotation");
        assertEquals(HttpStatus.NOT_FOUND, annotation.value(),
                "Exception should be mapped to HTTP 404 NOT_FOUND");
    }
}
