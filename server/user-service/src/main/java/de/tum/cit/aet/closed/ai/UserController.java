package de.tum.cit.aet.closed.ai;

import de.tum.cit.aet.closed.ai.dto.CreateUserDto;
import de.tum.cit.aet.closed.ai.dto.UserDto;
import de.tum.cit.aet.closed.ai.exception.UserNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@AllArgsConstructor
@Tag(
    name = "User Management",
    description = "Operations related to user management including CRUD operations")
public class UserController {
  private final UserService userService;

  @GetMapping
  @Operation(summary = "Get all users", description = "Retrieve a list of all users in the system")
  @ApiResponse(responseCode = "200", description = "Successfully retrieved list of users")
  public List<UserDto> getAll() {
    return userService.findAll().stream().map(UserDto::fromUser).toList();
  }

  @GetMapping("/{id}")
  @Operation(
      summary = "Get user by ID",
      description = "Retrieve a specific user by their unique identifier")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "User found and returned successfully"),
        @ApiResponse(responseCode = "404", description = "User not found with the provided ID")
      })
  public UserDto getUser(
      @Parameter(description = "Unique identifier of the user", required = true) @PathVariable
          Long id) {
    return userService
        .findById(id)
        .map(UserDto::fromUser)
        .orElseThrow(() -> new UserNotFoundException("No user with ID " + id));
  }

  @PostMapping
  @Operation(
      summary = "Create a new user",
      description = "Create a new user with the provided information")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "User created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid user data provided")
      })
  public UserDto create(@RequestBody CreateUserDto createUserDto) {
    return UserDto.fromUser(
        userService.create(createUserDto.name(), createUserDto.profilePicture()));
  }

  @PutMapping("/{id}")
  @Operation(summary = "Update user", description = "Update an existing user's information")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "User updated successfully"),
        @ApiResponse(responseCode = "404", description = "User not found with the provided ID"),
        @ApiResponse(responseCode = "400", description = "Invalid user data provided")
      })
  public UserDto update(
      @Parameter(description = "Unique identifier of the user to update", required = true)
          @PathVariable
          Long id,
      @RequestBody UserDto userDto) {
    return userService
        .findById(id)
        .map(
            user -> {
              user.setName(userDto.name());
              user.setProfilePicture(userDto.profilePicture());
              return userService.save(user);
            })
        .map(UserDto::fromUser)
        .orElseThrow(() -> new UserNotFoundException("No user with ID " + id));
  }

  @DeleteMapping("/{id}")
  @Operation(summary = "Delete user", description = "Delete a user from the system")
  @ApiResponses(
      value = {
        @ApiResponse(responseCode = "200", description = "User deleted successfully"),
        @ApiResponse(responseCode = "404", description = "User not found with the provided ID")
      })
  public void delete(
      @Parameter(description = "Unique identifier of the user to delete", required = true)
          @PathVariable
          Long id) {
    userService.delete(id);
  }
}
