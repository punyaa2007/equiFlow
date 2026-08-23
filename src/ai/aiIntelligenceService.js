/**
 * Member 2 - AI Analysis & Bottleneck Intelligence
 * Module: Central AI Intelligence Pipeline (aiIntelligenceService.js)
 * 
 * Responsibility:
 * Central orchestrator connecting all Member 2 analytical engines:
 * Data Preprocessing -> Workload & Hidden Work Calculation -> Dependency Analysis ->
 * Bottleneck Detection -> Risk Prediction -> Recommendation Generation -> Simulation.
 */

import { calculateTeamWorkload } from './workloadEngine.js';
import { buildDependencyGraph } from './dependencyAnalyzer.js';
import { detectBottlenecks } from './bottleneckDetector.js';
import { predictProjectRisks } from './riskPredictor.js';
import { generateRecommendation } from './recommendationEngine.js';
import { calculateSimulation } from './simulationEngine.js';
import { mockProject } from './dataset.js';

export class AIIntelligenceService {
  constructor(initialData = mockProject) {
    this.projectData = initialData;
    this.currentAnalysis = null;
    this.runFullAnalysis();
  }

  /**
   * Updates or feeds new project data (from Member 1's APIs or user input).
   */
  updateProjectData(newProjectData) {
    this.projectData = {
      ...this.projectData,
      ...newProjectData
    };
    return this.runFullAnalysis();
  }

  /**
   * Executes the complete Member 2 AI Analysis Pipeline.
   */
  runFullAnalysis() {
    const { members = [], tasks = [], dependencies = [], workLogs = [] } = this.projectData;

    // Step 1: Workload & Hidden Workload Analysis
    const workloads = calculateTeamWorkload(members, tasks, workLogs);

    // Step 2: Task Dependency & Critical Path Analysis
    const dependencyGraph = buildDependencyGraph(tasks, dependencies);

    // Step 3: Bottleneck Detection & Scoring
    const bottlenecks = detectBottlenecks(workloads, dependencyGraph);

    // Step 4: Risk & Project Health Prediction
    const risks = predictProjectRisks(workloads, bottlenecks, dependencyGraph);

    // Step 5: AI Recommendation Generation
    const recommendation = generateRecommendation(bottlenecks, workloads, risks);

    // Step 6: Solution Impact & What-If Simulation
    const rawAnalysis = {
      project: this.projectData,
      workloads,
      dependencyGraph,
      bottlenecks,
      risks,
      recommendation
    };

    const simulation = calculateSimulation(rawAnalysis, recommendation);

    this.currentAnalysis = {
      ...rawAnalysis,
      simulation
    };

    return this.currentAnalysis;
  }

  // --- Member 3 Export Contracts ---

  getDashboardSummary() {
    if (!this.currentAnalysis) this.runFullAnalysis();
    const { risks, project, recommendation } = this.currentAnalysis;

    const completedTasks = project.tasks.filter(t => t.status === 'Completed' || t.status === 'completed').length;
    const activeTasks = project.tasks.length - completedTasks;

    return {
      projectName: project.name || "EquiFlow Core",
      projectHealth: risks.projectHealth || "Needs Attention",
      projectHealthScore: risks.projectHealthScore || 78,
      overallProgress: project.progress || 42,
      bottleneckRisk: risks.bottleneckRisk || "HIGH",
      delayRisk: risks.delayRisk || 72,
      hiddenWorkHours: risks.totalHiddenHours || 5,
      aiRecommendation: `${recommendation.details} ${recommendation.impact}`,
      totalMembers: project.members.length,
      totalTasks: project.tasks.length,
      activeTasks,
      completedTasks
    };
  }

  getTeamWorkload() {
    if (!this.currentAnalysis) this.runFullAnalysis();
    return this.currentAnalysis.workloads;
  }

  getBottleneckData() {
    if (!this.currentAnalysis) this.runFullAnalysis();
    const { bottlenecks, recommendation } = this.currentAnalysis;

    return {
      affectedMember: bottlenecks.affectedMember,
      workloadPercentage: bottlenecks.workloadPercentage,
      riskLevel: bottlenecks.riskLevel,
      reason: bottlenecks.reason,
      affectedTasks: bottlenecks.affectedTasks,
      aiRecommendation: {
        action: recommendation.action,
        details: recommendation.details,
        impact: recommendation.impact
      }
    };
  }

  getDependencyGraph() {
    if (!this.currentAnalysis) this.runFullAnalysis();
    const { dependencyGraph, bottlenecks } = this.currentAnalysis;

    const primaryBnId = bottlenecks.primaryBottleneckTask?.id;

    const nodes = dependencyGraph.tasks.map(t => {
      const isBn = primaryBnId === t.id;
      return {
        id: t.id,
        title: isBn ? `${t.id} ⚠️` : (t.title || t.name || t.id),
        description: t.description || 'Task description',
        status: isBn ? 'bottleneck' : (t.computedStatus ? t.computedStatus.toLowerCase() : 'pending'),
        owner: t.assignedMember || t.owner || 'Unassigned',
        isBottleneck: isBn,
        warning: isBn ? 'High Risk Bottleneck' : undefined
      };
    });

    return {
      nodes,
      edges: dependencyGraph.edges
    };
  }

  getSimulationData() {
    if (!this.currentAnalysis) this.runFullAnalysis();
    return this.currentAnalysis.simulation;
  }
}

// Global Singleton instance
export const aiService = new AIIntelligenceService();
export default aiService;
