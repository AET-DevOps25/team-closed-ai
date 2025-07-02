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

__embedding_config = EmbeddingOllamaConfig(
    model=os.environ["EMBED_MODEL"],
    dimensions=int(os.environ["EMBED_DIMENSIONS"]),
)

__task_vectorizer = CreateVectorizer(
    source="task",
    name="task_vectorizer",
    destination=DestinationTableConfig(destination="task_embedding"),
    loading=LoadingColumnConfig(column_name="title"),
    embedding=__embedding_config,
    chunking=ChunkingNoneConfig(),
    formatting=FormattingPythonTemplateConfig(
        template="Title: $chunk\nStatus: $status\n\nDescription: $description"
    ),
    enqueue_existing=True,
)

__project_vectorizer = CreateVectorizer(
    source="project",
    name="project_vectorizer",
    destination=DestinationTableConfig(destination="project_embedding"),
    loading=LoadingColumnConfig(column_name="name"),
    embedding=__embedding_config,
    chunking=ChunkingNoneConfig(),
    formatting=FormattingPythonTemplateConfig(template="Project Name: $chunk"),
    enqueue_existing=True,
)


def get_vectorizers():
    """
    Returns a list of vectorizers.
    """
    return [__task_vectorizer, __project_vectorizer]
