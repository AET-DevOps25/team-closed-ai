package de.tum.cit.aet.closed.ai.metrics;

import static org.junit.jupiter.api.Assertions.assertEquals;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class ProjectMetricsTest {

  private MeterRegistry registry;
  private ProjectMetrics projectMetrics;

  @BeforeEach
  public void setUp() {
    registry = new SimpleMeterRegistry();
    projectMetrics = new ProjectMetrics(registry);
  }

  @Test
  public void testIncrementProjectsCreated() {
    // Arrange & Act
    projectMetrics.incrementProjectsCreated();

    // Assert
    Counter counter = registry.find("projects_created_total").counter();
    assertEquals(1.0, counter.count());
  }

  @Test
  public void testIncrementProjectsDeleted() {
    // Arrange & Act
    projectMetrics.incrementProjectsDeleted();

    // Assert
    Counter counter = registry.find("projects_deleted_total").counter();
    assertEquals(1.0, counter.count());
  }

  @Test
  public void testIncrementTasksCreated() {
    // Arrange & Act
    projectMetrics.incrementTasksCreated();

    // Assert
    Counter counter = registry.find("tasks_created_total").counter();
    assertEquals(1.0, counter.count());
  }

  @Test
  public void testMultipleIncrements() {
    // Arrange & Act
    projectMetrics.incrementProjectsCreated();
    projectMetrics.incrementProjectsCreated();
    projectMetrics.incrementProjectsCreated();

    // Assert
    Counter counter = registry.find("projects_created_total").counter();
    assertEquals(3.0, counter.count());
  }
}
