from unittest.mock import patch
from models.intent import IntentType, IntentResult
from chain.classification import classify_prompt


@patch('chain.classification.chain')
def test_classify_prompt_generation(mock_chain):
    # Arrange
    user_prompt = "Create a new task for user authentication"
    expected_result = IntentResult(intent=IntentType.generation)
    mock_chain.invoke.return_value = expected_result
    
    # Act
    result = classify_prompt(user_prompt)
    
    # Assert
    assert result.intent == IntentType.generation
    mock_chain.invoke.assert_called_once_with({"prompt": user_prompt})


@patch('chain.classification.chain')
def test_classify_prompt_answering(mock_chain):
    # Arrange
    user_prompt = "What tasks are currently in progress?"
    expected_result = IntentResult(intent=IntentType.answering)
    mock_chain.invoke.return_value = expected_result
    
    # Act
    result = classify_prompt(user_prompt)
    
    # Assert
    assert result.intent == IntentType.answering
    mock_chain.invoke.assert_called_once_with({"prompt": user_prompt})
