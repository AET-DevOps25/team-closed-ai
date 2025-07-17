from unittest.mock import Mock, patch
from models.base import PromptRequest
from chain.generation import generate_answer_and_tasks


@patch("chain.generation.answer_chain")
@patch("chain.generation.tasks_chain")
@patch("chain.generation.build_context")
def test_generate_answer_and_tasks(
    mock_build_context, mock_tasks_chain, mock_answer_chain
):
    # Arrange
    request = PromptRequest(
        project_id="test-project",
        user_id="test-user",
        prompt="Create tasks for authentication system",
    )
    mock_context = "Project context data"
    mock_answer = "I'll create authentication tasks for you"
    mock_tasks_result = Mock()
    mock_tasks_result.tasks = [
        Mock(title="Implement login", description="Create login functionality"),
        Mock(title="Setup auth", description="Setup authentication system"),
    ]

    mock_build_context.return_value = mock_context
    mock_answer_chain.invoke.return_value = mock_answer
    mock_tasks_chain.invoke.return_value = mock_tasks_result

    # Act
    answer, tasks = generate_answer_and_tasks(request)

    # Assert
    assert answer == mock_answer
    assert len(tasks) == 2
    assert tasks[0].title == "Implement login"
    assert tasks[0].description == "Create login functionality"
    mock_build_context.assert_called_once_with(
        request.project_id, request.user_id, request.prompt
    )
    mock_answer_chain.invoke.assert_called_once_with(
        {"context": mock_context, "prompt": request.prompt}
    )
    mock_tasks_chain.invoke.assert_called_once_with({"answer": mock_answer})
