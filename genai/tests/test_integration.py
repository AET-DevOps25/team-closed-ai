import os
from unittest.mock import patch

from fastapi.testclient import TestClient


class TestHealthEndpointIntegration:
    """Integration tests for the health endpoint"""

    def test_health_endpoint_returns_ok(self):
        """Test that the health endpoint returns 200 OK"""
        # Create test client
        from main import app

        client = TestClient(app)

        # Act
        response = client.get("/healthz")

        # Assert
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


class TestInterpretEndpointIntegration:
    """Integration tests for the interpret endpoint"""

    def test_interpret_generation_flow(self):
        """Test the interpret endpoint for generation flow"""
        # Mock dependencies
        with patch("main.classify_prompt") as mock_classify, patch(
            "main.generate_answer_and_tasks"
        ) as mock_generate, patch.dict(
            os.environ,
            {
                "DATABASE_URL": "postgresql://test:test@localhost/test",
                "EMBED_MODEL": "test-embed-model",
                "OLLAMA_EMBED_HOST": "http://localhost:11434",
                "OLLAMA_EMBED_KEY": "test-key",
                "OLLAMA_CHAT_HOST": "http://localhost:11434",
                "OLLAMA_CHAT_KEY": "test-key",
                "CHAT_MODEL": "test-chat-model",
            },
        ):

            # Setup mocks
            from models.intent import IntentType, IntentResult

            mock_intent = IntentResult(intent=IntentType.generation)
            mock_classify.return_value = mock_intent

            # Create real AddTaskDto objects
            from openapi_client.models.add_task_dto import AddTaskDto
            from openapi_client.models.task_status import TaskStatus

            task1 = AddTaskDto(
                title="Task 1",
                description="Task 1 description",
                task_status=TaskStatus.BACKLOG,
                assignee_id=None,
            )

            task2 = AddTaskDto(
                title="Task 2",
                description="Task 2 description",
                task_status=TaskStatus.BACKLOG,
                assignee_id=None,
            )

            mock_generate.return_value = (
                "Here's a plan for your project",
                [task1, task2],
            )

            # Create test client
            from main import app

            client = TestClient(app)

            # Prepare request
            request_data = {
                "project_id": "test-project",
                "user_id": "test-user",
                "prompt": "Create a web application",
            }

            # Act
            response = client.post("/interpret", json=request_data)

            # Assert
            assert response.status_code == 200
            response_data = response.json()
            assert response_data["intent"] == "generation"
            assert response_data["answer"] == "Here's a plan for your project"
            assert len(response_data["new_tasks"]) == 2
            assert response_data["new_tasks"][0]["title"] == "Task 1"
            assert response_data["new_tasks"][1]["title"] == "Task 2"
            assert response_data["existing_tasks"] == []

    def test_interpret_answering_flow(self):
        """Test the interpret endpoint for answering flow"""
        # Mock dependencies
        with patch("main.classify_prompt") as mock_classify, patch(
            "main.answer_and_reference"
        ) as mock_answer, patch.dict(
            os.environ,
            {
                "DATABASE_URL": "postgresql://test:test@localhost/test",
                "EMBED_MODEL": "test-embed-model",
                "OLLAMA_EMBED_HOST": "http://localhost:11434",
                "OLLAMA_EMBED_KEY": "test-key",
                "OLLAMA_CHAT_HOST": "http://localhost:11434",
                "OLLAMA_CHAT_KEY": "test-key",
                "CHAT_MODEL": "test-chat-model",
            },
        ):

            # Setup mocks
            from models.intent import IntentType, IntentResult

            mock_intent = IntentResult(intent=IntentType.answering)
            mock_classify.return_value = mock_intent

            # Create real TaskDto objects
            from openapi_client.models.task_dto import TaskDto
            from openapi_client.models.task_status import TaskStatus
            from datetime import datetime

            task1 = TaskDto(
                id=1,
                title="Existing Task 1",
                description="Task 1 description",
                task_status=TaskStatus.IN_PROGRESS,
                created_at=datetime.now(),
                updated_at=datetime.now(),
                comments=[],
                attachments=[],
                assignee_id=None,
            )

            task2 = TaskDto(
                id=2,
                title="Existing Task 2",
                description="Task 2 description",
                task_status=TaskStatus.DONE,
                created_at=datetime.now(),
                updated_at=datetime.now(),
                comments=[],
                attachments=[],
                assignee_id=None,
            )

            mock_answer.return_value = ("Based on existing tasks", [task1, task2])

            # Create test client
            from main import app

            client = TestClient(app)

            # Prepare request
            request_data = {
                "project_id": "test-project",
                "user_id": "test-user",
                "prompt": "What's the status?",
            }

            # Act
            response = client.post("/interpret", json=request_data)

            # Assert
            assert response.status_code == 200
            response_data = response.json()
            assert response_data["intent"] == "answering"
            assert response_data["answer"] == "Based on existing tasks"
            assert len(response_data["existing_tasks"]) == 2
            assert response_data["existing_tasks"][0]["title"] == "Existing Task 1"
            assert response_data["existing_tasks"][1]["title"] == "Existing Task 2"
            assert response_data["new_tasks"] == []

    def test_interpret_missing_project_id(self):
        """Test that missing project_id returns validation error"""
        # Mock dependencies to ensure environment is set
        with patch.dict(
            os.environ,
            {
                "DATABASE_URL": "postgresql://test:test@localhost/test",
                "EMBED_MODEL": "test-embed-model",
                "OLLAMA_EMBED_HOST": "http://localhost:11434",
                "OLLAMA_EMBED_KEY": "test-key",
                "OLLAMA_CHAT_HOST": "http://localhost:11434",
                "OLLAMA_CHAT_KEY": "test-key",
                "CHAT_MODEL": "test-chat-model",
            },
        ):

            # Create test client
            from main import app

            client = TestClient(app)

            # Prepare request without project_id
            request_data = {"prompt": "Create a task", "user_id": "test-user"}

            # Act
            response = client.post("/interpret", json=request_data)

            # Assert
            assert response.status_code == 422  # Validation error

    def test_interpret_missing_prompt(self):
        """Test that missing prompt returns validation error"""
        # Mock dependencies to ensure environment is set
        with patch.dict(
            os.environ,
            {
                "DATABASE_URL": "postgresql://test:test@localhost/test",
                "EMBED_MODEL": "test-embed-model",
                "OLLAMA_EMBED_HOST": "http://localhost:11434",
                "OLLAMA_EMBED_KEY": "test-key",
                "OLLAMA_CHAT_HOST": "http://localhost:11434",
                "OLLAMA_CHAT_KEY": "test-key",
                "CHAT_MODEL": "test-chat-model",
            },
        ):

            # Create test client
            from main import app

            client = TestClient(app)

            # Prepare request without prompt
            request_data = {"project_id": "test-project", "user_id": "test-user"}

            # Act
            response = client.post("/interpret", json=request_data)

            # Assert
            assert response.status_code == 422  # Validation error

    def test_interpret_optional_user_id(self):
        """Test that user_id is optional"""
        # Mock dependencies
        with patch("main.classify_prompt") as mock_classify, patch(
            "main.generate_answer_and_tasks"
        ) as mock_generate, patch.dict(
            os.environ,
            {
                "DATABASE_URL": "postgresql://test:test@localhost/test",
                "EMBED_MODEL": "test-embed-model",
                "OLLAMA_EMBED_HOST": "http://localhost:11434",
                "OLLAMA_EMBED_KEY": "test-key",
                "OLLAMA_CHAT_HOST": "http://localhost:11434",
                "OLLAMA_CHAT_KEY": "test-key",
                "CHAT_MODEL": "test-chat-model",
            },
        ):

            # Setup mocks
            from models.intent import IntentType, IntentResult

            mock_intent = IntentResult(intent=IntentType.generation)
            mock_classify.return_value = mock_intent

            # Create real AddTaskDto object
            from openapi_client.models.add_task_dto import AddTaskDto
            from openapi_client.models.task_status import TaskStatus

            task = AddTaskDto(
                title="Task",
                description="Task description",
                task_status=TaskStatus.BACKLOG,
                assignee_id=None,
            )

            mock_generate.return_value = ("Response", [task])

            # Create test client
            from main import app

            client = TestClient(app)

            # Prepare request without user_id
            request_data = {
                "project_id": "test-project",
                "prompt": "Create a simple API",
            }

            # Act
            response = client.post("/interpret", json=request_data)

            # Assert
            assert response.status_code == 200
            response_data = response.json()
            assert response_data["intent"] == "generation"
            assert response_data["answer"] == "Response"
            assert len(response_data["new_tasks"]) == 1
            assert response_data["new_tasks"][0]["title"] == "Task"
