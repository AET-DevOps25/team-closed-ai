import os
from app.llm_services.prompts.categorization_prompt import get_messages
from langchain_ollama import ChatOllama

CATEGORIZATION_MODEL = os.getenv("CATEGORIZATION_MODEL")
OLLAMA_URL = os.getenv("OLLAMA_URL")
OLLAMA_API_KEY = os.getenv("OLLAMA_API_KEY")

llm = ChatOllama(
    model=CATEGORIZATION_MODEL,
    temperature=0,
    streaming=False,
    base_url=OLLAMA_URL,
    api_key=OLLAMA_API_KEY,
)


async def categorize_request(request: str) -> str:
    messages = get_messages(request)

    respone = llm.invoke(messages)
    content = respone.content.strip().lower()

    if content not in ["generation", "answering"]:
        raise ValueError(
            f"Invalid response from categorization model: {content}. Expected 'generation' or 'answering'."
        )

    return content
