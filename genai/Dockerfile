FROM python:3.11-slim
WORKDIR /app

COPY pyproject.toml poetry.lock ./
COPY server_api/ ./server_api/

RUN pip install poetry==2.1.2

RUN poetry config virtualenvs.create false \
    && poetry install --no-root --no-interaction --no-ansi

COPY app/ ./app
COPY .env .env

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
