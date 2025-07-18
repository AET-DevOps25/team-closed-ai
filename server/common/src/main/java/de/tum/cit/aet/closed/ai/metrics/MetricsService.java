package de.tum.cit.aet.closed.ai.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class MetricsService {
    private final Counter totalRequestsCounter;
    private final Counter errorRequestsCounter;
    @Getter
    private final Timer requestLatencyTimer;

    public MetricsService(MeterRegistry registry) {
        // Counter for total requests
        this.totalRequestsCounter = Counter.builder("app_requests_total")
                .description("Total number of requests")
                .tag("type", "all")
                .register(registry);

        // Counter for error requests
        this.errorRequestsCounter = Counter.builder("app_requests_errors")
                .description("Total number of error requests")
                .tag("type", "error")
                .register(registry);

        // Timer for request latency
        this.requestLatencyTimer = Timer.builder("app_request_latency")
                .description("Request latency in seconds")
                .tag("type", "latency")
                .register(registry);
    }

    public void incrementRequestCount() {
        totalRequestsCounter.increment();
    }

    public void incrementErrorCount() {
        errorRequestsCounter.increment();
    }

    public Timer.Sample startTimer() {
        return Timer.start();
    }
}