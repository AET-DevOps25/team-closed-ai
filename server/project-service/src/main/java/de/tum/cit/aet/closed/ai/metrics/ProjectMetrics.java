package de.tum.cit.aet.closed.ai.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.stereotype.Component;

@Component
public class ProjectMetrics {
  private final Counter projectsCreatedCounter;
  private final Counter projectsDeletedCounter;
  private final Counter tasksCreatedCounter;

  public ProjectMetrics(MeterRegistry registry) {
    this.projectsCreatedCounter =
        Counter.builder("projects_created_total")
            .description("Total number of projects created")
            .register(registry);

    this.projectsDeletedCounter =
        Counter.builder("projects_deleted_total")
            .description("Total number of projects deleted")
            .register(registry);

    this.tasksCreatedCounter =
        Counter.builder("tasks_created_total")
            .description("Total number of tasks created")
            .register(registry);
  }

  public void incrementTasksCreated() {
    tasksCreatedCounter.increment();
  }

  public void incrementProjectsCreated() {
    projectsCreatedCounter.increment();
  }

  public void incrementProjectsDeleted() {
    projectsDeletedCounter.increment();
  }
}
