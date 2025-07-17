from models.base import PromptRequest, GenAIResponse
from models.intent import IntentType, IntentResult


def test_prompt_request_creation():
    # Arrange
    project_id = "test-project"
    user_id = "test-user"
    prompt = "Create a new task"
    
    # Act
    request = PromptRequest(project_id=project_id, user_id=user_id, prompt=prompt)
    
    # Assert
    assert request.project_id == project_id
    assert request.user_id == user_id
    assert request.prompt == prompt


def test_prompt_request_without_user_id():
    # Arrange
    project_id = "test-project"
    prompt = "Create a new task"
    
    # Act
    request = PromptRequest(project_id=project_id, prompt=prompt)
    
    # Assert
    assert request.project_id == project_id
    assert request.user_id is None
    assert request.prompt == prompt


def test_genai_response_creation():
    # Arrange
    intent = "generation"
    answer = "I'll create a new task for you"
    existing_tasks = []
    new_tasks = []
    
    # Act
    response = GenAIResponse(
        intent=intent,
        answer=answer,
        existing_tasks=existing_tasks,
        new_tasks=new_tasks
    )
    
    # Assert
    assert response.intent == intent
    assert response.answer == answer
    assert response.existing_tasks == existing_tasks
    assert response.new_tasks == new_tasks


def test_intent_result_generation():
    # Arrange
    intent = IntentType.generation
    
    # Act
    result = IntentResult(intent=intent)
    
    # Assert
    assert result.intent == IntentType.generation


def test_intent_result_answering():
    # Arrange
    intent = IntentType.answering
    
    # Act
    result = IntentResult(intent=intent)
    
    # Assert
    assert result.intent == IntentType.answering


def test_intent_type_enum_values():
    # Arrange & Act & Assert
    assert IntentType.generation == "generation"
    assert IntentType.answering == "answering"
