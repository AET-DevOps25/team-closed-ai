import os
from langchain.vectorstores.pgvector import PGVector
from langchain_ollama import OllamaEmbeddings
from dotenv import load_dotenv

load_dotenv()

# ENV config
CONNECTION_STRING = f"postgresql+psycopg://{os.environ['PG_USER']}:{os.environ['PG_PASSWORD']}@{os.environ['PG_HOST']}:{os.environ.get('PG_PORT', '5432')}/{os.environ['PG_DB']}"
COLLECTION_NAME = "project_knowledge"

model = os.environ.get("LLM_EMBED_MODEL")
ollama_url = os.environ.get("OLLAMA_URL")

# Choose embedding model (you can change this to OllamaEmbeddings later)
embedding = OllamaEmbeddings(model=model, base_url=ollama_url)


# Create or load vector store
def get_vectorstore():
    return PGVector(
        collection_name=COLLECTION_NAME,
        connection_string=CONNECTION_STRING,
        embedding_function=embedding,
    )
