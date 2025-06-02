package de.tum.cit.aet.closed.ai.server.persistence.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @OneToMany(
            mappedBy = "project",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Task> tasks = new ArrayList<>();

    // convenience
    public Task createTask(String title, String desc) {
        Task t = new Task();
        t.setTitle(title);
        t.setDescription(desc);
        t.setProject(this);
        tasks.add(t);
        return t;
    }
}
