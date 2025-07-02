import os
from dotenv import load_dotenv

from pgai.vectorizer import CreateVectorizer
from pgai.vectorizer.configuration import (
    EmbeddingOllamaConfig,
    FormattingPythonTemplateConfig,
    LoadingColumnConfig,
    DestinationTableConfig,
    ChunkingNoneConfig,
)

load_dotenv()

_embedding_config = EmbeddingOllamaConfig(
    model=os.environ["EMBED_MODEL"],
    dimensions=int(os.environ["EMBED_DIMENSIONS"]),
)

_task_template = """
Task Entry: {
 Title: $chunk,
 Status: $status,
 User ID: $assignee_id,
 Description: $description
}
"""


_task_vectorizer = CreateVectorizer(
    source="task",
    name="task_vectorizer",
    destination=DestinationTableConfig(destination="task_embedding"),
    loading=LoadingColumnConfig(column_name="title"),
    embedding=_embedding_config,
    chunking=ChunkingNoneConfig(),
    formatting=FormattingPythonTemplateConfig(template=_task_template),
    enqueue_existing=True,
)

_project_template = """
Project Entry: {
 Project Name: $chunk
}
"""

_project_vectorizer = CreateVectorizer(
    source="project",
    name="project_vectorizer",
    destination=DestinationTableConfig(destination="project_embedding"),
    loading=LoadingColumnConfig(column_name="name"),
    embedding=_embedding_config,
    chunking=ChunkingNoneConfig(),
    formatting=FormattingPythonTemplateConfig(template=_project_template),
    enqueue_existing=True,
)


def get_vectorizers() -> list[CreateVectorizer]:
    """
    Returns a list of vectorizers.
    """
    return [_task_vectorizer, _project_vectorizer]


def get_views() -> dict[str, str]:
    """
    Returns a list of views.
    """
    return {_task_vectorizer.source: _task_view}
