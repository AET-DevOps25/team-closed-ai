import os
from typing import Optional

from fastapi import FastAPI
from fastapi.responses import StreamingResponse

from server_api import ProjectApi, Configuration, ApiClient
from server_api.models.project_dto import ProjectDto

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
