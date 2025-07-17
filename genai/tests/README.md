# GenAI Tests

This directory contains unit tests for the GenAI Kanban Assistant.

## Running Tests

To run all tests:

```bash
pytest tests/
```

To run specific test files:

```bash
pytest tests/test_models.py
```

To run with verbose output:

```bash
pytest tests/ -v
```

## Test Configuration

Tests are automatically configured through:

- `.env.test` - Contains test environment variables (in tests directory)
- `conftest.py` - Loads environment variables and sets up Python path (in tests directory)

## Test Structure

- `test_models.py` - Tests for Pydantic models
- `test_classification.py` - Tests for prompt classification
- `test_generation.py` - Tests for task generation
- `test_answering.py` - Tests for answering with task references
- `test_main.py` - Tests for FastAPI endpoints
- `test_integration.py` - Integration tests for API endpoints
- `test_hello_world.py` - Basic placeholder test

## Integration Tests

The `test_integration.py` file contains simple integration tests that:

- Test the `/healthz` endpoint
- Test the `/interpret` endpoint with both generation and answering flows
- Test request validation (missing required fields)
- Test optional parameters (user_id is optional)

These tests use mocked dependencies to ensure they run independently of external services.

## Running Integration Tests

To run only the integration tests:

```bash
pytest tests/test_integration.py -v
```

## Test Pattern

All tests follow the simple arrange-act-assert pattern:

```python
def test_example():
    # Arrange
    input_data = "test input"

    # Act
    result = function_under_test(input_data)

    # Assert
    assert result == expected_output
```

## Environment Setup

Test environment variables are automatically loaded from `.env.test` file. No manual setup required.
Make sure to install the required dependencies listed in `requirements.txt` before running tests.
