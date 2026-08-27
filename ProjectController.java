import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * CRUD endpoints for Projects.
 * Uses an in-memory store for now — swap in a JpaRepository<Project, Long>
 * once the persistence layer is added by the team.
 *
 * Endpoints:
 *   GET    /api/projects
 *   GET    /api/projects/{id}
 *   POST   /api/projects
 *   PUT    /api/projects/{id}
 *   DELETE /api/projects/{id}
 */
@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final Map<Long, Project> store = new ConcurrentHashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    @GetMapping
    public Collection<Project> getAllProjects() {
        return store.values();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProject(@PathVariable Long id) {
        Project project = store.get(id);
        if (project == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(project);
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        Long id = idCounter.getAndIncrement();
        project.setId(id);
        store.put(id, project);
        return project;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project updated) {
        Project existing = store.get(id);
        if (existing == null) {
            return ResponseEntity.notFound().build();
        }
        updated.setId(id);
        store.put(id, updated);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        if (store.remove(id) == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
