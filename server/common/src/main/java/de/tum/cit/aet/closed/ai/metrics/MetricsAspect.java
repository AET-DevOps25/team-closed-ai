package de.tum.cit.aet.closed.ai.metrics;

import io.micrometer.core.instrument.Timer;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class MetricsAspect {
    private final MetricsService metricsService;

    public MetricsAspect(MetricsService metricsService) {
        this.metricsService = metricsService;
    }

    @Around("@within(org.springframework.web.bind.annotation.RestController)")
    public Object measureMethodExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        Timer.Sample timer = metricsService.startTimer();
        metricsService.incrementRequestCount();

        try {
            Object result = joinPoint.proceed();
            timer.stop(metricsService.getRequestLatencyTimer());
            return result;
        } catch (Exception e) {
            metricsService.incrementErrorCount();
            timer.stop(metricsService.getRequestLatencyTimer());
            throw e;
        }
    }
} 