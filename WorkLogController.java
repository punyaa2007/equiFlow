import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

/**
 * CRUD endpoints for WorkLogs — the actual hours a user reports spending
 * on a task. Combined with TaskController's estimated hours, this lets
 * Equiflow compare "planned" vs "actual" effort per team member.
 *
 * Endpoints:
 *   GET    /api/worklogs
 *   GET    /api/worklogs/{id}
 *   POST   /api/worklogs
 *   PUT    /api/worklogs/{id}
 *   DELETE /api/worklogs/{id}
 *   GET    /api/worklogs/summary
 */
@RestController
@RequestMapping("/api/worklogs")
public class WorkLogController {

    private final Map<Long, WorkLog> store = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    @GetMapping
    public Collection<WorkLog> getAllWorkLogs() {
        return store.values();
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkLog> getWorkLog(@PathVariable Long id) {
        WorkLog log = store.get(id);
        if (log == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(log);
    }

    @PostMapping
    public WorkLog createWorkLog(@RequestBody WorkLog workLog) {
        Long id = idCounter.getAndIncrement();
        workLog.setId(id);
        store.put(id, workLog);
        return workLog;
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkLog> updateWorkLog(@PathVariable Long id, @RequestBody WorkLog updated) {
        WorkLog existing = store.get(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        updated.setId(id);
        store.put(id, updated);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkLog(@PathVariable Long id) {
        if (store.remove(id) == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    /**
     * Returns total logged hours grouped by user id — the "actual work done"
     * counterpart to TaskController's estimated-hours workload view.
     */
    @GetMapping("/summary")
    public Map<Long, Double> getHoursSummaryByUser() {
        return store.values().stream()
                .filter(w -> w.getUser() != null && w.getHoursLogged() != null)
                .collect(Collectors.groupingBy(
                        w -> w.getUser().getId(),
                        Collectors.summingDouble(WorkLog::getHoursLogged)
                ));
    }
}
