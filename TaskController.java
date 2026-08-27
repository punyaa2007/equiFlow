import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * CRUD endpoints for Tasks, plus a workload-distribution helper endpoint
 * that sums estimated hours per assigned user — this is the core of
 * Equiflow's "equal distribution" feature.
 *
 * Endpoints:
 *   GET    /api/tasks
 *   GET    /api/tasks/{id}
 *   POST   /api/tasks
 *   PUT    /api/tasks/{id}
 *   DELETE /api/tasks/{id}
 *   PATCH  /api/tasks/{id}/assign/{userId}
 *   GET    /api/tasks/workload
 */
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final Map<Long, Task> store = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    @GetMapping
    public Collection<Task> getAllTasks() {
        return store.values();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTask(@PathVariable Long id) {
        Task task = store.get(id);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(task);
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        Long id = idCounter.getAndIncrement();
        task.setId(id);
        if (task.getStatus() == null) {
            task.setStatus("TODO");
        }
        store.put(id, task);
        return task;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task updated) {
        Task existing = store.get(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        updated.setId(id);
        store.put(id, updated);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        if (store.remove(id) == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    /**
     * Reassign a task to a different user.
     */
    @PatchMapping("/{id}/assign/{userId}")
    public ResponseEntity<Task> assignTask(@PathVariable Long id, @PathVariable Long userId) {
        Task task = store.get(id);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        User user = new User();
        user.setId(userId);
        task.setAssignedUser(user);
        return ResponseEntity.ok(task);
    }

    /**
     * Returns total estimated hours grouped by assigned user's id.
     * Useful for spotting workload imbalance across team members.
     */
    @GetMapping("/workload")
    public Map<Long, Double> getWorkloadByUser() {
        return store.values().stream()
                .filter(t -> t.getAssignedUser() != null && t.getEstimatedHours() != null)
                .collect(Collectors.groupingBy(
                        t -> t.getAssignedUser().getId(),
                        Collectors.summingDouble(Task::getEstimatedHours)
                ));
    }
}
