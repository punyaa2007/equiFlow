/**
 * Member 2 - AI Analysis & Bottleneck Intelligence
 * Module: Mock Work & Contribution Dataset (dataset.js)
 * 
 * Compliant with Member 1's Database & API Data Contract:
 * - Users / Members
 * - Projects
 * - Tasks & Task Assignments
 * - Work Logs (Core, Support, Review, Rework, Interruptions)
 * - Dependencies
 */

export const mockProject = {
  id: "PRJ-001",
  name: "EquiFlow Core",
  description: "Intelligent Team Workload & Bottleneck Prediction Platform.",
  goal: "Eliminate hidden workload friction, balance team sprint capacity, and predict workflow bottlenecks.",
  progress: 42,
  members: [
    {
      id: "M01",
      name: "Member A",
      role: "Frontend Developer",
      avatar: "MA",
      capacity_hours: 10
    },
    {
      id: "M02",
      name: "Member B",
      role: "Backend & Database Lead",
      avatar: "MB",
      capacity_hours: 10
    },
    {
      id: "M03",
      name: "Member C",
      role: "UI/UX & Visualizations",
      avatar: "MC",
      capacity_hours: 10
    }
  ],
  tasks: [
    {
      id: "TASK-A",
      name: "Task A: UI Wireframes & Architecture Specs",
      title: "Task A",
      description: "Define component wireframes and state flow hierarchy.",
      priority: "HIGH",
      complexity: "Medium",
      estimatedHours: 8,
      assignedMember: "Member C",
      status: "Completed",
      dependencies: []
    },
    {
      id: "TASK-B",
      name: "Task B: Database Schema & API Setup",
      title: "Task B ⚠️",
      description: "Core PostgreSQL tables, migrations, and REST controllers.",
      priority: "HIGH",
      complexity: "High",
      estimatedHours: 10,
      assignedMember: "Member B",
      status: "In Progress",
      dependencies: ["TASK-A"]
    },
    {
      id: "TASK-C",
      name: "Task C: User Auth & Endpoints Integration",
      title: "Task C",
      description: "Integrate JWT authentication and API client interceptors.",
      priority: "HIGH",
      complexity: "High",
      estimatedHours: 6,
      assignedMember: "Member A",
      status: "Blocked",
      dependencies: ["TASK-B"]
    },
    {
      id: "TASK-D",
      name: "Task D: Dashboard Data Integration & Real-time Logs",
      title: "Task D",
      description: "Connect frontend metrics charts with backend analytics endpoints.",
      priority: "MEDIUM",
      complexity: "Medium",
      estimatedHours: 6,
      assignedMember: "Member A",
      status: "Pending",
      dependencies: ["TASK-C"]
    }
  ],
  dependencies: [
    { from: "TASK-A", to: "TASK-B" },
    { from: "TASK-B", to: "TASK-C" },
    { from: "TASK-C", to: "TASK-D" }
  ],
  // Work Logs start empty — users log their own activity via the Work Log UI
  workLogs: []
};
