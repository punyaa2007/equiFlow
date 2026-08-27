import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Represents an actual logged work entry: how many hours a User
 * spent on a Task, on a given date. Used to measure real workload
 * (vs. estimated) for fair distribution reporting.
 */
@Entity
@Table(name = "work_logs")
public class WorkLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private Double hoursLogged;

    private LocalDate date;

    private String notes;

    public WorkLog() {
    }

    public WorkLog(Task task, User user, Double hoursLogged, LocalDate date, String notes) {
        this.task = task;
        this.user = user;
        this.hoursLogged = hoursLogged;
        this.date = date;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Double getHoursLogged() {
        return hoursLogged;
    }

    public void setHoursLogged(Double hoursLogged) {
        this.hoursLogged = hoursLogged;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
