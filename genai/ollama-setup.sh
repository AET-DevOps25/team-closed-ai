#!/bin/bash

ollama serve &

echo "Waiting for ollama to be ready..."
until ollama list &> /dev/null; do
  sleep 1
done

echo "Pulling model: $OLLAMA_LLM"
ollama pull "$OLLAMA_LLM"

echo "Preloading model: $OLLAMA_LLM"
ollama run "$OLLAMA_LLM" "This is a test prompt to preload the model." --keepalive ${OLLAMA_KEEP_ALIVE}

tail -f /dev/null
