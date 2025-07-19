package de.tum.cit.aet.closed.ai;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import de.tum.cit.aet.closed.ai.metrics.UserMetrics;
import de.tum.cit.aet.closed.ai.model.User;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

  @Mock private UserRepository userRepository;

  @Mock private UserMetrics userMetrics;

  @InjectMocks private UserService userService;

  private User testUser1;
  private User testUser2;

  @BeforeEach
  void setUp() {
    // Create test users
    testUser1 = new User();
    testUser1.setId(1L);
    testUser1.setName("Test User 1");
    testUser1.setProfilePicture("profile1.jpg");

    testUser2 = new User();
    testUser2.setId(2L);
    testUser2.setName("Test User 2");
    testUser2.setProfilePicture("profile2.jpg");
  }

  @Test
  void findAll_ShouldReturnAllUsers() {
    // Arrange
    List<User> expectedUsers = Arrays.asList(testUser1, testUser2);
    when(userRepository.findAll()).thenReturn(expectedUsers);

    // Act
    List<User> actualUsers = userService.findAll();

    // Assert
    assertEquals(expectedUsers, actualUsers);
    verify(userRepository).findAll();
  }

  @Test
  void findById_WhenUserExists_ShouldReturnUser() {
    // Arrange
    when(userRepository.findById(1L)).thenReturn(Optional.of(testUser1));

    // Act
    Optional<User> result = userService.findById(1L);

    // Assert
    assertTrue(result.isPresent());
    assertEquals(testUser1, result.get());
    verify(userRepository).findById(1L);
  }

  @Test
  void findById_WhenUserDoesNotExist_ShouldReturnEmpty() {
    // Arrange
    when(userRepository.findById(99L)).thenReturn(Optional.empty());

    // Act
    Optional<User> result = userService.findById(99L);

    // Assert
    assertFalse(result.isPresent());
    verify(userRepository).findById(99L);
  }

  @Test
  void save_ShouldSaveAndReturnUser() {
    // Arrange
    when(userRepository.save(testUser1)).thenReturn(testUser1);

    // Act
    User savedUser = userService.save(testUser1);

    // Assert
    assertEquals(testUser1, savedUser);
    verify(userRepository).save(testUser1);
  }

  @Test
  void delete_ShouldCallRepositoryAndUpdateMetrics() {
    // Act
    userService.delete(1L);

    // Assert
    verify(userRepository).deleteById(1L);
    verify(userMetrics).incrementUsersDeleted();
  }

  @Test
  void create_ShouldCreateUserAndUpdateMetrics() {
    // Arrange
    String userName = "New User";
    String profilePicture = "new_profile.jpg";

    User newUser = new User();
    newUser.setName(userName);
    newUser.setProfilePicture(profilePicture);

    when(userRepository.save(any(User.class)))
        .thenAnswer(
            invocation -> {
              User user = invocation.getArgument(0);
              user.setId(3L);
              return user;
            });

    // Act
    User createdUser = userService.create(userName, profilePicture);

    // Assert
    assertNotNull(createdUser);
    assertEquals(userName, createdUser.getName());
    assertEquals(profilePicture, createdUser.getProfilePicture());
    assertNotNull(createdUser.getId());
    verify(userRepository).save(any(User.class));
    verify(userMetrics).incrementUsersCreated();
  }
}
