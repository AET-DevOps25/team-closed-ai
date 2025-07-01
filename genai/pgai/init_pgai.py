from vectorizers import get_vectorizers
import os
import pgai
from pgai.vectorizer import CreateVectorizer
import psycopg2
import logging

logger = logging.getLogger(__name__)


def init():
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        logger.error("DATABASE_URL not set")

    ollama_host = os.getenv("OLLAMA_HOST")
    ollama_model = os.getenv("OLLAMA_MODEL", "nomic-embed-text")
    dimensions = int(os.getenv("EMBED_DIMENSIONS", 768))

    logger.info("Installing pgai extensions and vectorizers")
    pgai.install(db_url)

    conn = psycopg2.connect(db_url)
    cur = conn.cursor()

    cur.execute(
        "ALTER TABLE ai.vectorizer ADD COLUMN IF NOT EXISTS sql_creation_query TEXT;"
    )

    # Fetch existing vectorizers to avoid duplicates
    names_to_queries = fetch_name_and_creation_query(cur)
    existing_vectorizers = set(names_to_queries.keys())
    new_vectorizers = {vectorizer.name for vectorizer in get_vectorizers()}

    print("Existing vectorizers in the database:")
    for vectorizer in existing_vectorizers:
        print(f"- {vectorizer}")

    print("New vectorizers to be created:")
    for vectorizer in new_vectorizers:
        print(f"- {vectorizer}")

    to_drop = existing_vectorizers - new_vectorizers

    if to_drop:
        print("Dropping vectorizers that are no longer needed:")
        for name in to_drop:
            print(f"- {name}")
            drop_vectorizer(cur, name)

    # Also add existing vectorizers that have a different creation query
    for vectorizer in get_vectorizers():
        if vectorizer.name in existing_vectorizers:
            if names_to_queries[vectorizer.name] != vectorizer.to_sql():
                print(
                    f"Vectorizer {vectorizer.name} exists but has a different creation query, updating it."
                )
                drop_vectorizer(cur, vectorizer.name)
                create_vectorizer(cur, vectorizer)
        else:
            print(f"Creating new vectorizer: {vectorizer.name}")
            create_vectorizer(cur, vectorizer)

    conn.commit()
    cur.close()
    conn.close()

    # vectorizers = get_vectorizers()
    # for vectorizer in vectorizers:
    #     vectorizer.create()
    #     print(f"Vectorizer {vectorizer.name} created successfully.")

    # print("All vectorizers initialized.")


def fetch_name_and_creation_query(cur):
    """
    Fetches all existing vectorizers from the database.
    Returns a list of Vectorizer objects.
    """
    cur.execute("SELECT name, sql_creation_query FROM ai.vectorizer;")
    rows = cur.fetchall()
    return {row[0]: row[1] for row in rows}


def drop_vectorizer(cur, name: str):
    cur.execute(
        "SELECT ai.drop_vectorizer(%s, drop_all=>true);",
        (name,),
    )


def create_vectorizer(cur, vectorizer: CreateVectorizer):
    cur.execute(vectorizer.to_sql())
    cur.execute(
        "UPDATE ai.vectorizer SET sql_creation_query = %s WHERE name = %s;",
        (vectorizer.to_sql(), vectorizer.name),
    )


def main():
    init()


if __name__ == "__main__":
    main()
