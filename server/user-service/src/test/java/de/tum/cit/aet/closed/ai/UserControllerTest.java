package de.tum.cit.aet.closed.ai;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

  private MockMvc mockMvc;

  @Mock private UserService userService;

  @InjectMocks private UserController userController;

  private User testUser1;
  private User testUser2;
  private List<User> userList;

  @BeforeEach
  void setUp() {
    // Set up MockMvc
    mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

    // Create test users
    testUser1 = new User();
    testUser1.setId(1L);
    testUser1.setName("Test User 1");
    testUser1.setProfilePicture("profile1.jpg");

    testUser2 = new User();
    testUser2.setId(2L);
    testUser2.setName("Test User 2");
    testUser2.setProfilePicture("profile2.jpg");

    userList = Arrays.asList(testUser1, testUser2);
  }

  @Test
  void getAllUsers_ShouldReturnAllUsers() throws Exception {
    // Mock service method
    when(userService.findAll()).thenReturn(userList);

    // Perform GET request and validate response
    mockMvc
        .perform(get("/users"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(2)))
        .andExpect(jsonPath("$[0].id", is(1)))
        .andExpect(jsonPath("$[0].name", is("Test User 1")))
        .andExpect(jsonPath("$[0].profilePicture", is("profile1.jpg")))
        .andExpect(jsonPath("$[1].id", is(2)))
        .andExpect(jsonPath("$[1].name", is("Test User 2")))
        .andExpect(jsonPath("$[1].profilePicture", is("profile2.jpg")));

    // Verify service method was called
    verify(userService, times(1)).findAll();
  }

  @Test
  void getUserById_WhenUserExists_ShouldReturnUser() throws Exception {
    // Mock service method
    when(userService.findById(1L)).thenReturn(Optional.of(testUser1));

    // Perform GET request and validate response
    mockMvc
        .perform(get("/users/1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", is(1)))
        .andExpect(jsonPath("$.name", is("Test User 1")))
        .andExpect(jsonPath("$.profilePicture", is("profile1.jpg")));

    // Verify service method was called
    verify(userService, times(1)).findById(1L);
  }

  @Test
  void getUserById_WhenUserDoesNotExist_ShouldReturnNotFound() throws Exception {
    // Mock service method
    when(userService.findById(99L)).thenReturn(Optional.empty());

    // Perform GET request and validate response
    mockMvc.perform(get("/users/99")).andExpect(status().isNotFound());

    // Verify service method was called
    verify(userService, times(1)).findById(99L);
  }

  @Test
  void createUser_ShouldReturnCreatedUser() throws Exception {
    // Mock service method
    when(userService.create(anyString(), anyString())).thenReturn(testUser1);

    // Perform POST request and validate response
    mockMvc
        .perform(
            post("/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Test User 1\",\"profilePicture\":\"profile1.jpg\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", is(1)))
        .andExpect(jsonPath("$.name", is("Test User 1")))
        .andExpect(jsonPath("$.profilePicture", is("profile1.jpg")));

    // Verify service method was called
    verify(userService, times(1)).create(eq("Test User 1"), eq("profile1.jpg"));
  }

  @Test
  void updateUser_WhenUserExists_ShouldReturnUpdatedUser() throws Exception {
    // Create updated user
    User updatedUser = new User();
    updatedUser.setId(1L);
    updatedUser.setName("Updated User");
    updatedUser.setProfilePicture("updated.jpg");

    // Mock service methods
    when(userService.findById(1L)).thenReturn(Optional.of(testUser1));
    when(userService.save(any(User.class))).thenReturn(updatedUser);

    // Perform PUT request and validate response
    mockMvc
        .perform(
            put("/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Updated User\",\"profilePicture\":\"updated.jpg\"}"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id", is(1)))
        .andExpect(jsonPath("$.name", is("Updated User")))
        .andExpect(jsonPath("$.profilePicture", is("updated.jpg")));

    // Verify service methods were called
    verify(userService, times(1)).findById(1L);
    verify(userService, times(1)).save(any(User.class));
  }

  @Test
  void updateUser_WhenUserDoesNotExist_ShouldReturnNotFound() throws Exception {
    // Mock service method
    when(userService.findById(99L)).thenReturn(Optional.empty());

    // Perform PUT request and validate response
    mockMvc
        .perform(
            put("/users/99")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Updated User\",\"profilePicture\":\"updated.jpg\"}"))
        .andExpect(status().isNotFound());

    // Verify service method was called
    verify(userService, times(1)).findById(99L);
    verify(userService, never()).save(any(User.class));
  }

  @Test
  void deleteUser_ShouldCallServiceMethod() throws Exception {
    // Perform DELETE request and validate response
    mockMvc.perform(delete("/users/1")).andExpect(status().isOk());

    // Verify service method was called
    verify(userService, times(1)).delete(1L);
  }
}
