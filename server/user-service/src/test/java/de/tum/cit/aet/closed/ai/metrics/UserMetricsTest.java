package de.tum.cit.aet.closed.ai.metrics;

import static org.junit.jupiter.api.Assertions.assertEquals;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class UserMetricsTest {

  private MeterRegistry registry;
  private UserMetrics userMetrics;

  @BeforeEach
  public void setUp() {
    registry = new SimpleMeterRegistry();
    userMetrics = new UserMetrics(registry);
  }

  @Test
  public void testIncrementUsersCreated() {
    // Arrange & Act
    userMetrics.incrementUsersCreated();

    // Assert
    Counter counter = registry.find("users_created_total").counter();
    assertEquals(1.0, counter.count());
  }

  @Test
  public void testIncrementUsersDeleted() {
    // Arrange & Act
    userMetrics.incrementUsersDeleted();

    // Assert
    Counter counter = registry.find("users_deleted_total").counter();
    assertEquals(1.0, counter.count());
  }

  @Test
  public void testMultipleIncrements() {
    // Arrange & Act
    userMetrics.incrementUsersCreated();
    userMetrics.incrementUsersCreated();

    userMetrics.incrementUsersDeleted();
    userMetrics.incrementUsersDeleted();
    userMetrics.incrementUsersDeleted();

    // Assert
    Counter createdCounter = registry.find("users_created_total").counter();
    assertEquals(2.0, createdCounter.count());

    Counter deletedCounter = registry.find("users_deleted_total").counter();
    assertEquals(3.0, deletedCounter.count());
  }
}
