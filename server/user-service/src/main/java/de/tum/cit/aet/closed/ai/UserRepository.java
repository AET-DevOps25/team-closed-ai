package de.tum.cit.aet.closed.ai;

import de.tum.cit.aet.closed.ai.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByName(String name);
}
