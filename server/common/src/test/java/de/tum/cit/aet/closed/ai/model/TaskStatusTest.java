package de.tum.cit.aet.closed.ai.model;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class TaskStatusTest {

    @Test
    void testEnumValues() {
        // Ensure all expected enum values exist
        assertEquals(4, TaskStatus.values().length, "There should be 4 task statuses");

        // Test specific enum values
        assertEquals(TaskStatus.BACKLOG, TaskStatus.valueOf("BACKLOG"));
        assertEquals(TaskStatus.OPEN, TaskStatus.valueOf("OPEN"));
        assertEquals(TaskStatus.IN_PROGRESS, TaskStatus.valueOf("IN_PROGRESS"));
        assertEquals(TaskStatus.DONE, TaskStatus.valueOf("DONE"));
    }

    @Test
    void testEnumOrdinals() {
        // Test ordinals to ensure the ordering remains as expected
        assertEquals(0, TaskStatus.BACKLOG.ordinal());
        assertEquals(1, TaskStatus.OPEN.ordinal());
        assertEquals(2, TaskStatus.IN_PROGRESS.ordinal());
        assertEquals(3, TaskStatus.DONE.ordinal());
    }
}
