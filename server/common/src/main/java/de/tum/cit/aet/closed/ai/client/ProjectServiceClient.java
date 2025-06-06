package de.tum.cit.aet.closed.ai.client;

import de.tum.cit.aet.closed.ai.dto.ProjectDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Component
public class ProjectServiceClient {

    private final RestClient restClient;

    public ProjectServiceClient(@Value("${project-service.url}") String projectServiceUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(projectServiceUrl)
                .build();
    }

    public Optional<ProjectDto> findById(Long id) {
        try {
            ProjectDto projectDto = restClient.get()
                    .uri("/projects/{id}", id)
                    .retrieve()
                    .body(ProjectDto.class);

            if (projectDto == null) {
                return Optional.empty();
            }

            return Optional.of(projectDto);
        } catch (ResponseStatusException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                return Optional.empty();
            }
            throw e;
        }
    }
}
