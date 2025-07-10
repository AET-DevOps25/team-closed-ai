import os

from langchain_core.output_parsers import PydanticOutputParser
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate, SystemMessagePromptTemplate
from models.intent import IntentResult


system = SystemMessagePromptTemplate.from_template(
    """"
You are a helpful assistant that categorizes user requests into one of two categories: 'generation' or 'answering'.
Your task is to analyze the user's request and determine which category it belongs to based on the content of the request.
If the request is about generating new tasks, categorize it as 'generation'.
If the request is about answering questions or providing information about a project, categorize it as 'answering'.
"""
)

user = ChatPromptTemplate.from_template(
    """
User prompt:
"{prompt}"

You must *only* return JSON, **no prose**, in exactly this shape:
```json
{format_instructions}
```
"""
)

parser = PydanticOutputParser(pydantic_object=IntentResult)
prompt = ChatPromptTemplate.from_messages([system, user]).partial(
    format_instructions=parser.get_format_instructions()
)

model = OllamaLLM(
    model=os.environ["CLASSIFICATION_MODEL"],
    base_url=os.environ["OLLAMA_LLM_HOST"],
    client_kwargs={
        "headers": {"Authorization": f"Bearer {os.environ['OLLAMA_LLM_KEY']}"}
    },
    temperature=0.0,
    max_tokens=20,
    keep_alive="-1m",
)


chain = prompt | model | parser


def classify_prompt(user_prompt: str) -> IntentResult:
    return chain.invoke({"prompt": user_prompt})
