package de.tum.cit.aet.closed.ai;

import de.tum.cit.aet.closed.ai.model.Project;
import de.tum.cit.aet.closed.ai.model.Task;
import de.tum.cit.aet.closed.ai.model.TaskStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class ProjectControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProjectService projectService;

    @InjectMocks
    private ProjectController projectController;

    private Project testProject1;
    private Project testProject2;
    private List<Project> projectList;
    private Task testTask;
    private Task testTaskWithOpenStatus;

    @BeforeEach
    void setUp() {
        // Set up MockMvc
        mockMvc = MockMvcBuilders.standaloneSetup(projectController)
                .build();

        // Create test projects
        testProject1 = new Project();
        testProject1.setId(1L);
        testProject1.setName("Test Project 1");
        testProject1.setColor("#3070B3");
        testProject1.setTasks(new ArrayList<>());

        testProject2 = new Project();
        testProject2.setId(2L);
        testProject2.setName("Test Project 2");
        testProject2.setTasks(new ArrayList<>());

        // Create test task
        testTask = new Task();
        testTask.setId(1L);
        testTask.setTitle("Test Task");
        testTask.setDescription("Test Description");
        testTask.setProject(testProject1);
        testProject1.getTasks().add(testTask);

        // Create test task with OPEN status
        testTaskWithOpenStatus = new Task();
        testTaskWithOpenStatus.setId(1L);
        testTaskWithOpenStatus.setTitle("Test Task");
        testTaskWithOpenStatus.setDescription("Test Description");
        testTaskWithOpenStatus.setStatus(TaskStatus.OPEN);
        testTaskWithOpenStatus.setProject(testProject1);

        projectList = Arrays.asList(testProject1, testProject2);
    }

    @Test
    void getAllProjects_ShouldReturnAllProjects() throws Exception {
        // Mock service method
        when(projectService.findAll()).thenReturn(projectList);

        // Perform GET request and validate response
        mockMvc.perform(get("/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].name", is("Test Project 1")))
                .andExpect(jsonPath("$[0].taskIds", hasSize(1)))
                .andExpect(jsonPath("$[0].taskIds[0]", is(1)))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].name", is("Test Project 2")))
                .andExpect(jsonPath("$[1].taskIds", hasSize(0)));

        // Verify service method was called
        verify(projectService, times(1)).findAll();
    }

    @Test
    void getProjectById_WhenProjectExists_ShouldReturnProject() throws Exception {
        // Mock service method
        when(projectService.findById(1L)).thenReturn(Optional.of(testProject1));

        // Perform GET request and validate response
        mockMvc.perform(get("/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Test Project 1")))
                .andExpect(jsonPath("$.taskIds", hasSize(1)))
                .andExpect(jsonPath("$.taskIds[0]", is(1)));

        // Verify service method was called
        verify(projectService, times(1)).findById(1L);
    }

    @Test
    void getProjectById_WhenProjectDoesNotExist_ShouldReturnNotFound() throws Exception {
        // Mock service method
        when(projectService.findById(99L)).thenReturn(Optional.empty());

        // Perform GET request and validate response
        mockMvc.perform(get("/projects/99"))
                .andExpect(status().isNotFound());

        // Verify service method was called
        verify(projectService, times(1)).findById(99L);
    }

    @Test
    void createProject_ShouldReturnCreatedProject() throws Exception {
        // Mock service method
        when(projectService.createProject(anyString(), anyString())).thenReturn(testProject1);

        // Perform POST request and validate response
        mockMvc.perform(post("/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Test Project 1\",\"color\":\"#3070B3\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Test Project 1")))
                .andExpect(jsonPath("$.color", is("#3070B3")))
                .andExpect(jsonPath("$.taskIds", hasSize(1)));

        // Verify service method was called
        verify(projectService, times(1)).createProject("Test Project 1", "#3070B3");
    }

    @Test
    void updateProject_WhenProjectExists_ShouldReturnUpdatedProject() throws Exception {
        // Create updated project
        Project updatedProject = new Project();
        updatedProject.setId(1L);
        updatedProject.setName("Updated Project");
        updatedProject.setTasks(new ArrayList<>());

        // Mock service methods
        when(projectService.findById(1L)).thenReturn(Optional.of(testProject1));
        when(projectService.save(any(Project.class))).thenReturn(updatedProject);

        // Perform PUT request and validate response
        mockMvc.perform(put("/projects/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":1,\"name\":\"Updated Project\",\"taskIds\":[]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.name", is("Updated Project")))
                .andExpect(jsonPath("$.taskIds", hasSize(0)));

        // Verify service methods were called
        verify(projectService, times(1)).findById(1L);
        verify(projectService, times(1)).save(any(Project.class));
    }

    @Test
    void updateProject_WhenProjectDoesNotExist_ShouldReturnNotFound() throws Exception {
        // Mock service method
        when(projectService.findById(99L)).thenReturn(Optional.empty());

        // Perform PUT request and validate response
        mockMvc.perform(put("/projects/99")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"id\":99,\"name\":\"Updated Project\",\"taskIds\":[]}"))
                .andExpect(status().isNotFound());

        // Verify service method was called
        verify(projectService, times(1)).findById(99L);
        verify(projectService, never()).save(any(Project.class));
    }

    @Test
    void deleteProject_ShouldCallServiceMethod() throws Exception {
        // Perform DELETE request and validate response
        mockMvc.perform(delete("/projects/1"))
                .andExpect(status().isOk());

        // Verify service method was called
        verify(projectService, times(1)).delete(1L);
    }

    @Test
    void addTasks_WhenProjectExists_ShouldReturnCreatedTasks() throws Exception {
        when(projectService.createTask(eq(1L), eq("Test Task"), eq("Test Description"), eq(TaskStatus.BACKLOG), eq(null))).thenReturn(testTask);
        when(projectService.createTask(eq(1L), eq("Test Task"), eq("Test Description"), eq(TaskStatus.OPEN), eq(2L))).thenReturn(testTaskWithOpenStatus);

        // Perform POST request and validate response
        mockMvc.perform(post("/projects/1/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[" +
                                "{\"title\":\"Test Task\",\"description\":\"Test Description\",\"taskStatus\":\"BACKLOG\"}," +
                                "{\"title\":\"Test Task\",\"description\":\"Test Description\",\"taskStatus\":\"OPEN\",\"assigneeId\":2}" +
                                "]"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].title", is("Test Task")))
                .andExpect(jsonPath("$[0].description", is("Test Description")))
                .andExpect(jsonPath("$[0].taskStatus", is("BACKLOG")))
                .andExpect(jsonPath("$[1].id", is(1)))
                .andExpect(jsonPath("$[1].title", is("Test Task")))
                .andExpect(jsonPath("$[1].description", is("Test Description")))
                .andExpect(jsonPath("$[1].taskStatus", is("OPEN")));

        verify(projectService, times(1)).createTask(eq(1L), eq("Test Task"), eq("Test Description"), eq(TaskStatus.BACKLOG), eq(null));
        verify(projectService, times(1)).createTask(eq(1L), eq("Test Task"), eq("Test Description"), eq(TaskStatus.OPEN), eq(2L));
    }

    @Test
    void addTasks_WhenAddingSingleTask_ShouldReturnCreatedTask() throws Exception {
        when(projectService.createTask(eq(1L), eq("Test Task"), eq("Test Description"), eq(TaskStatus.BACKLOG), eq(2L))).thenReturn(testTask);

        mockMvc.perform(post("/projects/1/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("[" +
                                "{\"title\":\"Test Task\",\"description\":\"Test Description\",\"taskStatus\":\"BACKLOG\",\"assigneeId\":2}" +
                                "]"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].title", is("Test Task")))
                .andExpect(jsonPath("$[0].description", is("Test Description")))
                .andExpect(jsonPath("$[0].taskStatus", is("BACKLOG")));

        verify(projectService, times(1)).createTask(eq(1L), eq("Test Task"), eq("Test Description"), eq(TaskStatus.BACKLOG), eq(2L));
    }
}