import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Represents a single unit of work within a Project.
 * Assigned to one User. Used to calculate workload distribution.
 */
@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    // "TODO", "IN_PROGRESS", "DONE", "BLOCKED"
    private String status;

    // Estimated effort — used for equal-distribution calculations
    private Double estimatedHours;

    private LocalDate deadline;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "assigned_user_id")
    private User assignedUser;

    public Task() {
    }

    public Task(String title, String description, String status, Double estimatedHours,
                LocalDate deadline, Project project, User assignedUser) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.estimatedHours = estimatedHours;
        this.deadline = deadline;
        this.project = project;
        this.assignedUser = assignedUser;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getEstimatedHours() {
        return estimatedHours;
    }

    public void setEstimatedHours(Double estimatedHours) {
        this.estimatedHours = estimatedHours;
    }

    public LocalDate getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDate deadline) {
        this.deadline = deadline;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public User getAssignedUser() {
        return assignedUser;
    }

    public void setAssignedUser(User assignedUser) {
        this.assignedUser = assignedUser;
    }
}
