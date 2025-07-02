FROM python:3.11-slim
WORKDIR /

COPY openapi_client openapi_client

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY .env .env

COPY pgai pgai

COPY app app

CMD ["sh", "-c", "python pgai/init_pgai.py && uvicorn app.main:app --host 0.0.0.0 --port 8084"]
