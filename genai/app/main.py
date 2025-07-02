import logging

from fastapi import FastAPI
from app.models.base import PromptRequest, GenAIResponse
from app.classifier.classification import classify_prompt
from app.models.intent import IntentType

logger = logging.getLogger("GenAI Kanban Assistant")
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="GenAI Kanban Assistant")


@app.get("/healthz")
def health():
    return {"status": "ok"}


# @app.post("/interpret", response_model=GenAIResponse)
# def interpret_prompt(request: PromptRequest):
#     # Stub: real logic will go here
#     return {"intent": "question", "answer": "This is a stubbed answer.", "tasks": []}


@app.post("/interpret", response_model=GenAIResponse)
def interpret(request: PromptRequest):
    classification = classify_prompt(request.prompt)

    logger.info(f"Classified prompt: {request.prompt} as {classification.intent}")

    if classification.intent == IntentType.generation:
        logger.info(f"Classified as generation: {request.prompt}")
    elif classification.intent == IntentType.answering:
        logger.info(f"Classified as answering: {request.prompt}")

    return GenAIResponse(
        intent=classification.intent,
        answer="This is a stubbed answer.",
        existing_tasks=[],
        new_tasks=[],
    )


# class RequestBody(BaseModel):
#     request: str


# class ResponseBody(BaseModel):
#     category: str


# @app.post("/categorize", response_model=ResponseBody)
# async def categorize_endpoint(body: RequestBody):
#     try:
#         category = await categorize_request(body.request)
#         return ResponseBody(category=category)
#     except ValueError as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @app.get("/projects", response_model=list[ProjectDto])
# async def get_projects():
#     """
#     Retrieve a list of projects.
#     """
#     config = Configuration(host=os.getenv("PROJECT_URL", "http://project-service:8083"))
#     with ApiClient(config) as client:
#         api = ProjectApi(client)
#         projects = api.get_all_projects()
#         return projects
