from unittest.mock import patch
from fastapi.testclient import TestClient
from models.intent import IntentType, IntentResult
from main import app


client = TestClient(app)


def test_health_endpoint():
    # Arrange & Act
    response = client.get("/healthz")

    # Assert
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@patch("main.classify_prompt")
@patch("main.generate_answer_and_tasks")
def test_interpret_generation_intent(mock_generate, mock_classify):
    # Arrange
    from openapi_client.models.add_task_dto import AddTaskDto
    from openapi_client.models.task_status import TaskStatus

    mock_classify.return_value = IntentResult(intent=IntentType.generation)
    mock_task = AddTaskDto(
        title="New task",
        description="A new task description",
        task_status=TaskStatus.BACKLOG,
        assignee_id=None,
    )
    mock_generate.return_value = ("Task created successfully", [mock_task])

    request_data = {
        "project_id": "test-project",
        "user_id": "test-user",
        "prompt": "Create a new task",
    }

    # Act
    response = client.post("/interpret", json=request_data)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "generation"
    assert data["answer"] == "Task created successfully"
    assert data["existing_tasks"] == []
    assert len(data["new_tasks"]) == 1
    assert data["new_tasks"][0]["title"] == "New task"


@patch("main.classify_prompt")
@patch("main.answer_and_reference")
def test_interpret_answering_intent(mock_answer, mock_classify):
    # Arrange
    from openapi_client.models.task_dto import TaskDto
    from openapi_client.models.task_status import TaskStatus
    from datetime import datetime

    mock_classify.return_value = IntentResult(intent=IntentType.answering)
    mock_task = TaskDto(
        id=123,
        title="Existing task",
        description="Task description",
        task_status=TaskStatus.IN_PROGRESS,
        created_at=datetime.now(),
        updated_at=datetime.now(),
        comments=[],
        attachments=[],
        assignee_id=None,
    )
    mock_answer.return_value = ("Here are your tasks", [mock_task])

    request_data = {
        "project_id": "test-project",
        "user_id": "test-user",
        "prompt": "What tasks do I have?",
    }

    # Act
    response = client.post("/interpret", json=request_data)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert data["intent"] == "answering"
    assert data["answer"] == "Here are your tasks"
    assert len(data["existing_tasks"]) == 1
    assert data["existing_tasks"][0]["id"] == 123
    assert data["new_tasks"] == []
