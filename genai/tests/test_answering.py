from unittest.mock import Mock, patch
from models.base import PromptRequest
from chain.answering import answer_and_reference


@patch("chain.answering.answer_chain")
@patch("chain.answering.build_context")
@patch("chain.answering.TaskApi")
@patch("chain.answering.ApiClient")
@patch("chain.answering.Configuration")
def test_answer_and_reference(
    mock_config, mock_api_client, mock_task_api, mock_build_context, mock_answer_chain
):
    # Arrange
    from openapi_client.models.task_dto import TaskDto
    from openapi_client.models.task_status import TaskStatus
    from datetime import datetime

    request = PromptRequest(
        project_id="test-project",
        user_id="test-user",
        prompt="What tasks are in progress?",
    )
    mock_context = "Project context data"
    mock_answer = "Currently there are 3 tasks in progress [id:123]"
    mock_task_instance = Mock()
    mock_task_dto = TaskDto(
        id=123,
        title="Test task",
        description="Test description",
        task_status=TaskStatus.IN_PROGRESS,
        created_at=datetime.now(),
        updated_at=datetime.now(),
        comments=[],
        attachments=[],
        assignee_id=None,
    )

    mock_build_context.return_value = mock_context
    mock_answer_chain.invoke.return_value = mock_answer
    mock_task_api.return_value = mock_task_instance
    mock_task_instance.get_task_by_id.return_value = mock_task_dto

    # Act
    answer, tasks = answer_and_reference(request)

    # Assert
    assert answer == mock_answer
    assert len(tasks) == 1
    assert tasks[0] == mock_task_dto
    mock_build_context.assert_called_once_with(
        request.project_id, request.user_id, request.prompt
    )
    mock_answer_chain.invoke.assert_called_once_with(
        {"context": mock_context, "prompt": request.prompt}
    )


@patch("chain.answering.answer_chain")
@patch("chain.answering.build_context")
def test_answer_and_reference_no_task_ids(mock_build_context, mock_answer_chain):
    # Arrange
    request = PromptRequest(
        project_id="test-project",
        user_id="test-user",
        prompt="What is the project status?",
    )
    mock_context = "Project context data"
    mock_answer = "The project is progressing well"

    mock_build_context.return_value = mock_context
    mock_answer_chain.invoke.return_value = mock_answer

    # Act
    answer, tasks = answer_and_reference(request)

    # Assert
    assert answer == mock_answer
    assert len(tasks) == 0
    mock_build_context.assert_called_once_with(
        request.project_id, request.user_id, request.prompt
    )
    mock_answer_chain.invoke.assert_called_once_with(
        {"context": mock_context, "prompt": request.prompt}
    )
