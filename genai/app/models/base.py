from pydantic import BaseModel
from typing import List, Optional
from openapi_client.models.task_dto import TaskDto as Task


class PromptRequest(BaseModel):
    project_id: str
    user_id: Optional[str] = None
    prompt: str


class GenAIResponse(BaseModel):
    intent: str
    answer: str
    existing_tasks: Optional[List[Task]] = []
    new_tasks: Optional[List[Task]] = []
