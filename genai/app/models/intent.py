from enum import Enum
from pydantic import BaseModel, Field


class IntentType(str, Enum):
    """Enumeration of possible AI intent classifications"""

    generation = "generation"  # Intent to generate new tasks
    answering = "answering"  # Intent to answer questions about existing tasks


class IntentResult(BaseModel):
    """Result model for prompt intent classification"""

    intent: IntentType = Field(
        ..., description="The classified intent type of the user prompt"
    )
