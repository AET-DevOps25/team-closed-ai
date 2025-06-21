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
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Lob
    private String description;

    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.BACKLOG;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @ElementCollection
    @CollectionTable(name = "task_comments", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "comment")
    private List<String> comments = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "task_attachments", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "attachment")
    private List<String> attachments = new ArrayList<>();

    @ManyToOne()
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @ManyToOne(optional = false)
    @JoinColumn(name = "project_id")
    private Project project;

    public void addComment(String c) {
        comments.add(c);
    }

    public void addAttachment(String a) {
        attachments.add(a);
    }

}