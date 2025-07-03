## 🧠 GenAI Service

The **GenAI** service brings intelligent task and project assistance to your Kanban workspace using LLMs, embeddings, and RAG.

---

### 🚀 Features

- **/interpret**: Classifies a user prompt as a `generation` or `answering` intent.
- **Task Generation**: Proposes new tasks based on user input and project context.
- **RAG-Powered Answers**: Retrieves relevant project/task data to answer questions.
- **Embeddings Management**: Automatically syncs and indexes task/project data using pgai.

---

### 📦 Environment Setup

All configuration is environment-driven. You can set up your environment using the provided `.env.example` file.

---

### 🧪 Testing Locally

You can test the GenAI service locally using Docker Compose. Ensure you started the service and run the following command to POST a request:

```bash
curl http://localhost:8084/interpret -X POST \
-H "Content-Type: application/json" \
-d '{
  "user_input": "What tasks are pending?",
  "project_id": 1,
  "user_id": 1
}'
```

---

### 🛠️ Dev Utilities

- `init_pgai.py`: Installs pgai, syncs vectorizers and related views.
- `vectorizers.py`: Defines what data gets embedded and how.
- `.env`: Configure your environment.

---

### 🧠 Interpret Workflow

![GenAI Workflow](./diagrams/GenAI%20activity%20diagram.png)

---