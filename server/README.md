# Closed AI's Micro-services

## Service Access

### Local Development
When running the services locally (without Docker):

- **Project Service**: http://localhost:8083/projects
- **User Service**: http://localhost:8082/users
- **Task Service**: http://localhost:8081/tasks

### Docker with Traefik
When running with Docker Compose, all services are accessible through Traefik on port 80:

- **Project Service**: http://localhost/projects
- **User Service**: http://localhost/users
- **Task Service**: http://localhost/tasks

The Traefik dashboard is available at http://localhost:8080

## Build and Test
To build and test all services, just execute `./gradlew build` from the top directory (`/server`).

## Postman Collection

Import the postman_collection.json file to Postman to see available endpoints.
