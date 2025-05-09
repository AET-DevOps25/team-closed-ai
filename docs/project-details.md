# 🎯 Project: Development, Deployment, and Scaling of a Web Application with GenAI Integration and Kubernetes Orchestration

## 🎯 Objective

In this course project, teams will design and implement a lightweight but technically complete web application. The goal is to apply modern DevOps principles including containerization, CI/CD automation, cloud-native deployment, observability, and AI integration.

The system must:

-   Be built as a client-server application (client: React/Vue/Angular, server: Spring Boot)
-   Integrate a meaningful Generative AI (GenAI) component using LangChain (Python)
-   Include a vector database (e.g., Weaviate) to enable Retrieval-Augmented Generation (RAG)
-   Be deployed to Kubernetes using GitHub Actions and Helm or raw manifests
-   Be observable with Prometheus and Grafana
-   Be collaboratively developed with documented ownership and clear workflows

The application domain is flexible but must meet all technical and process criteria.  
The project aims to simulate real-world development scenarios by combining software engineering, DevOps automation, AI integration, and team collaboration.

- - -

## 👥 Organization and Collaboration

| **Aspect** | **Details** |
| --- | --- |
| **Team Size** | 3 students per team |
| **Registration** | Each student must provide: GitHub username, TUMonline login, matriculation number for accurate contribution tracking |
| **Tutor Assignment** | Each team will be supervised by a tutor for technical guidance and evaluation |
| **Subsystem Ownership** | Responsibility must be clearly assigned to students (server, client, or GenAI) and documented, but collaborative co-development is explicitly encouraged. |
| **Contribution Tracking** | Must be visible via GitHub commits, PR authorship, and participation in DevOps setup (CI/CD) |
| **Weekly Sync** | Status updates must be posted weekly via GitHub Wiki and Artemis (Markdown table format) |
| **Communication** | Conducted via dedicated Artemis team channels (e.g., for tutor feedback, planning, or problem solving) |

### 📋 Status Table Format Example

| Week | Status | Impediments | Promises |
| --- | --- | --- | --- |
| 1   | Implemented server API | Waiting for DB setup | Add unit tests |

Teams are expected to engage in asynchronous communication, respond to tutor feedback promptly, and manage their collaboration like a real-world DevOps team.

- - -

## 💻 GitHub Collaboration Workflow

-   The project must be developed in a **GitHub mono-repo**
-   Work must be structured via **Pull Requests (PRs)**:
    -   Each feature or bugfix is developed in a feature branch
    -   A PR must be submitted and reviewed before merging into `main`
    -   Team members must peer-review and approve each other’s code
-   The CI/CD pipeline must:
    -   Run automated tests on every PR
    -   Automatically deploy to a Kubernetes staging environment on merge to `main`

- - -

## 🧩 Technical Requirements

### 🔨 Application Stack

| Component | Technology | Notes |
| --- | --- | --- |
| Server | Spring Boot (Java) | Must expose REST APIs and consist of at least 3 microservices. Use modular architecture. |
| Client | React, Angular, Vue.js | Usable, responsive UI that interacts with server over REST. |
| Database | MySQL or PostgreSQL or similar | Must support persistent storage. Schema must be documented. Run via Docker. |

- - -

### 🧠 GenAI Integration

| Requirement | Details |
| --- | --- |
| Language | Python |
| Framework | LangChain |
| Deployment | Must be a modular microservice (containerized and networked with the server) |
| Functionality | Must fulfill a real user-facing use case (e.g., summarization, generation, Q&A) |
| LLM Support | Must support both cloud-based (OpenAI API) and local models (e.g., GPT4All, LLaMA) |
| Vector Database | Must include a vector store (e.g., Weaviate) to enable Retrieval-Augmented Generation (RAG) |
| **Optional Bonus** | Implement a full RAG architecture using a vector database like Weaviate |

- - -

### 🐳 Containerization & Local Setup

| Requirement | Details |
| --- | --- |
| Dockerization | All components (server, client, GenAI, DB) must have their own Dockerfile. Minimum: 5 containers. |
| Compose File | A `docker-compose.yml` must exist for running the system end-to-end locally. |
| Setup Simplicity | Must be runnable in **three or fewer commands** (e.g., `docker compose up`). Sane defaults required — no complex manual ENV setup. |

- - -

### ☸️ Kubernetes Deployment

| Requirement | Details |
| --- | --- |
| Kubernetes | Must be deployable to a Kubernetes cluster using Helm or raw manifests |
| Supported Environments | Local (Minikube, Kind) and a cloud option (to be announced) |
| **Optional Bonus** | Optionally support running LLMs inside the cluster, e.g. via GPU-ready containers or **GPT 4.1 nano via Azure API** (will be provided by us if needed) |

- - -

### 🔁 CI/CD Pipeline

| Requirement | Details |
| --- | --- |
| Tooling | GitHub Actions |
| CI Tasks | Build and test all services, perform static analysis/linting |
| CD Tasks | Automatically deploy to Kubernetes (staging) on merge to `main` |
| Configuration | Must use secrets and support environment-specific variables. Deployment should be reproducible and maintainable. |

- - -

### 📊 Monitoring & Observability

| Tool | Purpose | Requirements |
| --- | --- | --- |
| Prometheus | Metrics collection | Track at least: request count, latency, and error rate |
| Grafana | Visualization | Dashboards must reflect key system metrics (server, GenAI). Must be submitted as `.file` |
| Alerting | Notifications | At least one meaningful alert rule (e.g., service down, slow response time) |

- - -

### 🧪 Testing & Process

| Item | Requirement |
| --- | --- |
| Unit Tests | Must cover critical server and GenAI logic |
| Client Tests | Should cover core workflows and interactions |
| CI Testing | All tests must run automatically in the CI pipeline |
| Architecture Diagrams | Provide UML-style diagrams: Subsystem Decomposition & Top Layer Architecture are mandatory |
| API Design | Must provide OpenAPI/Swagger documentation and expose Swagger UI or equivalent |

- - -

## 📦 Deliverables

| Deliverable | Description |
| --- | --- |
| Source Code | Complete codebase for server, client, and GenAI services |
| Docker Setup | Dockerfiles and `docker-compose.yml` for local setup |
| Kubernetes Deployment | Helm charts or raw Kubernetes YAMLs with setup instructions |
| Monitoring Configuration | Prometheus + Grafana config with exported dashboards and alert rules (files required) |
| Testing Suite | Unit/integration tests with instructions to run them |
| Documentation | In `README.md` or GitHub Wiki: setup guide, architecture diagrams, API docs, CI/CD/monitoring instructions, student responsibilities |
| Weekly Reports | Markdown tables with weekly progress, impediments, and promises |
| Final Presentation | 10–15 minute live demo. Each student must present and explain their subsystem and be ready for Q&A |
