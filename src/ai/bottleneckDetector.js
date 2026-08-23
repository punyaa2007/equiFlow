/**
 * Member 2 - AI Analysis & Bottleneck Intelligence
 * Module: Bottleneck Detection & Intelligence Engine (bottleneckDetector.js)
 * 
 * Responsibility:
 * 1. Multi-factor scoring to detect team and task bottlenecks:
 *    Score = w1*(WorkloadOverload) + w2*(DownstreamDependents) + w3*(TaskComplexity) + w4*(HiddenWorkRatio)
 * 2. Identify the primary bottleneck task and affected team member.
 * 3. Quantify downstream blast radius and delay estimates.
 * 4. Generate explainable AI root-cause diagnosis.
 */

// Complexity multipliers
const COMPLEXITY_WEIGHTS = {
  'critical': 1.5,
  'high': 1.3,
  'medium': 1.0,
  'low': 0.7
};

/**
 * Evaluates all tasks and team workloads to identify active and potential bottlenecks.
 * @param {Array<Object>} analyzedWorkloads - Output from workloadEngine
 * @param {Object} dependencyGraph - Output from dependencyAnalyzer
 * @returns {Object} Comprehensive bottleneck intelligence report
 */
export function detectBottlenecks(analyzedWorkloads = [], dependencyGraph) {
  const workloadMap = new Map();
  analyzedWorkloads.forEach(w => {
    workloadMap.set(w.name, w);
    workloadMap.set(w.id, w);
  });

  const taskScores = [];

  dependencyGraph.tasks.forEach(task => {
    // Only analyze active/in-progress or pending tasks (completed tasks cannot cause future bottlenecks)
    const isCompleted = task.status === 'Completed' || task.status === 'completed';
    if (isCompleted) {
      taskScores.push({ task, score: 0, factors: {}, isBottleneck: false });
      return;
    }

    const assignedMemberName = task.assignedMember || task.owner || '';
    const memberWorkload = workloadMap.get(assignedMemberName) || {
      workloadPercentage: 100,
      actualHours: 10,
      assignedHours: 10,
      hiddenWorkHours: 0
    };

    // Factor 1: Workload Overload (0 to 1 scale, normalized around 100% capacity)
    // 100% -> 0.5, 120% -> 0.8, 140%+ -> 1.0
    const workloadRatio = memberWorkload.workloadPercentage / 100;
    const overloadFactor = Math.min(Math.max((workloadRatio - 0.7) / 0.6, 0), 1.0);

    // Factor 2: Downstream Blockers (0 to 1 scale based on blast radius)
    // 0 downstream -> 0, 1 -> 0.35, 2 -> 0.7, 3+ -> 1.0
    const downstreamCount = task.allDownstreamCount || task.directDownstreamCount || 0;
    const downstreamFactor = Math.min(downstreamCount / 3, 1.0);

    // Factor 3: Task Complexity
    const compKey = String(task.complexity || 'Medium').toLowerCase();
    const compWeight = COMPLEXITY_WEIGHTS[compKey] || 1.0;
    const complexityFactor = (compWeight - 0.7) / 0.8; // Normalized 0 to 1

    // Factor 4: Hidden Workload Friction (ratio of hidden to total work)
    const hiddenRatio = memberWorkload.actualHours > 0 
      ? memberWorkload.hiddenWorkHours / memberWorkload.actualHours 
      : 0;
    const hiddenWorkFactor = Math.min(hiddenRatio * 2, 1.0);

    // Composite Bottleneck Score (0 to 100)
    // Overload (40%) + Downstream Impact (35%) + Complexity (15%) + Hidden Work (10%)
    const rawScore = (
      (overloadFactor * 0.40) +
      (downstreamFactor * 0.35) +
      (complexityFactor * 0.15) +
      (hiddenWorkFactor * 0.10)
    ) * 100;

    const finalScore = Math.round(rawScore);

    taskScores.push({
      task,
      score: finalScore,
      member: memberWorkload,
      factors: {
        overloadFactor: Math.round(overloadFactor * 100),
        downstreamFactor: Math.round(downstreamFactor * 100),
        complexityFactor: Math.round(complexityFactor * 100),
        hiddenWorkFactor: Math.round(hiddenWorkFactor * 100),
        downstreamCount
      },
      isBottleneck: finalScore >= 60
    });
  });

  // Sort descending by score
  taskScores.sort((a, b) => b.score - a.score);

  const topCandidate = taskScores[0] || null;
  const isBottleneckActive = topCandidate && topCandidate.score >= 60;

  // Determine Risk Level
  let riskLevel = 'LOW';
  if (topCandidate) {
    if (topCandidate.score >= 80) riskLevel = 'HIGH';
    else if (topCandidate.score >= 60) riskLevel = 'HIGH';
    else if (topCandidate.score >= 40) riskLevel = 'MEDIUM';
  }

  // Identify affected member and reason
  const affectedMember = topCandidate && isBottleneckActive 
    ? (topCandidate.member.name || topCandidate.task.assignedMember) 
    : (analyzedWorkloads.find(w => w.workloadPercentage > 100)?.name || 'None');

  const affectedMemberWorkload = workloadMap.get(affectedMember)?.workloadPercentage || 100;
  const affectedHours = workloadMap.get(affectedMember)?.actualHours || 10;
  const assignedHours = workloadMap.get(affectedMember)?.assignedHours || 10;
  const hiddenHours = workloadMap.get(affectedMember)?.hiddenWorkHours || 0;

  // Compile affected / blocked downstream tasks
  const affectedTasks = [];
  if (topCandidate && isBottleneckActive) {
    const downstreamIds = topCandidate.task.allDownstreamIds || topCandidate.task.directDownstreamIds || [];
    downstreamIds.forEach((id, idx) => {
      const dTask = dependencyGraph.tasks.find(t => t.id === id);
      if (dTask) {
        affectedTasks.push({
          id: dTask.id,
          name: `${dTask.id}: ${dTask.name || dTask.title}`,
          status: dTask.computedStatus || dTask.status || 'Blocked',
          delayEstimate: idx === 0 ? '+2 days' : `Waiting on ${topCandidate.task.id || topCandidate.task.name}`
        });
      }
    });
  }

  // Generate explainable AI reason
  let reason = "All workflow pipelines are running within expected thresholds. No critical bottlenecks detected.";
  if (isBottleneckActive && topCandidate) {
    reason = `High workload (${affectedHours} actual hrs logged vs ${assignedHours} assigned hrs, including ${hiddenHours} hidden hrs) on ${affectedMember} combined with ${affectedTasks.length} critical downstream dependent tasks.`;
  }

  return {
    isBottleneckActive,
    riskLevel,
    affectedMember,
    workloadPercentage: affectedMemberWorkload,
    primaryBottleneckTask: topCandidate && isBottleneckActive ? topCandidate.task : null,
    bottleneckScore: topCandidate ? topCandidate.score : 0,
    reason,
    affectedTasks,
    allScoredTasks: taskScores
  };
}
