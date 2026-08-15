/**
 * EquiFlow API Service (frontend/api.js)
 * 
 * Centralized mock data & API service layer.
 * Structured specifically for Member 3 (Frontend & Visualizations).
 * 
 * Future Integration Note for Backend (Java Spring Boot) & AI Team:
 * Replace the async mock functions below with actual REST API calls (e.g. `fetch('/api/projects')`).
 * All UI components interact exclusively through these exported functions.
 */

// Initial Mock Central Store
let currentProject = {
  id: "PRJ-001",
  name: "E-Commerce Website",
  description: "Full-stack scalable e-commerce platform with automated payment workflows and inventory management.",
  goal: "Deliver production-ready store MVP with high throughput and zero security vulnerabilities.",
  progress: 42, // percentage
  members: [
    { id: "MEM-1", name: "Arun", role: "Backend & System Architect", avatar: "AR" },
    { id: "MEM-2", name: "Priya", role: "Frontend & UI Developer", avatar: "PR" },
    { id: "MEM-3", name: "Rahul", role: "Database & QA Engineer", avatar: "RH" }
  ],
  tasks: [
    {
      id: "TSK-1",
      name: "Frontend Development",
      description: "Build responsive React components and state layout.",
      priority: "HIGH",
      complexity: "Medium",
      estimatedHours: 12,
      assignedMember: "Priya",
      status: "In Progress",
      dependencies: []
    },
    {
      id: "TSK-2",
      name: "Backend Development",
      description: "Setup Spring Boot controllers and business services.",
      priority: "HIGH",
      complexity: "High",
      estimatedHours: 15,
      assignedMember: "Arun",
      status: "In Progress",
      dependencies: ["TSK-1"]
    },
    {
      id: "TSK-3",
      name: "Database Design",
      description: "Schema design, migrations, and index optimization.",
      priority: "MEDIUM",
      complexity: "Medium",
      estimatedHours: 8,
      assignedMember: "Rahul",
      status: "Completed",
      dependencies: []
    },
    {
      id: "TSK-4",
      name: "Authentication",
      description: "OAuth2 / JWT secure token login pipeline.",
      priority: "HIGH",
      complexity: "High",
      estimatedHours: 10,
      assignedMember: "Arun",
      status: "In Progress",
      dependencies: ["TSK-2"]
    },
    {
      id: "TSK-5",
      name: "Payment Integration",
      description: "Stripe and PayPal gateway webhook integration.",
      priority: "HIGH",
      complexity: "High",
      estimatedHours: 14,
      assignedMember: "Priya",
      status: "Blocked",
      dependencies: ["TSK-2"]
    },
    {
      id: "TSK-6",
      name: "Testing & QA",
      description: "Unit testing, integration testing, and bug fixing.",
      priority: "MEDIUM",
      complexity: "Medium",
      estimatedHours: 10,
      assignedMember: "Rahul",
      status: "Pending",
      dependencies: ["TSK-5"]
    },
    {
      id: "TSK-7",
      name: "Deployment",
      description: "Docker containerization and AWS ECS CI/CD pipeline.",
      priority: "MEDIUM",
      complexity: "High",
      estimatedHours: 6,
      assignedMember: "Rahul",
      status: "Pending",
      dependencies: ["TSK-6"]
    }
  ]
};

// Workload metrics derived from tasks & actual logs
const mockWorkloadData = [
  {
    id: "MEM-1",
    name: "Arun",
    role: "Backend Lead",
    assignedTasksCount: 2,
    assignedHours: 10,
    actualHours: 15,
    workloadPercentage: 118,
    status: "Overloaded",
    avatar: "AR",
    tasks: ["Backend Development", "Authentication"]
  },
  {
    id: "MEM-2",
    name: "Priya",
    role: "Frontend Dev",
    assignedTasksCount: 2,
    assignedHours: 20,
    actualHours: 23,
    workloadPercentage: 115,
    status: "Overloaded",
    avatar: "PR",
    tasks: ["Frontend Development", "UI Design"]
  },
  {
    id: "MEM-3",
    name: "Rahul",
    role: "Database & QA",
    assignedTasksCount: 3,
    assignedHours: 10,
    actualHours: 7,
    workloadPercentage: 64,
    status: "Optimal",
    avatar: "RH",
    tasks: ["Database Design", "Testing", "Deployment"]
  }
];

// Bottleneck & AI Recommendations
const mockBottleneckData = {
  affectedMember: "Arun",
  affectedTask: "Backend Development",
  workloadPercentage: 118,
  riskLevel: "HIGH",
  reason: "High workload (15 actual hours logged vs 10 assigned) combined with multiple dependent downstream tasks (Authentication & Payment).",
  affectedTasks: [
    { id: "TSK-4", name: "Authentication", status: "In Progress", delayEstimate: "+2 days" },
    { id: "TSK-5", name: "Payment Integration", status: "Blocked", delayEstimate: "Waiting on Backend" }
  ],
  aiRecommendation: {
    action: "Reassign Task",
    details: "Move Authentication task from Arun to Priya.",
    impact: "Reduces Arun workload to 91%, drops delay risk from 72% to 31%, and unblocks payment milestone."
  }
};

// Dependency Graph visual flow
const mockDependencyData = {
  nodes: [
    { id: "FRONTEND", title: "Frontend", description: "UI Wireframes & React App", status: "completed", owner: "Priya", isBottleneck: false },
    { id: "BACKEND", title: "Backend ⚠️", description: "Spring Boot APIs & Security", status: "bottleneck", owner: "Arun", isBottleneck: true, warning: "High Risk Bottleneck" },
    { id: "PAYMENT", title: "Payment", description: "Gateway Webhooks", status: "blocked", owner: "Priya", isBottleneck: false },
    { id: "TESTING", title: "Testing", description: "End-to-End Test Suite", status: "pending", owner: "Rahul", isBottleneck: false },
    { id: "DEPLOYMENT", title: "Deployment", description: "Docker Container Pipeline", status: "pending", owner: "Rahul", isBottleneck: false }
  ],
  edges: [
    { from: "FRONTEND", to: "BACKEND" },
    { from: "BACKEND", to: "PAYMENT" },
    { from: "PAYMENT", to: "TESTING" },
    { from: "TESTING", to: "DEPLOYMENT" }
  ]
};

// Simulation Before vs After
const mockSimulationData = {
  before: {
    member: "Arun",
    workload: 118,
    risk: "HIGH",
    delayRisk: 72,
    statusText: "Critical Overload"
  },
  recommendation: {
    title: "AI Workload Rebalance",
    suggestion: "Move Authentication task from Arun to Priya"
  },
  after: {
    member: "Arun",
    workload: 91,
    risk: "LOW",
    delayRisk: 31,
    statusText: "Balanced & Optimal"
  }
};

// --- API Service Methods (REST Stubs) ---
export const api = {
  // 1. Get List of Projects
  getProjects: async () => {
    await new Promise((r) => setTimeout(r, 80));
    return [currentProject];
  },

  // 2. Get Single Project details
  getProject: async (projectId) => {
    await new Promise((r) => setTimeout(r, 80));
    return currentProject;
  },

  // 3. Create a New Project (Saves into central state)
  createProject: async (newProjectData) => {
    await new Promise((r) => setTimeout(r, 120));
    const created = {
      id: `PRJ-${Math.floor(100 + Math.random() * 900)}`,
      name: newProjectData.name || "New EquiFlow Project",
      description: newProjectData.description || "Project created via EquiFlow workflow.",
      goal: newProjectData.goal || "Complete project milestones on schedule.",
      progress: 0,
      members: newProjectData.members || [
        { id: "M1", name: "Arun", role: "Backend Developer", avatar: "AR" },
        { id: "M2", name: "Priya", role: "Frontend Developer", avatar: "PR" },
        { id: "M3", name: "Rahul", role: "Database Engineer", avatar: "RH" }
      ],
      tasks: [
        { id: "T1", name: "Frontend Development", priority: "HIGH", complexity: "Medium", estimatedHours: 12, assignedMember: "Priya", status: "In Progress" },
        { id: "T2", name: "Backend Development", priority: "HIGH", complexity: "High", estimatedHours: 15, assignedMember: "Arun", status: "In Progress" },
        { id: "T3", name: "Database Design", priority: "MEDIUM", complexity: "Medium", estimatedHours: 8, assignedMember: "Rahul", status: "Completed" },
        { id: "T4", name: "Authentication", priority: "HIGH", complexity: "High", estimatedHours: 10, assignedMember: "Arun", status: "In Progress" },
        { id: "T5", name: "Payment Integration", priority: "HIGH", complexity: "High", estimatedHours: 14, assignedMember: "Priya", status: "Pending" },
        { id: "T6", name: "Testing", priority: "MEDIUM", complexity: "Medium", estimatedHours: 10, assignedMember: "Rahul", status: "Pending" },
        { id: "T7", name: "Deployment", priority: "MEDIUM", complexity: "High", estimatedHours: 6, assignedMember: "Rahul", status: "Pending" }
      ]
    };
    currentProject = created;
    return currentProject;
  },

  // 4. Get Tasks for a Project
  getTasks: async (projectId) => {
    await new Promise((r) => setTimeout(r, 80));
    return currentProject.tasks;
  },

  // 5. Assign/Update Task Member
  assignTask: async (taskId, memberName) => {
    await new Promise((r) => setTimeout(r, 100));
    currentProject.tasks = currentProject.tasks.map(t => 
      t.id === taskId ? { ...t, assignedMember: memberName } : t
    );
    return currentProject.tasks;
  },

  // 6. Get Team Workload Analysis
  getTeamWorkload: async (projectId) => {
    await new Promise((r) => setTimeout(r, 80));
    return mockWorkloadData;
  },

  // 7. Get Bottleneck Detection
  getBottlenecks: async (projectId) => {
    await new Promise((r) => setTimeout(r, 80));
    return mockBottleneckData;
  },

  // 8. Get Task Dependencies
  getDependencies: async (projectId) => {
    await new Promise((r) => setTimeout(r, 80));
    return mockDependencyData;
  },

  // 9. Get AI Recommendations
  getRecommendations: async (projectId) => {
    await new Promise((r) => setTimeout(r, 80));
    return {
      recommendation: "Move Authentication task from Arun to Priya",
      reason: "Arun is currently overloaded at 118% workload with 2 critical tasks."
    };
  },

  // 10. Simulate Proposed Solution
  simulateSolution: async (projectId, changeRequest) => {
    await new Promise((r) => setTimeout(r, 100));
    return mockSimulationData;
  },

  // Dashboard Overview Summary (Helper)
  getDashboardSummary: async () => {
    await new Promise((r) => setTimeout(r, 80));
    return {
      projectName: currentProject.name,
      projectHealth: "Needs Attention",
      projectHealthScore: 78,
      overallProgress: currentProject.progress,
      bottleneckRisk: "HIGH",
      delayRisk: 72,
      hiddenWorkHours: 5,
      aiRecommendation: "Move Authentication task from Arun to Priya to relieve 27% workload pressure and drop delay risk to 31%.",
      totalMembers: currentProject.members.length,
      totalTasks: currentProject.tasks.length,
      completedTasks: 3,
      pendingTasks: 4
    };
  }
};

export default api;