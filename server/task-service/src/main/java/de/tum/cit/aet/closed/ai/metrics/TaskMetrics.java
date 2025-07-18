package de.tum.cit.aet.closed.ai.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

@Component
public class TaskMetrics {
  private final Counter tasksDeletedCounter;

  public TaskMetrics(MeterRegistry registry) {

    this.tasksDeletedCounter =
        Counter.builder("tasks_deleted_total")
            .description("Total number of tasks deleted")
            .register(registry);
  }

  public void incrementTasksDeleted() {
    tasksDeletedCounter.increment();
  }
}
