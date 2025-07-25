# 1. Prepare venv on Debian slim
FROM debian:12-slim AS build
RUN apt-get update && \
    apt-get install --no-install-suggests --no-install-recommends --yes python3-venv gcc libpython3-dev && \
    python3 -m venv /venv && \
    /venv/bin/pip install --upgrade pip setuptools wheel

# 2. Build venv dependencies
FROM build AS build-venv
COPY requirements.txt /requirements.txt
RUN /venv/bin/pip install --disable-pip-version-check -r /requirements.txt

# 3. Distroless minimal image
FROM gcr.io/distroless/python3-debian12
COPY --from=build-venv /venv /venv
COPY /app /app
WORKDIR /app
ENTRYPOINT ["/venv/bin/python3", "main.py"]
