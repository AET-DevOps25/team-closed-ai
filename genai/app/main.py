import logging

import subprocess
import sys
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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

app = FastAPI(
    title="GenAI Kanban Assistant",
    description="AI-powered service for intelligent Kanban task management and question answering",
    tags_metadata=[
        {"name": "Health", "description": "Health check and service status operations"},
        {
            "name": "AI Interpretation",
            "description": "AI prompt interpretation for task generation and question answering",
        },
    ],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost",
        "http://localhost:5173",
        "https://closed-ai.student.k8s.aet.cit.tum.de",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/healthz",
    tags=["Health"],
    summary="Health Check",
    description="Returns the health status of the GenAI service",
    responses={
        200: {
            "description": "Service is healthy",
            "content": {"application/json": {"example": {"status": "ok"}}},
        }
    },
)
def health():
    """Check if the GenAI service is running and healthy"""
    return {"status": "ok"}


@app.get("/metrics")
def get_metrics():
    """Prometheus metrics endpoint"""
    data = generate_latest()
    return Response(content=data, media_type=CONTENT_TYPE_LATEST)


@app.post(
    "/interpret",
    response_model=GenAIResponse,
    tags=["AI Interpretation"],
    summary="Interpret AI Prompt",
    description="Processes a natural language prompt to either generate new tasks or answer questions about existing tasks",
    responses={
        200: {
            "description": "Prompt successfully interpreted",
            "content": {
                "application/json": {
                    "examples": {
                        "task_generation": {
                            "summary": "Task Generation Response",
                            "value": {
                                "intent": "generation",
                                "answer": "I'll create these tasks for your project.",
                                "existing_tasks": [],
                                "new_tasks": [
                                    {
                                        "title": "Setup development environment",
                                        "description": "Configure development tools and dependencies",
                                        "status": "TODO",
                                    }
                                ],
                            },
                        },
                        "question_answering": {
                            "summary": "Question Answering Response",
                            "value": {
                                "intent": "answering",
                                "answer": "Based on your project, here are the relevant tasks.",
                                "existing_tasks": [
                                    {
                                        "id": "123",
                                        "title": "Backend API development",
                                        "description": "Implement REST API endpoints",
                                        "status": "IN_PROGRESS",
                                    }
                                ],
                                "new_tasks": [],
                            },
                        },
                    }
                }
            },
        },
        400: {"description": "Invalid request format or missing required fields"},
        500: {"description": "Internal server error during AI processing"},
    },
)
def interpret(request: PromptRequest):
    """
    Interpret a natural language prompt and provide intelligent responses.

    This endpoint uses AI to classify the intent of the prompt and:
    - For 'generation' intent: Creates new tasks based on the prompt
    - For 'answering' intent: Provides answers based on existing project tasks

    Args:
        request: PromptRequest containing project_id, optional user_id, and the prompt text

    Returns:
        GenAIResponse with the interpreted intent, answer, and relevant tasks
    """

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
