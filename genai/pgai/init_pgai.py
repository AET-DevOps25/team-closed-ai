import os
import logging
import psycopg2
from typing import Dict

import pgai
from pgai.vectorizer import CreateVectorizer
from vectorizers import get_vectorizers

logger = logging.getLogger("PGAI INIT")
logging.basicConfig(level=logging.INFO)

DB_URL = os.getenv("DATABASE_URL")
OLLAMA_EMBED_HOST = os.getenv("OLLAMA_EMBED_HOST")


class VectorizerManager:
    def __init__(self, conn):
        self.conn = conn
        self.cur = conn.cursor()

    def ensure_sql_column(self):
        self.cur.execute(
            "ALTER TABLE ai.vectorizer "
            "ADD COLUMN IF NOT EXISTS sql_creation_query TEXT;"
        )

    def fetch_existing(self) -> Dict[str, str]:
        self.cur.execute("SELECT name, sql_creation_query FROM ai.vectorizer;")
        return {name: query for name, query in self.cur.fetchall()}

    def drop(self, name: str):
        self.cur.execute("SELECT ai.drop_vectorizer(%s, drop_all=>true);", (name,))
        logger.info("Dropped vectorizer: %s", name)

    def create(self, vec: CreateVectorizer):
        query = vec.to_sql()
        self.cur.execute(query)
        self.cur.execute(
            "UPDATE ai.vectorizer " "SET sql_creation_query = %s WHERE name = %s;",
            (query, vec.name),
        )
        logger.info("Created/updated vectorizer: %s", vec.name)

    def close(self):
        self.cur.close()


def synchronize_vectorizers(conn):
    manager = VectorizerManager(conn)
    manager.ensure_sql_column()

    existing = manager.fetch_existing()
    existing_names = set(existing)
    all_vectors = list(get_vectorizers())
    current_names = {v.name for v in all_vectors}

    logger.info("Required vectorizers: %s", sorted(current_names))
    logger.info("Existing vectorizers: %s", sorted(existing_names))

    # Drop unused vectorizers
    for name in sorted(existing_names - current_names):
        manager.drop(name)

    # Update or create vectorizers
    for vec in all_vectors:
        existing_query = existing.get(vec.name)
        if existing_query is None:
            manager.create(vec)
        elif existing_query != vec.to_sql():
            logger.info("Updating vectorizer %s due to changed config", vec.name)
            manager.drop(vec.name)
            manager.create(vec)

    manager.close()


def main():
    if not DB_URL:
        logger.error("DATABASE_URL not set")
        return

    logger.info("Installing pgai extensions")
    pgai.install(DB_URL)

    with psycopg2.connect(DB_URL) as conn:
        synchronize_vectorizers(conn)
        conn.commit()


if __name__ == "__main__":
    main()
