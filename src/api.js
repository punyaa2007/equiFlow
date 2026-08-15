/**
 * EquiFlow API Service (frontend/api.js)
 * 
 * Mock API layer built for Member 3 (Frontend & Visualizations).
 * Provides asynchronous functions that return mock JSON data.
 * 
 * Future Integration Note for Member 1 (Backend) & Member 2 (AI):
 * Simply replace the return values in these functions with fetch() or axios() calls to your REST API.
 * The UI components depend ONLY on these exported async functions.
 */

// Mock Data Store
const mockData = {
  dashboardSummary: {
    projectName: "EquiFlow Core",
    projectHealth: "Needs Attention",
    projectHealthScore: 78,
    bottleneckRisk: "HIGH",
    delayRisk: 72, // percentage
    hiddenWorkHours: 5, // hours
    aiRecommendation: "Move Task B from Member B to Member C to relieve 27% workload pressure and reduce delay risk by 41%.",
    totalMembers: 3,
    activeTasks: 12,
    completedTasks: 8
  },

  teamWorkload: [
    {
      id: "member-a",
      name: "Member A",
      role: "Frontend Developer",
      assignedHours: 10,
      actualHours: 8,
      workloadPercentage: 72,
      status: "Optimal", // Optimal, Overloaded, Underloaded
      avatar: "MA",
      activeTasksCount: 3
    },
    {
      id: "member-b",
      name: "Member B",
      role: "Backend & Database Lead",
      assignedHours: 10,
      actualHours: 15,
      workloadPercentage: 118,
      status: "Overloaded",
      avatar: "MB",
      activeTasksCount: 6
    },
    {
      id: "member-c",
      name: "Member C",
      role: "UI/UX & Visualizations",
      assignedHours: 10,
      actualHours: 7,
      workloadPercentage: 64,
      status: "Optimal",
      avatar: "MC",
      activeTasksCount: 3
    }
  ],

  bottleneckInfo: {
    affectedMember: "Member B",
    workloadPercentage: 118,
    riskLevel: "HIGH",
    reason: "High workload (15 actual hrs logged vs 10 assigned hrs) combined with 4 critical downstream dependent tasks.",
    affectedTasks: [
      { id: "TASK-B", name: "Task B: Database Schema & API Setup", status: "In Progress", delayEstimate: "+2 days" },
      { id: "TASK-C", name: "Task C: User Auth Integration", status: "Blocked", delayEstimate: "Waiting on Task B" },
      { id: "TASK-D", name: "Task D: Real-time Data Logging", status: "Pending", delayEstimate: "Waiting on Task B" }
    ],
    aiRecommendation: {
      action: "Reassign Task B",
      details: "Move Task B from Member B to Member C.",
      impact: "Reduces Member B workload to 91%, drops delay risk to 31%, and unblocks Task C & D."
    }
  },

  dependencyGraph: {
    nodes: [
      { id: "TASK-A", title: "Task A", description: "UI Wireframes & Specs", status: "completed", owner: "Member C", isBottleneck: false },
      { id: "TASK-B", title: "Task B ⚠️", description: "Database Schema & API Setup", status: "bottleneck", owner: "Member B", isBottleneck: true, warning: "High Risk Bottleneck" },
      { id: "TASK-C", title: "Task C", description: "User Auth & Endpoints", status: "blocked", owner: "Member A", isBottleneck: false },
      { id: "TASK-D", title: "Task D", description: "Dashboard Data Integration", status: "pending", owner: "Member A", isBottleneck: false }
    ],
    edges: [
      { from: "TASK-A", to: "TASK-B" },
      { from: "TASK-B", to: "TASK-C" },
      { from: "TASK-C", to: "TASK-D" }
    ]
  },

  simulationData: {
    before: {
      memberBWorkload: 118,
      memberCWorkload: 64,
      bottleneckRisk: "HIGH",
      delayRisk: 72,
      statusText: "Critical Overload"
    },
    recommendation: {
      title: "AI Workload Rebalance",
      suggestion: "Move Task B from Member B to Member C."
    },
    after: {
      memberBWorkload: 91,
      memberCWorkload: 88,
      bottleneckRisk: "LOW",
      delayRisk: 31,
      statusText: "Balanced & Optimal"
    }
  }
};

// API Service Object
export const api = {
  // 1. Fetch Dashboard Overview
  getDashboardSummary: async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockData.dashboardSummary;
  },

  // 2. Fetch Team Workload Data
  getTeamWorkload: async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockData.teamWorkload;
  },

  // 3. Fetch Bottleneck Details
  getBottleneckData: async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockData.bottleneckInfo;
  },

  // 4. Fetch Task Dependency Graph Data
  getDependencyGraph: async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockData.dependencyGraph;
  },

  // 5. Fetch Simulation Data
  getSimulationData: async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockData.simulationData;
  }
};

export default api;
