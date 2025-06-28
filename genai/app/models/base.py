from pydantic import BaseModel
from typing import List, Optional
from openapi_client.models.task_dto import TaskDto as Task


class PromptRequest(BaseModel):
    project_id: str
    prompt: str


class GenAIResponse(BaseModel):
    intent: str
    answer: str
    tasks: Optional[List[Task]] = []
