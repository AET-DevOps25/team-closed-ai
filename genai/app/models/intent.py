from enum import Enum
from pydantic import BaseModel


class IntentType(str, Enum):
    generation = "generation"
    answering = "answering"


class IntentResult(BaseModel):
    intent: IntentType
