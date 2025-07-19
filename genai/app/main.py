import logging

import subprocess
import sys
import uvicorn
from fastapi import FastAPI
from fastapi.responses import Response
from models.base import PromptRequest, GenAIResponse
from chain.classification import classify_prompt
from models.intent import IntentType
from chain.generation import generate_answer_and_tasks
from chain.answering import answer_and_reference
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
import metrics.metrics as metrics

logger = logging.getLogger("GenAI Kanban Assistant")
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="GenAI Kanban Assistant")


@app.get("/healthz")
def health():
    return {"status": "ok"}


@app.get("/metrics")
def get_metrics():
    """Prometheus metrics endpoint"""
    data = generate_latest()
    return Response(content=data, media_type=CONTENT_TYPE_LATEST)


@app.post("/interpret", response_model=GenAIResponse)
def interpret(request: PromptRequest):

    # Time the classification
    with metrics.classification_time_histogram.time():
        classification = classify_prompt(request.prompt)

    logger.info(f"Classified prompt: {request.prompt} as {classification.intent}")

    if classification.intent == IntentType.generation:
        # Time the generation and increment counter
        with metrics.generation_time_histogram.time():
            answer, tasks = generate_answer_and_tasks(request)

        metrics.generation_tasks_counter.inc()

        return GenAIResponse(
            intent=classification.intent,
            answer=answer,
            existing_tasks=[],
            new_tasks=tasks,
        )
    else:
        # Time the answering and increment counter
        with metrics.answering_time_histogram.time():
            answer, tasks = answer_and_reference(request)

        metrics.answering_tasks_counter.inc()

        return GenAIResponse(
            intent=classification.intent,
            answer=answer,
            existing_tasks=tasks,
            new_tasks=[],
        )


# start uvicorn server and listen on port 8084
if __name__ == "__main__":
    # Runs the initialization script for PostgreSQL with PGAI
    ret = subprocess.run([sys.executable, "pgai_vec/init_pgai.py"])
    if ret.returncode != 0:
        sys.exit(ret.returncode)

    # Launch FastAPI with Uvicorn
    logging.info("Starting GenAI Kanban Assistant on port 8084")
    uvicorn.run("main:app", host="0.0.0.0", port=8084)
