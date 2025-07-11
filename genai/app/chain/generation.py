import os
from typing import List

from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
from langchain_core.output_parsers import PydanticOutputParser
from openapi_client.models.add_task_dto import AddTaskDto
from openapi_client.models.task_status import TaskStatus
from pydantic import BaseModel
from chain.context_builder import build_context
from models.base import PromptRequest


# ——————————————————————————————————————————————
# STEP 1: Answer Chain
# ——————————————————————————————————————————————

answer_template = ChatPromptTemplate.from_template(
    """
You are a knowledgeable assistant for a Kanban-style project management system.

Context:
{context}

User request:
"{prompt}"

Provide a concise, helpful answer to the user's request. No JSON.
"""
)

answer_model = OllamaLLM(
    model=os.environ["ANSWER_MODEL"],
    base_url=os.environ["OLLAMA_LLM_HOST"],
    client_kwargs={
        "headers": {"Authorization": f"Bearer {os.environ['OLLAMA_LLM_KEY']}"}
    },
    temperature=0.2,
    max_tokens=300,
    keep_alive="-1m",
)

answer_chain = answer_template | answer_model


# ——————————————————————————————————————————————
# STEP 2: Task‐Generation Chain
# ——————————————————————————————————————————————


class _GeneratedTask(BaseModel):
    title: str
    description: str


class _NewTasks(BaseModel):
    tasks: List[_GeneratedTask]


task_parser = PydanticOutputParser(pydantic_object=_NewTasks)

tasks_prompt = ChatPromptTemplate.from_template(
    """
You are an assistant that, based on the following answer, proposes new project tasks.

Answer you gave:
\"\"\"{answer}\"\"\"

Now, generate a JSON array of new tasks that support or extend that answer.
Each task must follow exactly the schema (omit fields not in the model):
```json
{format_instructions}
```
"""
).partial(format_instructions=task_parser.get_format_instructions())

tasks_model = OllamaLLM(
    model=os.environ["TASK_GEN_MODEL"],
    base_url=os.environ["OLLAMA_LLM_HOST"],
    client_kwargs={
        "headers": {"Authorization": f"Bearer {os.environ['OLLAMA_LLM_KEY']}"}
    },
    temperature=0.0,
    max_tokens=500,
    keep_alive="-1m",
)

tasks_chain = tasks_prompt | tasks_model | task_parser


# ——————————————————————————————————————————————
# COMPOSITE FUNCTION
# ——————————————————————————————————————————————


def generate_answer_and_tasks(request: PromptRequest) -> tuple[str, List[AddTaskDto]]:
    context = build_context(request.project_id, request.user_id, request.prompt)

    answer = answer_chain.invoke(
        {
            "context": context,
            "prompt": request.prompt,
        }
    )

    generated_tasks = tasks_chain.invoke({"answer": answer}).tasks
    new_tasks = [
        AddTaskDto(
            title=task.title,
            description=task.description,
            status=TaskStatus.BACKLOG,
            project_id=request.project_id,
            user_id=None,
        )
        for task in generated_tasks
    ]

    return answer, new_tasks
