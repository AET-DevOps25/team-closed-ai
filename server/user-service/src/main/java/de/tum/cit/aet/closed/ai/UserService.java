package de.tum.cit.aet.closed.ai;

import de.tum.cit.aet.closed.ai.metrics.UserMetrics;
import de.tum.cit.aet.closed.ai.model.User;
import java.util.List;
import java.util.Optional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {
  private final UserRepository userRepository;
  private final UserMetrics userMetrics;

  public List<User> findAll() {
    return userRepository.findAll();
  }

  public Optional<User> findById(Long id) {
    return userRepository.findById(id);
  }

  public User save(User user) {
    return userRepository.save(user);
  }

  public void delete(Long id) {
    userRepository.deleteById(id);
    userMetrics.incrementUsersDeleted();
  }

  public User create(String name, String profilePicture) {
    User user = new User();
    user.setName(name);
    user.setProfilePicture(profilePicture);
    userMetrics.incrementUsersCreated();
    return userRepository.save(user);
  }
}
