import logging

from fastapi import FastAPI
from app.models.base import PromptRequest, GenAIResponse
from app.chain.classification import classify_prompt
from app.models.intent import IntentType
from app.chain.generation import generate_answer_and_tasks

logger = logging.getLogger("GenAI Kanban Assistant")
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="GenAI Kanban Assistant")


@app.get("/healthz")
def health():
    return {"status": "ok"}


@app.post("/interpret", response_model=GenAIResponse)
def interpret(request: PromptRequest):
    classification = classify_prompt(request.prompt)

    logger.info(f"Classified prompt: {request.prompt} as {classification.intent}")

    if classification.intent == IntentType.generation:
        answer, tasks = generate_answer_and_tasks(request)
        return GenAIResponse(
            intent=classification.intent,
            answer=answer,
            existing_tasks=[],
            new_tasks=tasks,
        )

    elif classification.intent == IntentType.answering:
        logger.info(f"Classified as answering: {request.prompt}")

    return GenAIResponse(
        intent=classification.intent,
        answer="This is a stubbed answer.",
        existing_tasks=[],
        new_tasks=[],
    )
