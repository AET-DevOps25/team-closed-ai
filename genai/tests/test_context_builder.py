import pytest
import os
import sys
from unittest.mock import Mock, patch, MagicMock


@pytest.fixture
def mock_dependencies():
    """Mock external dependencies with proper isolation"""
    with patch.dict(sys.modules, {
        'langchain_ollama': MagicMock(),
        'pgai_vec': MagicMock(),
        'pgai_vec.vectorizers': MagicMock(),
        'pgvector': MagicMock(),
        'pgvector.psycopg2': MagicMock()
    }):
        # Configure the mocks
        sys.modules['langchain_ollama'].OllamaEmbeddings = MagicMock()
        sys.modules['pgai_vec'].vectorizers = MagicMock()
        sys.modules['pgvector'].psycopg2 = MagicMock()
        sys.modules['pgvector'].Vector = MagicMock()
        yield


class TestBuildProjectContext:
    
    @patch('chain.context_builder.psycopg2.connect')
    @patch('chain.context_builder.register_vector')
    @patch('chain.context_builder.get_vectorizers')
    @patch.dict(os.environ, {'DATABASE_URL': 'test://db'})
    def test_build_project_context_success(self, mock_get_vectorizers, mock_register, mock_connect, mock_dependencies):
        # Arrange
        project_id = "test_project_123"
        query_embeddings = [0.1, 0.2, 0.3]
        k = 2
        
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value.__enter__.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        
        mock_vectorizer = Mock()
        mock_vectorizer.source = "project"
        mock_vectorizer.destination.destination = "project_embeddings"
        mock_get_vectorizers.return_value = [mock_vectorizer]
        
        mock_cursor.fetchall.return_value = [
            ("Project chunk 1",),
            ("Project chunk 2",),
        ]
        
        # Import and test the function with proper isolation
        from chain.context_builder import _build_project_context
        
        # Act
        result = _build_project_context(project_id, query_embeddings, k)
        
        # Assert
        assert result == ["Project chunk 1", "Project chunk 2"]
        mock_connect.assert_called_once_with('test://db')
        mock_register.assert_called_once_with(mock_conn)
        mock_cursor.execute.assert_called_once()

    @patch('chain.context_builder.psycopg2.connect')
    @patch('chain.context_builder.register_vector')
    @patch('chain.context_builder.get_vectorizers')
    @patch.dict(os.environ, {'DATABASE_URL': 'test://db'})
    def test_build_project_context_no_project_vectorizer(self, mock_get_vectorizers, mock_register, mock_connect, mock_dependencies):
        # Arrange
        project_id = "test_project_123"
        query_embeddings = [0.1, 0.2, 0.3]
        k = 2
        
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value.__enter__.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        
        mock_vectorizer = Mock()
        mock_vectorizer.source = "task"  # Not project
        mock_get_vectorizers.return_value = [mock_vectorizer]
        
        # Import and test the function with proper isolation
        from chain.context_builder import _build_project_context
        
        # Act
        result = _build_project_context(project_id, query_embeddings, k)
        
        # Assert
        assert result == []
        mock_cursor.execute.assert_not_called()

    @patch('chain.context_builder.psycopg2.connect')
    @patch('chain.context_builder.register_vector')
    @patch('chain.context_builder.get_vectorizers')
    @patch.dict(os.environ, {'DATABASE_URL': 'test://db'})
    def test_build_project_context_with_none_chunks(self, mock_get_vectorizers, mock_register, mock_connect, mock_dependencies):
        # Arrange
        project_id = "test_project_123"
        query_embeddings = [0.1, 0.2, 0.3]
        k = 2
        
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value.__enter__.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        
        mock_vectorizer = Mock()
        mock_vectorizer.source = "project"
        mock_vectorizer.destination.destination = "project_embeddings"
        mock_get_vectorizers.return_value = [mock_vectorizer]
        
        mock_cursor.fetchall.return_value = [
            ("Valid chunk",),
            (None,),  # None chunk should be filtered out
            ("Another valid chunk",),
        ]
        
        # Import and test the function with proper isolation
        from chain.context_builder import _build_project_context
        
        # Act
        result = _build_project_context(project_id, query_embeddings, k)
        
        # Assert
        assert result == ["Valid chunk", "Another valid chunk"]


class TestBuildTaskContext:
    
    @patch('chain.context_builder.psycopg2.connect')
    @patch('chain.context_builder.register_vector')
    @patch('chain.context_builder.get_vectorizers')
    @patch.dict(os.environ, {'DATABASE_URL': 'test://db'})
    def test_build_task_context_success_with_descriptions(self, mock_get_vectorizers, mock_register, mock_connect, mock_dependencies):
        # Arrange
        project_id = "test_project_123"
        query_embeddings = [0.1, 0.2, 0.3]
        k = 6
        
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value.__enter__.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        
        mock_vectorizer = Mock()
        mock_vectorizer.source = "task"
        mock_vectorizer.destination.destination = "task_embeddings"
        mock_get_vectorizers.return_value = [mock_vectorizer]
        
        mock_cursor.fetchall.return_value = [
            ("Task chunk 1", "Task description 1"),
            ("Task chunk 2", None),
            ("Task chunk 3", "Task description 3"),
        ]
        
        # Import and test the function with proper isolation
        from chain.context_builder import _build_task_context
        
        # Act
        result = _build_task_context(project_id, query_embeddings, k)
        
        # Assert
        expected = [
            "Task chunk 1\n- Description: Task description 1",
            "Task chunk 2",
            "Task chunk 3\n- Description: Task description 3"
        ]
        assert result == expected
        mock_connect.assert_called_once_with('test://db')
        mock_register.assert_called_once_with(mock_conn)
        mock_cursor.execute.assert_called_once()

    @patch('chain.context_builder.psycopg2.connect')
    @patch('chain.context_builder.register_vector')
    @patch('chain.context_builder.get_vectorizers')
    @patch.dict(os.environ, {'DATABASE_URL': 'test://db'})
    def test_build_task_context_no_task_vectorizer(self, mock_get_vectorizers, mock_register, mock_connect, mock_dependencies):
        # Arrange
        project_id = "test_project_123"
        query_embeddings = [0.1, 0.2, 0.3]
        k = 6
        
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value.__enter__.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        
        mock_vectorizer = Mock()
        mock_vectorizer.source = "project"  # Not task
        mock_get_vectorizers.return_value = [mock_vectorizer]
        
        # Import and test the function with proper isolation
        from chain.context_builder import _build_task_context
        
        # Act
        result = _build_task_context(project_id, query_embeddings, k)
        
        # Assert
        assert result == []
        mock_cursor.execute.assert_not_called()

    @patch('chain.context_builder.psycopg2.connect')
    @patch('chain.context_builder.register_vector')
    @patch('chain.context_builder.get_vectorizers')
    @patch.dict(os.environ, {'DATABASE_URL': 'test://db'})
    def test_build_task_context_empty_results(self, mock_get_vectorizers, mock_register, mock_connect, mock_dependencies):
        # Arrange
        project_id = "test_project_123"
        query_embeddings = [0.1, 0.2, 0.3]
        k = 6
        
        mock_conn = MagicMock()
        mock_cursor = MagicMock()
        mock_connect.return_value.__enter__.return_value = mock_conn
        mock_conn.cursor.return_value.__enter__.return_value = mock_cursor
        
        mock_vectorizer = Mock()
        mock_vectorizer.source = "task"
        mock_vectorizer.destination.destination = "task_embeddings"
        mock_get_vectorizers.return_value = [mock_vectorizer]
        
        mock_cursor.fetchall.return_value = []
        
        # Import and test the function with proper isolation
        from chain.context_builder import _build_task_context
        
        # Act
        result = _build_task_context(project_id, query_embeddings, k)
        
        # Assert
        assert result == []


class TestBuildContext:
    
    @patch('chain.context_builder.embedder')
    @patch('chain.context_builder._build_project_context')
    @patch('chain.context_builder._build_task_context')
    @patch('chain.context_builder.Vector')
    def test_build_context_success_with_user_id(self, mock_vector, mock_build_task, mock_build_project, mock_embedder, mock_dependencies):
        # Arrange
        project_id = "test_project_123"
        user_id = "user_456"
        prompt = "Test prompt"
        
        mock_embedder.embed_query.return_value = [0.1, 0.2, 0.3]
        mock_vector.return_value = [0.1, 0.2, 0.3]
        
        mock_build_project.return_value = ["Project context 1", "Project context 2"]
        mock_build_task.return_value = ["Task context 1", "Task context 2", "Task context 3"]
        
        # Import and test the function with proper isolation
        from chain.context_builder import build_context
        
        # Act
        result = build_context(project_id, user_id, prompt)
        
        # Assert
        expected = (
            "ProjectID: test_project_123 | UserID: user_456\n"
            "---\n"
            "Project context 1\n"
            "---\n"
            "Project context 2\n"
            "---\n"
            "Task context 1\n"
            "---\n"
            "Task context 2\n"
            "---\n"
            "Task context 3"
        )
        assert result == expected
        mock_embedder.embed_query.assert_called_once_with(prompt)
        mock_vector.assert_called_once_with([0.1, 0.2, 0.3])
        mock_build_project.assert_called_once_with(project_id, [0.1, 0.2, 0.3], 2)
        mock_build_task.assert_called_once_with(project_id, [0.1, 0.2, 0.3], 6)

    @patch('chain.context_builder.embedder')
    @patch('chain.context_builder._build_project_context')
    @patch('chain.context_builder._build_task_context')
    @patch('chain.context_builder.Vector')
    def test_build_context_success_without_user_id(self, mock_vector, mock_build_task, mock_build_project, mock_embedder, mock_dependencies):
        # Arrange
        project_id = "test_project_123"
        user_id = None
        prompt = "Test prompt"
        
        mock_embedder.embed_query.return_value = [0.1, 0.2, 0.3]
        mock_vector.return_value = [0.1, 0.2, 0.3]
        
        mock_build_project.return_value = ["Project context 1"]
        mock_build_task.return_value = ["Task context 1"]
        
        # Import and test the function with proper isolation
        from chain.context_builder import build_context
        
        # Act
        result = build_context(project_id, user_id, prompt)
        
        # Assert
        expected = (
            "ProjectID: test_project_123\n"
            "---\n"
            "Project context 1\n"
            "---\n"
            "Task context 1"
        )
        assert result == expected

    @patch('chain.context_builder.embedder')
    @patch('chain.context_builder._build_project_context')
    @patch('chain.context_builder._build_task_context')
    @patch('chain.context_builder.Vector')
    @patch('builtins.print')
    def test_build_context_project_error_handling(self, mock_print, mock_vector, mock_build_task, mock_build_project, mock_embedder, mock_dependencies):
        # Arrange
        project_id = "test_project_123"
        user_id = "user_456"
        prompt = "Test prompt"
        
        mock_embedder.embed_query.return_value = [0.1, 0.2, 0.3]
        mock_vector.return_value = [0.1, 0.2, 0.3]
        
        mock_build_project.side_effect = Exception("Project context error")
        mock_build_task.return_value = ["Task context 1"]
        
        # Import and test the function with proper isolation
        from chain.context_builder import build_context
        
        # Act
        result = build_context(project_id, user_id, prompt)
        
        # Assert
        expected = (
            "ProjectID: test_project_123 | UserID: user_456\n"
            "---\n"
            "No project information available\n"
            "---\n"
            "Task context 1"
        )
        assert result == expected
        mock_print.assert_called_once_with("Error building project context: Project context error")

    @patch('chain.context_builder.embedder')
    @patch('chain.context_builder._build_project_context')
    @patch('chain.context_builder._build_task_context')
    @patch('chain.context_builder.Vector')
    @patch('builtins.print')
    def test_build_context_task_error_handling(self, mock_print, mock_vector, mock_build_task, mock_build_project, mock_embedder, mock_dependencies):
        # Arrange
        project_id = "test_project_123"
        user_id = "user_456"
        prompt = "Test prompt"
        
        mock_embedder.embed_query.return_value = [0.1, 0.2, 0.3]
        mock_vector.return_value = [0.1, 0.2, 0.3]
        
        mock_build_project.return_value = ["Project context 1"]
        mock_build_task.side_effect = Exception("Task context error")
        
        # Import and test the function with proper isolation
        from chain.context_builder import build_context
        
        # Act
        result = build_context(project_id, user_id, prompt)
        
        # Assert
        expected = (
            "ProjectID: test_project_123 | UserID: user_456\n"
            "---\n"
            "Project context 1\n"
            "---\n"
            "No task information available"
        )
        assert result == expected
        mock_print.assert_called_once_with("Error building task context: Task context error")

    @patch('chain.context_builder.embedder')
    @patch('chain.context_builder._build_project_context')
    @patch('chain.context_builder._build_task_context')
    @patch('chain.context_builder.Vector')
    @patch('builtins.print')
    def test_build_context_both_errors(self, mock_print, mock_vector, mock_build_task, mock_build_project, mock_embedder, mock_dependencies):
        # Arrange
        project_id = "test_project_123"
        user_id = None
        prompt = "Test prompt"
        
        mock_embedder.embed_query.return_value = [0.1, 0.2, 0.3]
        mock_vector.return_value = [0.1, 0.2, 0.3]
        
        mock_build_project.side_effect = Exception("Project context error")
        mock_build_task.side_effect = Exception("Task context error")
        
        # Import and test the function with proper isolation
        from chain.context_builder import build_context
        
        # Act
        result = build_context(project_id, user_id, prompt)
        
        # Assert
        expected = (
            "ProjectID: test_project_123\n"
            "---\n"
            "No project information available\n"
            "---\n"
            "No task information available"
        )
        assert result == expected
        assert mock_print.call_count == 2

    @patch('chain.context_builder.embedder')
    @patch('chain.context_builder._build_project_context')
    @patch('chain.context_builder._build_task_context')
    @patch('chain.context_builder.Vector')
    def test_build_context_empty_results(self, mock_vector, mock_build_task, mock_build_project, mock_embedder, mock_dependencies):
        # Arrange
        project_id = "test_project_123"
        user_id = "user_456"
        prompt = "Test prompt"
        
        mock_embedder.embed_query.return_value = [0.1, 0.2, 0.3]
        mock_vector.return_value = [0.1, 0.2, 0.3]
        
        mock_build_project.return_value = []
        mock_build_task.return_value = []
        
        # Import and test the function with proper isolation
        from chain.context_builder import build_context
        
        # Act
        result = build_context(project_id, user_id, prompt)
        
        # Assert
        expected = "ProjectID: test_project_123 | UserID: user_456"
        assert result == expected
