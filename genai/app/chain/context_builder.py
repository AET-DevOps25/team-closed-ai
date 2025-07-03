import os
import psycopg2
from typing import List, Optional
from langchain_ollama import OllamaEmbeddings
from pgai_vec.vectorizers import get_vectorizers
from pgvector.psycopg2 import register_vector
from pgvector import Vector

embedder = OllamaEmbeddings(
    model=os.environ["EMBED_MODEL"],
    base_url=os.environ["OLLAMA_EMBED_HOST"],
    client_kwargs={
        "headers": {"Authorization": f"Bearer {os.environ['OLLAMA_EMBED_KEY']}"}
    },
    temperature=0.0,
    keep_alive=True,
)


def _build_project_context(
    project_id: str, query_embeddings: list[float], k: int
) -> List[str]:
    knowledge: List[str] = []
    with psycopg2.connect(os.environ["DATABASE_URL"]) as conn:
        register_vector(conn)
        with conn.cursor() as cur:
            for vec in get_vectorizers():
                if vec.source == "project":
                    dest = vec.destination.destination
                    cur.execute(
                        f"""SELECT chunk
                        FROM {dest} 
                        WHERE id = %s
                        ORDER BY embedding <=> %s
                        LIMIT %s""",
                        (project_id, query_embeddings, k),
                    )
                    knowledge.extend(chunk for (chunk,) in cur.fetchall() if chunk)
                    break

    return knowledge


def _build_task_context(
    project_id: str, query_embeddings: list[float], k: int
) -> List[str]:
    knowledge: List[str] = []
    with psycopg2.connect(os.environ["DATABASE_URL"]) as conn:
        register_vector(conn)
        with conn.cursor() as cur:
            for vec in get_vectorizers():
                if vec.source == "task":
                    dest = vec.destination.destination
                    cur.execute(
                        f"""
                        SELECT chunk, convert_from(lo_get(description), 'UTF8')
                        FROM {dest}
                        WHERE project_id = %s
                        ORDER BY embedding <=> %s
                        LIMIT %s
                        """,
                        (project_id, query_embeddings, k),
                    )
                    raw_knowledge = cur.fetchall()
                    for chunk, description in raw_knowledge:
                        if description:
                            knowledge.append(f"{chunk}\n- Description: {description}")
                        else:
                            knowledge.append(chunk)
                    break
    return knowledge


def build_context(project_id: str, user_id: Optional[str], prompt: str) -> str:
    """
    build combined context for project and tasks, including user info.
    """
    query_embeddings = Vector(embedder.embed_query(prompt))

    project_chunks = _build_project_context(project_id, query_embeddings, 2)
    task_chunks = _build_task_context(project_id, query_embeddings, 6)

    header = f"ProjectID: {project_id}"
    if user_id:
        header += f" | UserID: {user_id}"

    knowledge = [header] + project_chunks + task_chunks
    return "\n---\n".join(piece for piece in knowledge if piece)
