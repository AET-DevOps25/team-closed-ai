FROM python:3.11-slim
WORKDIR /

COPY openapi_client openapi_client

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY .env .env

COPY scripts scripts

COPY app app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
