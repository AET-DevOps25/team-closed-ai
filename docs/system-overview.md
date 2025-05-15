# 📝 System Overview —> Architecture

## 1\. Initial System Structure

*   **Server:** Spring Boot REST API
Our system will be seperated into three main microservices distributed among three developers.

1. Project and Task Organization
    - This service will handle the organization of projects and tasks. It will provide endpoints for creating, updating, and deleting projects and tasks.
    - It will also manage the relationships between projects and tasks, ensuring that tasks are properly associated with their respective projects.
    - This service will also be responsible for storing project related data like requirement documents, project plans, and other relevant information in a vector database.
    - It will provide endpoints for uploading and retrieving these documents.
2. Recommender System
    - This service will be responsible for generating task recommendations based on user input and project data.
    - It will use the GenAI service to generate recommendations and provide endpoints for retrieving these recommendations.
3. Client Service
    - This service will provide the Client for the application to the users.

*   **Client:** React / Angular / Vue.js frontend
We use a React frontend to provide a user-friendly interface for our application.
The frontend will communicate with the backend services via REST APIs.

*   **GenAI Service:** Python, LangChain microservice
We will implement a GenAI service using Python and LangChain. This service will be used by the recommender system to generate task recommendations based on user input and project data.

*   **Database:** (e.g., PostgreSQL, MongoDB)
We will use SQLite as our database to store project and task data. SQLite is lightweight and easy to set up, making it a good choice for self-hosted applications.

*   **Vector Database:** (e.g., Pinecone, Weaviate)
TBD

## 2\. System Overview

*   A simple analysis object model in the form of a UML class diagram
![Analysis Object Model](./images/Analysis%20Object%20Model.png)
*   A use case diagram
![Use Case Diagram](./images/Use%20Case%20Diagram.png)
*   A UML component diagram to visualize the architecture (this can be understood as the "top-level architecture diagram")

You can use tools like [Apollon](https://apollon.ase.in.tum.de).
