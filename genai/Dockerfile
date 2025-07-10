FROM python:3.11-slim
WORKDIR /

COPY openapi_client openapi_client

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY .env .env

COPY pgai_vec pgai_vec

COPY app app

CMD ["sh", "-c", "python app/pgai_vec/init_pgai.py && uvicorn app.main:app --host 0.0.0.0 --port 8084"]
