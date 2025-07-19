from pydantic import BaseModel, Field
from typing import List, Optional
from openapi_client.models.add_task_dto import AddTaskDto
from openapi_client.models.task_dto import TaskDto


class PromptRequest(BaseModel):
    """Request model for AI prompt interpretation"""

    project_id: str = Field(
        ...,
        description="The unique identifier of the project context for the prompt",
        example="proj_123456",
    )
    user_id: Optional[str] = Field(
        None,
        description="Optional user identifier for personalized responses",
        example="user_789",
    )
    prompt: str = Field(
        ...,
        description="The natural language prompt to be interpreted by the AI",
        example="Create tasks for setting up a new React application with TypeScript",
    )


class GenAIResponse(BaseModel):
    """Response model containing AI interpretation results"""

    intent: str = Field(
        ...,
        description="The classified intent of the prompt (generation or answering)",
        example="generation",
    )
    answer: str = Field(
        ...,
        description="Human-readable response from the AI explaining the interpretation",
        example="I'll create these development tasks for your React TypeScript project.",
    )
    existing_tasks: List[TaskDto] = Field(
        default=[],
        description="List of existing tasks relevant to the prompt (used for answering intent)",
    )
    new_tasks: List[AddTaskDto] = Field(
        default=[],
        description="List of new tasks generated based on the prompt (used for generation intent)",
    )
