package de.tum.cit.aet.closed.ai.server.controller;

import de.tum.cit.aet.closed.ai.server.controller.dto.UserDto;
import de.tum.cit.aet.closed.ai.server.exception.UserNotFoundException;
import de.tum.cit.aet.closed.ai.server.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    public List<UserDto> getAll() {
        return userService.findAll().stream()
                .map(UserDto::fromUser)
                .toList();
    }

    @GetMapping("/{id}")
    public UserDto getUser(@PathVariable Long id) {
        return userService.findById(id)
                .map(UserDto::fromUser)
                .orElseThrow(() -> new UserNotFoundException("No user with ID " + id));
    }

    @PostMapping
    public UserDto create(@RequestBody UserDto userDto) {
        return UserDto.fromUser(userService.create(userDto.name(), userDto.profilePicture()));
    }

    @PutMapping("/{id}")
    public UserDto update(@PathVariable Long id, @RequestBody UserDto userDto) {
        return userService.findById(id)
                .map(user -> {
                    user.setName(userDto.name());
                    user.setProfilePicture(userDto.profilePicture());
                    return userService.save(user);
                })
                .map(UserDto::fromUser)
                .orElseThrow(() -> new UserNotFoundException("No user with ID " + id));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        userService.delete(id);
    }
}
