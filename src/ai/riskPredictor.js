/**
 * Member 2 - AI Analysis & Bottleneck Intelligence
 * Module: Project Risk & Health Prediction Engine (riskPredictor.js)
 * 
 * Responsibility:
 * 1. Predict Project Delay Risk (0 - 100%).
 * 2. Calculate Project Health Score (0 - 100%) and Health Status Tag.
 * 3. Quantify Overload Risk and Workload Imbalance Coefficient.
 */

/**
 * Predicts project risk and overall health metrics.
 * @param {Array<Object>} analyzedWorkloads - Output from workloadEngine
 * @param {Object} bottleneckReport - Output from bottleneckDetector
 * @param {Object} dependencyGraph - Output from dependencyAnalyzer
 * @returns {Object} Comprehensive risk and project health assessment
 */
export function predictProjectRisks(analyzedWorkloads = [], bottleneckReport, dependencyGraph) {
  // 1. Calculate Overload Risk (Team-level imbalance)
  const overloadedMembers = analyzedWorkloads.filter(w => w.workloadPercentage > 100);
  const maxWorkload = Math.max(...analyzedWorkloads.map(w => w.workloadPercentage), 100);
  const totalHiddenHours = analyzedWorkloads.reduce((sum, w) => sum + (w.hiddenWorkHours || 0), 0);

  // 2. Calculate Blocked Tasks Ratio
  const totalActiveTasks = dependencyGraph.tasks.filter(t => t.status !== 'Completed' && t.status !== 'completed').length;
  const blockedTasks = dependencyGraph.tasks.filter(t => t.isBlocked).length;
  const blockedRatio = totalActiveTasks > 0 ? blockedTasks / totalActiveTasks : 0;

  // 3. Delay Risk Model (0 to 100%)
  // Formulated as combination of Bottleneck Score (50%), Blocked Ratio (30%), and Overload Severity (20%)
  let delayRisk = 20; // baseline risk
  if (bottleneckReport.isBottleneckActive) {
    const bottleneckComponent = (bottleneckReport.bottleneckScore || 70) * 0.50;
    const blockedComponent = (blockedRatio * 100) * 0.30;
    const overloadComponent = Math.min((maxWorkload - 100) * 1.5, 30) * 0.20;
    delayRisk = Math.min(Math.round(bottleneckComponent + blockedComponent + overloadComponent + 15), 98);
  } else {
    // Healthy or moderate project
    delayRisk = Math.min(Math.round((maxWorkload / 100) * 25 + (blockedRatio * 30)), 45);
  }

  // 4. Project Health Score (100 - Delay Risk & Overload penalties)
  // Higher is better: 100 = Perfect Health, <60 = Critical
  let healthScore = Math.max(100 - Math.round(delayRisk * 0.7 + (overloadedMembers.length * 10)), 35);
  healthScore = Math.min(Math.max(healthScore, 10), 100);

  // Health status categorization
  let projectHealth = 'Excellent';
  if (healthScore < 50 || delayRisk > 75) {
    projectHealth = 'Critical Risk';
  } else if (healthScore < 70 || delayRisk > 60) {
    projectHealth = 'At Risk';
  } else if (healthScore < 85 || delayRisk > 40) {
    projectHealth = 'Needs Attention';
  } else if (healthScore < 95) {
    projectHealth = 'Good';
  }

  return {
    delayRisk,
    bottleneckRisk: bottleneckReport.riskLevel || 'LOW',
    overloadRisk: overloadedMembers.length > 0 ? 'HIGH' : 'LOW',
    projectHealth,
    projectHealthScore: healthScore,
    totalHiddenHours: Math.round(totalHiddenHours * 10) / 10,
    blockedTasksCount: blockedTasks,
    totalActiveTasksCount: totalActiveTasks
  };
}
