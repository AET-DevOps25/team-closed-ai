from prometheus_client import Counter, Histogram, REGISTRY

# Counters for tasks
generation_tasks_counter = Counter(
    'genai_generation_tasks_total',
    'Total number of generation tasks processed',
    registry=REGISTRY
)

answering_tasks_counter = Counter(
    'genai_answering_tasks_total', 
    'Total number of answering tasks processed',
    registry=REGISTRY
)

# Timers (using Histograms for Prometheus)
classification_time_histogram = Histogram(
    'genai_classification_time_seconds',
    'Time spent on intent classification',
    registry=REGISTRY
)

generation_time_histogram = Histogram(
    'genai_generation_time_seconds',
    'Time spent on task generation',
    registry=REGISTRY
)

answering_time_histogram = Histogram(
    'genai_answering_time_seconds',
    'Time spent on answering tasks',
    registry=REGISTRY
) 