from pydantic import BaseModel
from typing import List, Optional
from openapi_client.models.add_task_dto import AddTaskDto
from openapi_client.models.task_dto import TaskDto


class PromptRequest(BaseModel):
    project_id: str
    user_id: Optional[str] = None
    prompt: str


class GenAIResponse(BaseModel):
    intent: str
    answer: str
    existing_tasks: List[TaskDto] = []
    new_tasks: List[AddTaskDto] = []
