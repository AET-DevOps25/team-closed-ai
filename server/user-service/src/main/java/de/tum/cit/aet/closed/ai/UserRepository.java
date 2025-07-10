package de.tum.cit.aet.closed.ai;

import de.tum.cit.aet.closed.ai.model.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByName(String name);
}
