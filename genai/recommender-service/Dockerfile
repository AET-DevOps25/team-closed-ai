FROM python:3.11-slim

# Set work directory
WORKDIR /app

# Install Poetry
RUN pip install poetry

# Copy project files
COPY . /app/

# Install dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "recommender_service.main:app", "--host", "0.0.0.0", "--port", "8000"]
