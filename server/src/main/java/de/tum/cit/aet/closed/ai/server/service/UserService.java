package de.tum.cit.aet.closed.ai.server.service;

import de.tum.cit.aet.closed.ai.server.persistence.model.User;
import de.tum.cit.aet.closed.ai.server.persistence.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {
    private final UserRepository users;

    public List<User> findAll() {
        return users.findAll();
    }
    public Optional<User> findById(Long id) {
        return users.findById(id);
    }
    public User save(User user) {
        return users.save(user);
    }
    public void delete(Long id) {
        users.deleteById(id);
    }

    public User create(String name, String profilePicture) {
        User user = new User();
        user.setName(name);
        user.setProfilePicture(profilePicture);
        return users.save(user);
    }
}