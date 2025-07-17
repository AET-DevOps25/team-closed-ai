import sys
from pathlib import Path
import pytest
from dotenv import load_dotenv

# Add the app directory to Python path
# From tests/conftest.py, go up one level to genai/, then into app/
app_dir = Path(__file__).parent.parent / "app"
sys.path.insert(0, str(app_dir))

# Load test environment variables  
# From tests/conftest.py, go up one level to genai/, then to .env.test
test_env_file = Path(__file__).parent.parent / ".env.test"
load_dotenv(test_env_file)

@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    # Arrange
    # Environment variables are already loaded from .env.test
    
    # Act & Assert
    yield
