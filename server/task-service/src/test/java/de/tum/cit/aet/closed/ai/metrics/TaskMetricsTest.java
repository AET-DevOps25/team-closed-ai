package de.tum.cit.aet.closed.ai.metrics;

import static org.junit.jupiter.api.Assertions.assertEquals;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class TaskMetricsTest {

  private MeterRegistry registry;
  private TaskMetrics taskMetrics;

  @BeforeEach
  public void setUp() {
    registry = new SimpleMeterRegistry();
    taskMetrics = new TaskMetrics(registry);
  }

  @Test
  public void testIncrementTasksDeleted() {
    // Arrange & Act
    taskMetrics.incrementTasksDeleted();

    // Assert
    Counter counter = registry.find("tasks_deleted_total").counter();
    assertEquals(1.0, counter.count());
  }

  @Test
  public void testMultipleIncrements() {
    // Arrange & Act
    taskMetrics.incrementTasksDeleted();
    taskMetrics.incrementTasksDeleted();

    // Assert
    Counter counter = registry.find("tasks_deleted_total").counter();
    assertEquals(2.0, counter.count());
  }
}
