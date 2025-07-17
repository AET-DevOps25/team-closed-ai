import pytest
import sys
from unittest.mock import Mock, patch, MagicMock
import psycopg2


@pytest.fixture
def mock_pgai_dependencies():
    """Mock pgai dependencies with proper isolation"""
    with patch.dict(
        sys.modules,
        {
            "vectorizers": MagicMock(),
            "pgai": MagicMock(),
            "pgai.vectorizer": MagicMock(),
        },
    ):
        # Configure the mocks
        sys.modules["vectorizers"].get_vectorizers = MagicMock()
        sys.modules["pgai.vectorizer"].CreateVectorizer = MagicMock()
        yield


class TestVectorizerManager:

    def test_init(self, mock_pgai_dependencies):
        # Arrange
        mock_conn = Mock()
        mock_cursor = Mock()
        mock_conn.cursor.return_value = mock_cursor

        # Import and test the function with proper isolation
        from pgai_vec.init_pgai import VectorizerManager

        # Act
        manager = VectorizerManager(mock_conn)

        # Assert
        assert manager.conn == mock_conn
        assert manager.cur == mock_cursor
        mock_conn.cursor.assert_called_once()

    def test_ensure_sql_column(self, mock_pgai_dependencies):
        # Arrange
        mock_conn = Mock()
        mock_cursor = Mock()
        mock_conn.cursor.return_value = mock_cursor

        # Import and test the function with proper isolation
        from pgai_vec.init_pgai import VectorizerManager

        manager = VectorizerManager(mock_conn)

        # Act
        manager.ensure_sql_column()

        # Assert
        mock_cursor.execute.assert_called_once_with(
            "ALTER TABLE ai.vectorizer "
            "ADD COLUMN IF NOT EXISTS sql_creation_query TEXT;"
        )

    def test_fetch_existing(self, mock_pgai_dependencies):
        # Arrange
        mock_conn = Mock()
        mock_cursor = Mock()
        mock_conn.cursor.return_value = mock_cursor
        mock_cursor.fetchall.return_value = [
            ("vectorizer1", "CREATE VECTORIZER vectorizer1"),
            ("vectorizer2", "CREATE VECTORIZER vectorizer2"),
        ]

        # Import and test the function with proper isolation
        from pgai_vec.init_pgai import VectorizerManager

        manager = VectorizerManager(mock_conn)

        # Act
        result = manager.fetch_existing()

        # Assert
        assert result == {
            "vectorizer1": "CREATE VECTORIZER vectorizer1",
            "vectorizer2": "CREATE VECTORIZER vectorizer2",
        }
        mock_cursor.execute.assert_called_once_with(
            "SELECT name, sql_creation_query FROM ai.vectorizer;"
        )

    def test_drop(self, mock_pgai_dependencies):
        # Arrange
        mock_conn = Mock()
        mock_cursor = Mock()
        mock_conn.cursor.return_value = mock_cursor

        # Import and test the function with proper isolation
        from pgai_vec.init_pgai import VectorizerManager

        manager = VectorizerManager(mock_conn)
        vectorizer_name = "test_vectorizer"

        # Act
        manager.drop(vectorizer_name)

        # Assert
        mock_cursor.execute.assert_called_once_with(
            "SELECT ai.drop_vectorizer(%s, drop_all=>true);", (vectorizer_name,)
        )

    def test_create(self, mock_pgai_dependencies):
        # Arrange
        mock_conn = Mock()
        mock_cursor = Mock()
        mock_conn.cursor.return_value = mock_cursor

        # Import and test the function with proper isolation
        from pgai_vec.init_pgai import VectorizerManager

        manager = VectorizerManager(mock_conn)

        mock_vectorizer = Mock()
        mock_vectorizer.name = "test_vectorizer"
        mock_vectorizer.to_sql.return_value = "CREATE VECTORIZER test_vectorizer"

        # Act
        manager.create(mock_vectorizer)

        # Assert
        assert mock_cursor.execute.call_count == 2
        mock_cursor.execute.assert_any_call("CREATE VECTORIZER test_vectorizer")
        mock_cursor.execute.assert_any_call(
            "UPDATE ai.vectorizer SET sql_creation_query = %s WHERE name = %s;",
            ("CREATE VECTORIZER test_vectorizer", "test_vectorizer"),
        )

    def test_close(self, mock_pgai_dependencies):
        # Arrange
        mock_conn = Mock()
        mock_cursor = Mock()
        mock_conn.cursor.return_value = mock_cursor

        # Import and test the function with proper isolation
        from pgai_vec.init_pgai import VectorizerManager

        manager = VectorizerManager(mock_conn)

        # Act
        manager.close()

        # Assert
        mock_cursor.close.assert_called_once()


class TestSynchronizeVectorizers:

    def test_synchronize_vectorizers_create_new(self, mock_pgai_dependencies):
        # Arrange
        mock_conn = Mock()
        mock_vectorizer = Mock()
        mock_vectorizer.name = "new_vectorizer"
        mock_vectorizer.to_sql.return_value = "CREATE VECTORIZER new_vectorizer"

        # Import and test the function with proper isolation
        from pgai_vec.init_pgai import VectorizerManager, synchronize_vectorizers

        with patch("pgai_vec.init_pgai.VectorizerManager") as mock_manager_class:
            mock_manager = Mock()
            mock_manager_class.return_value = mock_manager
            mock_manager.fetch_existing.return_value = {}

            with patch(
                "pgai_vec.init_pgai.get_vectorizers", return_value=[mock_vectorizer]
            ):
                # Act
                synchronize_vectorizers(mock_conn)

        # Assert
        mock_manager.ensure_sql_column.assert_called_once()
        mock_manager.fetch_existing.assert_called_once()
        mock_manager.create.assert_called_once_with(mock_vectorizer)
        mock_manager.close.assert_called_once()

    def test_synchronize_vectorizers_drop_unused(self, mock_pgai_dependencies):
        # Arrange
        mock_conn = Mock()
        mock_vectorizer = Mock()
        mock_vectorizer.name = "new_vectorizer"

        # Import and test the function with proper isolation
        from pgai_vec.init_pgai import VectorizerManager, synchronize_vectorizers

        with patch("pgai_vec.init_pgai.VectorizerManager") as mock_manager_class:
            mock_manager = Mock()
            mock_manager_class.return_value = mock_manager
            mock_manager.fetch_existing.return_value = {
                "old_vectorizer": "CREATE VECTORIZER old_vectorizer"
            }

            with patch(
                "pgai_vec.init_pgai.get_vectorizers", return_value=[mock_vectorizer]
            ):
                # Act
                synchronize_vectorizers(mock_conn)

        # Assert
        mock_manager.drop.assert_called_once_with("old_vectorizer")
        mock_manager.create.assert_called_once_with(mock_vectorizer)

    def test_synchronize_vectorizers_update_existing(self, mock_pgai_dependencies):
        # Arrange
        mock_conn = Mock()
        mock_vectorizer = Mock()
        mock_vectorizer.name = "test_vectorizer"
        mock_vectorizer.to_sql.return_value = "NEW CREATE VECTORIZER test_vectorizer"

        # Import and test the function with proper isolation
        from pgai_vec.init_pgai import VectorizerManager, synchronize_vectorizers

        with patch("pgai_vec.init_pgai.VectorizerManager") as mock_manager_class:
            mock_manager = Mock()
            mock_manager_class.return_value = mock_manager
            mock_manager.fetch_existing.return_value = {
                "test_vectorizer": "OLD CREATE VECTORIZER test_vectorizer"
            }

            with patch(
                "pgai_vec.init_pgai.get_vectorizers", return_value=[mock_vectorizer]
            ):
                # Act
                synchronize_vectorizers(mock_conn)

        # Assert
        mock_manager.drop.assert_called_once_with("test_vectorizer")
        mock_manager.create.assert_called_once_with(mock_vectorizer)


class TestMain:

    def test_main_no_db_url(self, mock_pgai_dependencies):
        # Arrange
        # Import and test the function with proper isolation
        from pgai_vec.init_pgai import main

        with patch("pgai_vec.init_pgai.DB_URL", None):
            # Act
            result = main()

        # Assert
        assert result is None

    def test_main_success(self, mock_pgai_dependencies):
        # Arrange
        mock_conn = Mock()

        # Import and test the function with proper isolation
        from pgai_vec.init_pgai import main

        with patch("pgai_vec.init_pgai.DB_URL", "test://db"):
            with patch("pgai_vec.init_pgai.pgai") as mock_pgai:
                with patch("pgai_vec.init_pgai.psycopg2") as mock_psycopg2:
                    with patch(
                        "pgai_vec.init_pgai.synchronize_vectorizers"
                    ) as mock_sync:
                        mock_psycopg2.connect.return_value.__enter__.return_value = (
                            mock_conn
                        )

                        # Act
                        main()

        # Assert
        mock_pgai.install.assert_called_once_with("test://db")
        mock_psycopg2.connect.assert_called_once_with("test://db")
        mock_sync.assert_called_once_with(mock_conn)
        mock_conn.commit.assert_called_once()

    def test_main_database_error(self, mock_pgai_dependencies):
        # Arrange
        # Import and test the function with proper isolation
        from pgai_vec.init_pgai import main

        with patch("pgai_vec.init_pgai.DB_URL", "test://db"):
            with patch("pgai_vec.init_pgai.pgai") as mock_pgai:
                with patch("pgai_vec.init_pgai.psycopg2") as mock_psycopg2:
                    with patch(
                        "pgai_vec.init_pgai.synchronize_vectorizers"
                    ) as mock_sync:
                        mock_psycopg2.connect.side_effect = psycopg2.Error(
                            "Database connection failed"
                        )

                        # Act & Assert
                        with pytest.raises(psycopg2.Error):
                            main()

        mock_pgai.install.assert_called_once_with("test://db")
        mock_psycopg2.connect.assert_called_once_with("test://db")
        mock_sync.assert_not_called()
