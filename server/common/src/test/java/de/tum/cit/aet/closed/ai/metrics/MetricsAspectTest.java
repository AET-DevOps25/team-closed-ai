package de.tum.cit.aet.closed.ai.metrics;

import io.micrometer.core.instrument.Timer;
import org.aspectj.lang.ProceedingJoinPoint;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MetricsAspectTest {

    @Mock
    private MetricsService metricsService;

    @Mock
    private ProceedingJoinPoint joinPoint;

    @Mock
    private Timer.Sample timerSample;

    @Mock
    private Timer timer;

    private MetricsAspect metricsAspect;

    @BeforeEach
    void setUp() {
        metricsAspect = new MetricsAspect(metricsService);
    }

    @Test
    void testMeasureMethodExecutionTimeSuccess() throws Throwable {
        // Given
        Object expectedResult = new Object();
        when(metricsService.startTimer()).thenReturn(timerSample);
        when(metricsService.getRequestLatencyTimer()).thenReturn(timer);
        when(joinPoint.proceed()).thenReturn(expectedResult);

        // When
        Object result = metricsAspect.measureMethodExecutionTime(joinPoint);

        // Then
        assertEquals(expectedResult, result, "Method should return the expected result");
        verify(metricsService).startTimer();
        verify(metricsService).incrementRequestCount();
        verify(timerSample).stop(timer);
        verify(metricsService, never()).incrementErrorCount();
    }

    @Test
    void testMeasureMethodExecutionTimeWithException() throws Throwable {
        // Given
        RuntimeException expectedException = new RuntimeException("Test exception");
        when(metricsService.startTimer()).thenReturn(timerSample);
        when(metricsService.getRequestLatencyTimer()).thenReturn(timer);
        when(joinPoint.proceed()).thenThrow(expectedException);

        // When & Then
        Exception exception = assertThrows(RuntimeException.class,
                () -> metricsAspect.measureMethodExecutionTime(joinPoint),
                "Method should propagate the exception");

        assertEquals(expectedException, exception, "Should throw the original exception");
        verify(metricsService).startTimer();
        verify(metricsService).incrementRequestCount();
        verify(metricsService).incrementErrorCount();
        verify(timerSample).stop(timer);
    }
}
