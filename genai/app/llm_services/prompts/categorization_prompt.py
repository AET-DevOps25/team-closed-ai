from langchain.prompts import ChatPromptTemplate

system_message = """
You are a helpful assistant that categorizes user requests into one of two categories: 'generation' or 'answering'.
Your task is to analyze the user's request and determine which category it belongs to based on the content of the request.
If the request is about generating new tasks, categorize it as 'generation'.
If the request is about answering questions or providing information about a project, categorize it as 'answering'.

Only return the category as a single word, either 'generation' or 'answering'!
"""

human_message = """
User request: {request}
"""

PROMPT = ChatPromptTemplate.from_messages(
    [
        ("system", system_message),
        ("user", human_message),
    ]
)


def get_messages(request: str):
    return PROMPT.format_messages(request=request)
