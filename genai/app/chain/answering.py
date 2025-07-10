import os
import re
from typing import List
from langchain_core.prompts import ChatPromptTemplate
from langchain_ollama.llms import OllamaLLM
from openapi_client.api_client import ApiClient
from openapi_client.api.task_api import TaskApi, TaskDto
from openapi_client.configuration import Configuration
from chain.context_builder import build_context
from models.base import PromptRequest

_ID_PATTERN = re.compile(r"\[id:(\d+)\]")

answer_template = ChatPromptTemplate.from_template(
    """
You are a Kanban-style project assistant.  Use the provided context to answer the user's question.
Whenever you refer to an existing task, tag it inline in the form `[id:<task_id>]`.
For example: "You can update the authentication flow [id:42] and then refactor logging [id:57]."

Context:
{context}

Question:
"{prompt}"

Answer in plain text, embedding any task references as `[id:<task_id>]`.  Do **not** emit any JSON.
"""
)

answer_model = OllamaLLM(
    model=os.environ["ANSWER_MODEL"],
    base_url=os.environ["OLLAMA_LLM_HOST"],
    client_kwargs={
        "headers": {"Authorization": f"Bearer {os.environ['OLLAMA_LLM_KEY']}"}
    },
    temperature=0.0,
    max_tokens=300,
    keep_alive="-1m",
)

answer_chain = answer_template | answer_model


def extract_ids(answer: str) -> set[int]:
    return {int(m) for m in _ID_PATTERN.findall(answer)}


def fetch_tasks_by_ids(task_ids: set[int]) -> List[TaskDto]:
    api = TaskApi(ApiClient(Configuration(host=os.environ["TRAEFIK_URL"])))
    tasks: List[TaskDto] = []
    for tid in task_ids:
        try:
            tasks.append(api.get_task_by_id(tid))
        except Exception:
            # ignore missing
            continue
    return tasks


def answer_and_reference(request: PromptRequest) -> tuple[str, list[TaskDto]]:
    context = build_context(request.project_id, request.user_id, request.prompt)

    answer: str = answer_chain.invoke({"context": context, "prompt": request.prompt})

    ids = extract_ids(answer)
    existing_tasks = fetch_tasks_by_ids(ids)

    return answer, existing_tasks
