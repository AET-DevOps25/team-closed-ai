package de.tum.cit.aet.closed.ai.client;

import de.tum.cit.aet.closed.ai.dto.ProjectDto;
import de.tum.cit.aet.closed.ai.dto.UserDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Component
public class UserServiceClient {

    private final RestClient restClient;

    public UserServiceClient(@Value("${user-service.url}") String userServiceUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(userServiceUrl)
                .build();
    }

    public Optional<UserDto> findById(Long id) {
        try {
            UserDto userDto = restClient.get()
                    .uri("/users/{id}", id)
                    .retrieve()
                    .body(UserDto.class);

            if (userDto == null) {
                return Optional.empty();
            }

            return Optional.of(userDto);
        } catch (ResponseStatusException e) {
            if (e.getStatusCode() == HttpStatus.NOT_FOUND) {
                return Optional.empty();
            }
            throw e;
        }
    }
}
