package de.tum.cit.aet.closed.ai;


import de.tum.cit.aet.closed.ai.client.ProjectServiceClient;
import de.tum.cit.aet.closed.ai.client.UserServiceClient;
import de.tum.cit.aet.closed.ai.dto.ProjectDto;
import de.tum.cit.aet.closed.ai.dto.TaskDto;
import de.tum.cit.aet.closed.ai.dto.UserDto;
import de.tum.cit.aet.closed.ai.model.Project;
import de.tum.cit.aet.closed.ai.model.Task;
import de.tum.cit.aet.closed.ai.model.TaskStatus;
import de.tum.cit.aet.closed.ai.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class TaskControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TaskService taskService;

    @Mock
    private UserServiceClient userServiceClient;

    @Mock
    private ProjectServiceClient projectServiceClient;

    @InjectMocks
    private TaskController taskController;

    private Task testTask1;
    private Task testTask2;
    private User testUser;
    private User testUser2;
    private Project testProject;
    private List<Task> taskList;

    @BeforeEach
    void setUp() {
        // Set up MockMvc
        mockMvc = MockMvcBuilders.standaloneSetup(taskController)
                .build();

        // Create test users
        testUser = new User();
        testUser.setId(1L);
        testUser.setName("Test User");
        testUser.setProfilePicture("profile.jpg");

        testUser2 = new User();
        testUser2.setId(2L);
        testUser2.setName("Test User 2");
        testUser2.setProfilePicture("profile2.jpg");

        // Create test project
        testProject = new Project();
        testProject.setId(1L);
        testProject.setName("Test Project");

        // Create test tasks
        testTask1 = new Task();
        testTask1.setId(1L);
        testTask1.setTitle("Test Task 1");
        testTask1.setDescription("Description 1");
        testTask1.setStatus(TaskStatus.OPEN);
        testTask1.setComments(Collections.singletonList("Comment 1"));
        testTask1.setAttachments(Collections.singletonList("Attachment 1"));
        testTask1.setAssignee(testUser);
        testTask1.setProject(testProject);

        testTask2 = new Task();
        testTask2.setId(2L);
        testTask2.setTitle("Test Task 2");
        testTask2.setDescription("Description 2");
        testTask2.setStatus(TaskStatus.IN_PROGRESS);
        testTask2.setComments(Collections.singletonList("Comment 2"));
        testTask2.setAttachments(Collections.singletonList("Attachment 2"));
        testTask2.setAssignee(testUser);
        testTask2.setProject(testProject);

        taskList = Arrays.asList(testTask1, testTask2);
    }

    @Test
    void getAllTasks_ShouldReturnAllTasks() throws Exception {
        // Mock service method
        when(taskService.findAll()).thenReturn(taskList);

        // Perform GET request and validate response
        mockMvc.perform(get("/tasks"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].title", is("Test Task 1")))
                .andExpect(jsonPath("$[0].description", is("Description 1")))
                .andExpect(jsonPath("$[0].taskStatus", is("OPEN")))
                .andExpect(jsonPath("$[0].assigneeId", is(1)))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].title", is("Test Task 2")))
                .andExpect(jsonPath("$[1].description", is("Description 2")))
                .andExpect(jsonPath("$[1].taskStatus", is("IN_PROGRESS")))
                .andExpect(jsonPath("$[1].assigneeId", is(1)));

        // Verify service method was called
        verify(taskService, times(1)).findAll();
    }

    @Test
    void getTaskById_WhenTaskExists_ShouldReturnTask() throws Exception {
        // Mock service method
        when(taskService.findById(1L)).thenReturn(Optional.of(testTask1));

        // Perform GET request and validate response
        mockMvc.perform(get("/tasks/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Test Task 1")))
                .andExpect(jsonPath("$.description", is("Description 1")))
                .andExpect(jsonPath("$.taskStatus", is("OPEN")))
                .andExpect(jsonPath("$.assigneeId", is(1)));

        // Verify service method was called
        verify(taskService, times(1)).findById(1L);
    }

    @Test
    void getTaskById_WhenTaskDoesNotExist_ShouldReturnNotFound() throws Exception {
        // Mock service method
        when(taskService.findById(99L)).thenReturn(Optional.empty());

        // Perform GET request and validate response
        mockMvc.perform(get("/tasks/99"))
                .andExpect(status().isNotFound());

        // Verify service method was called
        verify(taskService, times(1)).findById(99L);
    }

    @Test
    void updateTask_WhenTaskExists_ShouldReturnUpdatedTask() throws Exception {
        // Mock service methods
        when(taskService.findById(1L)).thenReturn(Optional.of(testTask1));
        when(userServiceClient.findById(2L)).thenReturn(Optional.of(UserDto.fromUser(testUser2)));
        when(taskService.save(any(Task.class))).thenReturn(testTask1);

        // Perform PUT request and validate response
        mockMvc.perform(put("/tasks/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":1,\"title\":\"Updated Task\",\"description\":\"Updated Description\",\"taskStatus\":\"IN_PROGRESS\",\"comments\":[\"Comment 1\"],\"attachments\":[\"Attachment 1\"],\"assigneeId\":2}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Updated Task")))
                .andExpect(jsonPath("$.description", is("Updated Description")))
                .andExpect(jsonPath("$.taskStatus", is("IN_PROGRESS")))
                .andExpect(jsonPath("$.assigneeId", is(2)));

        // Verify service methods were called
        verify(taskService, times(1)).findById(1L);
        verify(taskService, times(1)).save(any(Task.class));
    }

    @Test
    void updateTask_WhenTaskDoesNotExist_ShouldReturnNotFound() throws Exception {
        // Mock service method
        when(taskService.findById(99L)).thenReturn(Optional.empty());

        // Perform PUT request and validate response
        mockMvc.perform(put("/tasks/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":99,\"title\":\"Updated Task\",\"description\":\"Updated Description\",\"taskStatus\":\"IN_PROGRESS\",\"comments\":[\"Comment 1\"],\"attachments\":[\"Attachment 1\"],\"assigneeId\":1}"))
                .andExpect(status().isNotFound());

        // Verify service method was called
        verify(taskService, times(1)).findById(99L);
        verify(taskService, never()).save(any(Task.class));
    }

    @Test
    void deleteTask_WhenTaskExists_ShouldCallServiceMethod() throws Exception {
        // Mock service method
        when(taskService.findById(1L)).thenReturn(Optional.of(testTask1));

        // Perform DELETE request and validate response
        mockMvc.perform(delete("/tasks/1"))
                .andExpect(status().isOk());

        // Verify service methods were called
        verify(taskService, times(1)).findById(1L);
        verify(taskService, times(1)).delete(1L);
    }

    @Test
    void deleteTask_WhenTaskDoesNotExist_ShouldReturnNotFound() throws Exception {
        // Mock service method
        when(taskService.findById(99L)).thenReturn(Optional.empty());

        // Perform DELETE request and validate response
        mockMvc.perform(delete("/tasks/99"))
                .andExpect(status().isNotFound());

        // Verify service methods were called
        verify(taskService, times(1)).findById(99L);
        verify(taskService, never()).delete(anyLong());
    }

    @Test
    void changeStatus_ShouldUpdateTaskStatus() throws Exception {
        // Mock service method
        Task updatedTask = new Task();
        updatedTask.setId(1L);
        updatedTask.setTitle("Test Task 1");
        updatedTask.setDescription("Description 1");
        updatedTask.setStatus(TaskStatus.DONE);
        updatedTask.setAssignee(testUser);
        updatedTask.setProject(testProject);

        when(taskService.setStatus(1L, TaskStatus.DONE)).thenReturn(updatedTask);

        // Perform PATCH request and validate response
        mockMvc.perform(patch("/tasks/1/status")
                        .param("status", "DONE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.title", is("Test Task 1")))
                .andExpect(jsonPath("$.description", is("Description 1")))
                .andExpect(jsonPath("$.taskStatus", is("DONE")))
                .andExpect(jsonPath("$.assigneeId", is(1)));

        // Verify service method was called
        verify(taskService, times(1)).setStatus(1L, TaskStatus.DONE);
    }

    @Test
    void getTasksByAssignee_WhenUserExists_ShouldReturnTasks() throws Exception {
        // Mock service methods
        when(userServiceClient.findById(1L)).thenReturn(Optional.of(UserDto.fromUser(testUser)));
        when(taskService.findByAssignee(1L)).thenReturn(taskList);

        // Perform GET request and validate response
        mockMvc.perform(get("/tasks/by-assignee/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].title", is("Test Task 1")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].title", is("Test Task 2")));

        // Verify service methods were called
        verify(userServiceClient, times(1)).findById(1L);
        verify(taskService, times(1)).findByAssignee(1L);
    }

    @Test
    void getTasksByAssignee_WhenUserDoesNotExist_ShouldReturnNotFound() throws Exception {
        // Mock service method
        when(userServiceClient.findById(99L)).thenReturn(Optional.empty());

        // Perform GET request and validate response
        mockMvc.perform(get("/tasks/by-assignee/99"))
                .andExpect(status().isNotFound());

        // Verify service method was called
        verify(userServiceClient, times(1)).findById(99L);
        verify(taskService, never()).findByAssignee(anyLong());
    }

    @Test
    void getTasksByProject_WhenProjectExists_ShouldReturnTasks() throws Exception {
        // Mock service methods
        when(projectServiceClient.findById(1L)).thenReturn(Optional.of(ProjectDto.fromProject(testProject)));
        when(taskService.findByProject(1L)).thenReturn(taskList);

        // Perform GET request and validate response
        mockMvc.perform(get("/tasks/by-project/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].title", is("Test Task 1")))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].title", is("Test Task 2")));

        // Verify service methods were called
        verify(projectServiceClient, times(1)).findById(1L);
        verify(taskService, times(1)).findByProject(1L);
    }

    @Test
    void getTasksByProject_WhenProjectDoesNotExist_ShouldReturnNotFound() throws Exception {
        // Mock service method
        when(projectServiceClient.findById(99L)).thenReturn(Optional.empty());

        // Perform GET request and validate response
        mockMvc.perform(get("/tasks/by-project/99"))
                .andExpect(status().isNotFound());

        // Verify service method was called
        verify(projectServiceClient, times(1)).findById(99L);
        verify(taskService, never()).findByProject(anyLong());
    }
}