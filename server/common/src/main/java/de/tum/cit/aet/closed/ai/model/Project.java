package de.tum.cit.aet.closed.ai.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String color;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(
            fetch = FetchType.EAGER,
            mappedBy = "project",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Task> tasks = new ArrayList<>();

    // convenience
    public Task createTask(String title, String desc, TaskStatus taskStatus) {
        Task t = new Task();
        t.setTitle(title);
        t.setDescription(desc);
        t.setStatus(taskStatus);
        t.setProject(this);
        tasks.add(t);
        return t;
    }
}
