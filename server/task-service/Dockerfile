# Stage 1: Build the application
FROM gradle:8.14-jdk21 AS build

# Set working directory
WORKDIR /app

# Copy gradle configuration files
COPY task-service/build.gradle task-service/settings.gradle ./
COPY gradle ./gradle

# Copy source code
COPY task-service/src ./src
COPY common ./common

# Build the application
RUN gradle bootJar --no-daemon

# Stage 2: Run the application
FROM gcr.io/distroless/java21-debian12

WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

# Expose the port the app runs on
EXPOSE 8081

# Command to run the application
CMD ["app.jar"]