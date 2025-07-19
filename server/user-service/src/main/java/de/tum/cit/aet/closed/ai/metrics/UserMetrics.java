package de.tum.cit.aet.closed.ai.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

@Component
public class UserMetrics {
  private final Counter usersCreatedCounter;
  private final Counter usersDeletedCounter;

  public UserMetrics(MeterRegistry registry) {
    this.usersCreatedCounter =
        Counter.builder("users_created_total")
            .description("Total number of users created")
            .register(registry);

    this.usersDeletedCounter =
        Counter.builder("users_deleted_total")
            .description("Total number of users deleted")
            .register(registry);
  }

  public void incrementUsersCreated() {
    usersCreatedCounter.increment();
  }

  public void incrementUsersDeleted() {
    usersDeletedCounter.increment();
  }
}
