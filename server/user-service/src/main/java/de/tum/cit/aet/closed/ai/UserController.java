package de.tum.cit.aet.closed.ai;

import de.tum.cit.aet.closed.ai.dto.CreateUserDto;
import de.tum.cit.aet.closed.ai.dto.UserDto;

import de.tum.cit.aet.closed.ai.exception.UserNotFoundException;
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
    public UserDto create(@RequestBody CreateUserDto createUserDto) {
        return UserDto.fromUser(userService.create(createUserDto.name(), createUserDto.profilePicture()));
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
