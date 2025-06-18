import os
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse

from server_api import ProjectApi, Configuration, ApiClient
from server_api.models.project_dto import ProjectDto

from app.llm_services.categorization_service import categorize_request
from pydantic import BaseModel

app = FastAPI(
    title="GenAI Service",
    root_path="/genai",
)


@app.get("/")
async def root():
    return {"message": "Hello from GenAI service!"}


@app.post("/interact")
async def interact(
    project_id: str,
    request: str,
    user_id: Optional[int] = None,
):
    dummy_responses = [
        {"response": "This is a dummy response 1"},
        {"response": "This is a dummy response 2"},
        {"response": "This is a dummy response 3"},
    ]

    async def streamer():
        for response in dummy_responses:
            yield f"{response}\n"

    return StreamingResponse(streamer, media_type="application/json")


class RequestBody(BaseModel):
    request: str


class ResponseBody(BaseModel):
    category: str


@app.post("/categorize", response_model=ResponseBody)
async def categorize_endpoint(body: RequestBody):
    try:
        category = await categorize_request(body.request)
        return ResponseBody(category=category)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/projects", response_model=list[ProjectDto])
async def get_projects():
    """
    Retrieve a list of projects.
    """
    config = Configuration(host=os.getenv("PROJECT_URL", "http://project-service:8083"))
    with ApiClient(config) as client:
        api = ProjectApi(client)
        projects = api.get_all_projects()
        return projects
