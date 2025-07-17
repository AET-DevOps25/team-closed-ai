import logging

import subprocess
import sys
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.base import PromptRequest, GenAIResponse
from chain.classification import classify_prompt
from models.intent import IntentType
from chain.generation import generate_answer_and_tasks
from chain.answering import answer_and_reference

logger = logging.getLogger("GenAI Kanban Assistant")
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="GenAI Kanban Assistant", root_path="/genai")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://closed-ai.student.k8s.aet.cit.tum.de"],
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


# start uvicorn server and listen on port 8084
if __name__ == "__main__":
    # Runs the initialization script for PostgreSQL with PGAI
    ret = subprocess.run([sys.executable, "pgai_vec/init_pgai.py"])
    if ret.returncode != 0:
        sys.exit(ret.returncode)

    # Launch FastAPI with Uvicorn
    logging.info("Starting GenAI Kanban Assistant on port 8084")
    uvicorn.run("main:app", host="0.0.0.0", port=8084)
