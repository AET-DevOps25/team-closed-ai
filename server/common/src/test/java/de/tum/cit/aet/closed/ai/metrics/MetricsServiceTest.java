package de.tum.cit.aet.closed.ai.metrics;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MetricsServiceTest {

    private MeterRegistry meterRegistry;
    private MetricsService metricsService;

    @BeforeEach
    void setUp() {
        meterRegistry = new SimpleMeterRegistry();
        metricsService = new MetricsService(meterRegistry);
    }

    @Test
    void testInitialization() {
        // Verify that the meters have been registered with the registry
        assertNotNull(meterRegistry.find("app_requests_total").counter());
        assertNotNull(meterRegistry.find("app_requests_errors").counter());
        assertNotNull(meterRegistry.find("app_request_latency").timer());
    }

    @Test
    void testIncrementRequestCount() {
        // Given
        Counter counter = meterRegistry.find("app_requests_total").counter();
        double initialCount = counter != null ? counter.count() : 0.0;

        // When
        metricsService.incrementRequestCount();

        // Then
        Counter updatedCounter = meterRegistry.find("app_requests_total").counter();
        assertNotNull(updatedCounter);
        assertEquals(initialCount + 1.0, updatedCounter.count(), "Request count should be incremented by 1");
    }

    @Test
    void testIncrementErrorCount() {
        // Given
        Counter counter = meterRegistry.find("app_requests_errors").counter();
        double initialCount = counter != null ? counter.count() : 0.0;

        // When
        metricsService.incrementErrorCount();

        // Then
        Counter updatedCounter = meterRegistry.find("app_requests_errors").counter();
        assertNotNull(updatedCounter);
        assertEquals(initialCount + 1.0, updatedCounter.count(), "Error count should be incremented by 1");
    }

    @Test
    void testStartTimer() {
        // When
        Timer.Sample sample = metricsService.startTimer();

        // Then
        assertNotNull(sample, "Timer sample should not be null");

        // Verify that stopping the timer records the timing
        Timer timer = metricsService.getRequestLatencyTimer();
        long count = timer.count();
        sample.stop(timer);
        assertEquals(count + 1, timer.count(), "Timer count should be incremented after stopping the sample");
    }

    @Test
    void testGetRequestLatencyTimer() {
        // When
        Timer timer = metricsService.getRequestLatencyTimer();

        // Then
        assertNotNull(timer, "Request latency timer should not be null");
        assertEquals("app_request_latency", timer.getId().getName(), "Timer should have the correct name");
    }
}
