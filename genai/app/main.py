import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.base import PromptRequest, GenAIResponse
from app.chain.classification import classify_prompt
from app.models.intent import IntentType
from app.chain.generation import generate_answer_and_tasks
from app.chain.answering import answer_and_reference

logger = logging.getLogger("GenAI Kanban Assistant")
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="GenAI Kanban Assistant", root_path="/genai")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
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
    else:
        answer, tasks = answer_and_reference(request)
        return GenAIResponse(
            intent=classification.intent,
            answer=answer,
            existing_tasks=tasks,
            new_tasks=[],
        )
