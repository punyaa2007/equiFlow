/**
 * Member 2 - AI Analysis & Bottleneck Intelligence
 * Module: Task Dependency & Critical Path Analyzer (dependencyAnalyzer.js)
 * 
 * Responsibility:
 * 1. Parse task dependencies and build Directed Acyclic Graph (DAG).
 * 2. Calculate in-degrees (prerequisites) and out-degrees (downstream blockers).
 * 3. Identify blocked tasks whose prerequisites are incomplete.
 * 4. Determine critical path and downstream blast radius for every task.
 * 5. Format graph nodes & edges directly for Member 3's DependencyGraph component.
 */

/**
 * Normalizes dependency specifications from either:
 * - task.dependencies: ["TASK-1", "TASK-2"]
 * - explicit dependencies table: [{ from: "TASK-1", to: "TASK-2" }, ...]
 */
export function buildDependencyGraph(tasks = [], rawDependencies = []) {
  const taskMap = new Map();
  tasks.forEach(t => {
    const id = t.id || t.taskId;
    taskMap.set(id, {
      ...t,
      id,
      dependencies: Array.isArray(t.dependencies) ? [...t.dependencies] : []
    });
  });

  // Integrate explicit dependencies if provided
  rawDependencies.forEach(dep => {
    const fromId = dep.from || dep.source || dep.upstream_task_id;
    const toId = dep.to || dep.target || dep.downstream_task_id;
    if (taskMap.has(toId)) {
      const t = taskMap.get(toId);
      if (!t.dependencies.includes(fromId)) {
        t.dependencies.push(fromId);
      }
    }
  });

  // Build Adjacency Lists
  // outgoingEdges: Task -> List of tasks that depend on it (downstream dependents)
  // incomingEdges: Task -> List of tasks it depends on (prerequisites)
  const outgoing = new Map();
  const incoming = new Map();

  tasks.forEach(t => {
    const id = t.id || t.taskId;
    outgoing.set(id, []);
    incoming.set(id, []);
  });

  taskMap.forEach((task, id) => {
    task.dependencies.forEach(prereqId => {
      if (outgoing.has(prereqId)) {
        outgoing.get(prereqId).push(id);
      }
      if (incoming.has(id)) {
        incoming.get(id).push(prereqId);
      }
    });
  });

  // Calculate transitive downstream blast radius for each task (DFS/BFS)
  const downstreamBlastRadius = new Map();
  tasks.forEach(t => {
    const id = t.id || t.taskId;
    const visited = new Set();
    const queue = [...(outgoing.get(id) || [])];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!visited.has(current)) {
        visited.add(current);
        const next = outgoing.get(current) || [];
        next.forEach(n => {
          if (!visited.has(n)) queue.push(n);
        });
      }
    }
    downstreamBlastRadius.set(id, Array.from(visited));
  });

  // Determine blocked tasks based on status of prerequisites
  const analyzedTasks = tasks.map(t => {
    const id = t.id || t.taskId;
    const prereqs = incoming.get(id) || [];
    const directDownstream = outgoing.get(id) || [];
    const allDownstream = downstreamBlastRadius.get(id) || [];

    const isPrereqsComplete = prereqs.every(pId => {
      const pTask = taskMap.get(pId);
      return pTask && (pTask.status === 'Completed' || pTask.status === 'completed');
    });

    let computedStatus = t.status || 'Pending';
    if (computedStatus !== 'Completed' && computedStatus !== 'completed') {
      if (!isPrereqsComplete && prereqs.length > 0) {
        computedStatus = 'Blocked';
      }
    }

    return {
      ...t,
      id,
      computedStatus,
      prerequisites: prereqs,
      directDownstreamCount: directDownstream.length,
      directDownstreamIds: directDownstream,
      allDownstreamCount: allDownstream.length,
      allDownstreamIds: allDownstream,
      isBlocked: computedStatus === 'Blocked' || computedStatus === 'blocked'
    };
  });

  // Build edges list for Member 3
  const edges = [];
  outgoing.forEach((downstreamList, fromId) => {
    downstreamList.forEach(toId => {
      edges.push({ from: fromId, to: toId });
    });
  });

  return {
    tasks: analyzedTasks,
    edges,
    outgoing,
    incoming,
    downstreamBlastRadius
  };
}
