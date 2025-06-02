package de.tum.cit.aet.closed.ai.server.persistence.repository;

import de.tum.cit.aet.closed.ai.server.persistence.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByName(String name);
}
