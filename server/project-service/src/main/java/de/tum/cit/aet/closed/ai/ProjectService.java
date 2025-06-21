package de.tum.cit.aet.closed.ai;


import de.tum.cit.aet.closed.ai.client.UserServiceClient;
import de.tum.cit.aet.closed.ai.dto.CreateProjectDto;
import de.tum.cit.aet.closed.ai.dto.UserDto;
import de.tum.cit.aet.closed.ai.exception.ProjectNotFoundException;
import de.tum.cit.aet.closed.ai.exception.UserNotFoundException;
import de.tum.cit.aet.closed.ai.model.Project;
import de.tum.cit.aet.closed.ai.model.Task;
import de.tum.cit.aet.closed.ai.model.TaskStatus;
import de.tum.cit.aet.closed.ai.model.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final UserServiceClient userServiceClient;

    @Transactional(readOnly = true)
    public List<Project> findAll() {
        return projectRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Project> findById(Long id) {
        return projectRepository.findById(id);
    }

    @Transactional
    public Project save(Project project) {
        return projectRepository.save(project);
    }

    @Transactional
    public void delete(Long id) {
        if (projectRepository.findById(id).isEmpty()) {
            throw new ProjectNotFoundException("No project found with ID " + id);
        }
        projectRepository.deleteById(id);
    }

    @Transactional
    public Task createTask(Long projectId, String title, String desc, TaskStatus taskStatus, Long assigneeId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("No such project"));
        
        Task task = project.createTask(title, desc, taskStatus);
        
        if (assigneeId != null) {
            Optional<User> assignee = userServiceClient.findById(assigneeId)
                    .map(userDto -> {
                        User user = new User();
                        user.setId(userDto.id());
                        user.setName(userDto.name());
                        user.setProfilePicture(userDto.profilePicture());
                        return user;
                    });

            assignee.ifPresent(task::setAssignee);
        }

        return projectRepository.findById(projectId)
                .map(p -> p.getTasks().getLast())
                .orElseThrow(() -> new ProjectNotFoundException("No such project"));
    }

    @Transactional
    public Project createProject(String name, String color) {
        Project project = new Project();
        project.setName(name);
        project.setColor(color);
        return projectRepository.save(project);
    }
}
