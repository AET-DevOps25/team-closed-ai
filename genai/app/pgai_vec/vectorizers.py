import os

from pgai.vectorizer import CreateVectorizer
from pgai.vectorizer.configuration import (
    EmbeddingOllamaConfig,
    FormattingPythonTemplateConfig,
    LoadingColumnConfig,
    DestinationTableConfig,
    ChunkingNoneConfig,
)


_embedding_config = EmbeddingOllamaConfig(
    model=os.environ["EMBED_MODEL"],
    dimensions=int(os.environ["EMBED_DIMENSIONS"]),
    keep_alive="-1m",
)


# TODO: Use the description field for embedding tasks. This requires a change in the database schema.
# Currently, the description is stored as a large object (LOB) meaning we cannot use it directly in the vectorizer.
_task_template = """
Task Entry:
- Task ID: $id,
- Title: $chunk,
- Status: $status,
- User ID: $assignee_id
- Project ID: $project_id,
- Created At: $created_at,
- Updated At: $updated_at,
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
Project Entry:
- Project ID: $id,
- Created At: $created_at,
- Updated At: $updated_at,
- Project Name: $chunk
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
