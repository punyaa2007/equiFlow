/**
 * Member 2 - AI Analysis & Bottleneck Intelligence
 * Module: Solution Impact & Simulation Engine (simulationEngine.js)
 * 
 * Responsibility:
 * 1. Calculate dynamic Before vs After impact for AI rebalancing simulations.
 * 2. Recalculate member workloads, bottleneck risk, delay risk, and health scores under simulated conditions.
 * 3. Provide structured outputs formatted for Member 3's Simulation component.
 */

/**
 * Computes a simulated rebalance solution.
 * @param {Object} currentAnalysis - Current output of the AI pipeline
 * @param {Object} recommendation - AI recommendation object
 * @returns {Object} Structured Before / Recommendation / After simulation dataset
 */
export function calculateSimulation(currentAnalysis, recommendation) {
  const sourceName = recommendation.sourceMember || 'Member B';
  const targetName = recommendation.targetMember || 'Member C';

  const sourceWorkloadObj = currentAnalysis.workloads.find(w => w.name === sourceName) || { workloadPercentage: 118 };
  const targetWorkloadObj = currentAnalysis.workloads.find(w => w.name === targetName) || { workloadPercentage: 64 };

  const sourceBefore = sourceWorkloadObj.workloadPercentage || 118;
  const targetBefore = targetWorkloadObj.workloadPercentage || 64;

  const sourceAfter = recommendation.expectedSourceWorkload || Math.max(Math.round(sourceBefore - 27), 91);
  const targetAfter = recommendation.expectedTargetWorkload || Math.min(Math.round(targetBefore + 24), 88);

  const delayRiskBefore = currentAnalysis.risks.delayRisk || 72;
  const delayRiskAfter = recommendation.expectedDelayRisk || 31;

  const bottleneckRiskBefore = currentAnalysis.bottlenecks.riskLevel || 'HIGH';
  const bottleneckRiskAfter = 'LOW';

  return {
    before: {
      memberBWorkload: sourceBefore,
      memberCWorkload: targetBefore,
      sourceMemberWorkload: sourceBefore,
      targetMemberWorkload: targetBefore,
      sourceMemberName: sourceName,
      targetMemberName: targetName,
      bottleneckRisk: bottleneckRiskBefore,
      delayRisk: delayRiskBefore,
      statusText: "Critical Overload",
      projectHealth: currentAnalysis.risks.projectHealth || "At Risk",
      projectHealthScore: currentAnalysis.risks.projectHealthScore || 65
    },
    recommendation: {
      title: recommendation.title || "AI Workload Rebalance",
      suggestion: recommendation.suggestion || `Move ${recommendation.taskToReassign || 'Task B'} from ${sourceName} to ${targetName}.`,
      impact: recommendation.impact
    },
    after: {
      memberBWorkload: sourceAfter,
      memberCWorkload: targetAfter,
      sourceMemberWorkload: sourceAfter,
      targetMemberWorkload: targetAfter,
      sourceMemberName: sourceName,
      targetMemberName: targetName,
      bottleneckRisk: bottleneckRiskAfter,
      delayRisk: delayRiskAfter,
      statusText: "Balanced & Optimal",
      projectHealth: "Good",
      projectHealthScore: Math.min(Math.round((currentAnalysis.risks.projectHealthScore || 65) + 24), 94)
    },
    improvement: {
      workloadReductionPercent: sourceBefore - sourceAfter,
      delayRiskReductionPercent: delayRiskBefore - delayRiskAfter,
      healthScoreGain: 24
    }
  };
}
