/**
 * EquiFlow Unified API Service (src/api.js)
 * 
 * Connected to:
 * - Layer 1: Supabase Cloud PostgreSQL Database (or local fallback)
 * - Layer 2: Member 2 AI Intelligence Engine
 * - Layer 3: Member 3 Presentation Layer
 */

import { supabase, isSupabaseConfigured } from './supabase.js';
import { aiService } from './ai/aiIntelligenceService.js';
import { mockProject } from './ai/dataset.js';

// Central fallback in-memory state when Supabase credentials aren't set
let currentProject = JSON.parse(JSON.stringify(mockProject));
aiService.updateProjectData(currentProject);

/**
 * Syncs Supabase database records into Member 2's AI Pipeline.
 */
async function syncFromSupabase() {
  if (!isSupabaseConfigured || !supabase) return;

  try {
    const { data: prjData } = await supabase.from('projects').select('*').limit(1).single();
    if (!prjData) return;

    const { data: membersData } = await supabase.from('members').select('*').eq('project_id', prjData.id);
    const { data: tasksData } = await supabase.from('tasks').select('*').eq('project_id', prjData.id);
    const { data: logsData } = await supabase.from('work_logs').select('*').eq('project_id', prjData.id);
    const { data: depsData } = await supabase.from('task_dependencies').select('*').eq('project_id', prjData.id);

    const formattedProject = {
      id: prjData.id,
      name: prjData.name,
      description: prjData.description,
      goal: prjData.goal,
      progress: prjData.progress || 0,
      members: (membersData || []).map(m => ({
        id: m.id,
        name: m.name,
        role: m.role,
        avatar: m.avatar,
        capacity_hours: Number(m.capacity_hours || 10)
      })),
      tasks: (tasksData || []).map(t => ({
        id: t.id,
        name: t.name,
        title: t.title || t.name,
        description: t.description,
        priority: t.priority,
        complexity: t.complexity,
        estimatedHours: Number(t.estimated_hours || 8),
        assignedMember: t.assigned_member,
        status: t.status,
        dependencies: typeof t.dependencies === 'string' ? JSON.parse(t.dependencies) : (t.dependencies || [])
      })),
      dependencies: (depsData || []).map(d => ({ from: d.from_task, to: d.to_task })),
      workLogs: (logsData || []).map(l => ({
        id: l.id,
        memberId: l.member_id,
        member: l.member_name,
        taskId: l.task_id,
        hours: Number(l.hours),
        category: l.category,
        description: l.description,
        timestamp: new Date(l.created_at).toLocaleTimeString()
      }))
    };

    currentProject = formattedProject;
    aiService.updateProjectData(currentProject);
  } catch (err) {
    console.error("Supabase sync error (falling back to reactive state):", err);
  }
}

export const api = {
  // --- 1. Dashboard Overview (Layer 3 + Layer 2 AI) ---
  getDashboardSummary: async () => {
    await syncFromSupabase();
    return aiService.getDashboardSummary();
  },

  // --- 2. Team Workload Analytics (Layer 3 + Layer 2 AI) ---
  getTeamWorkload: async () => {
    await syncFromSupabase();
    return aiService.getTeamWorkload();
  },

  // --- 3. Bottleneck Diagnosis (Layer 3 + Layer 2 AI) ---
  getBottleneckData: async () => {
    await syncFromSupabase();
    return aiService.getBottleneckData();
  },

  // --- 4. Task Dependency Graph & Critical Path (Layer 3 + Layer 2 AI) ---
  getDependencyGraph: async () => {
    await syncFromSupabase();
    return aiService.getDependencyGraph();
  },

  // --- 5. AI Solution Simulation (Layer 3 + Layer 2 AI) ---
  getSimulationData: async () => {
    await syncFromSupabase();
    return aiService.getSimulationData();
  },

  // --- 6. Project & Team Management (Layer 1) ---
  getProjects: async () => {
    await syncFromSupabase();
    return [currentProject];
  },

  getProject: async (_projectId) => {
    await syncFromSupabase();
    return currentProject;
  },

  createProject: async (newProjectData) => {
    const formattedMembers = (newProjectData.members || []).map((m, idx) => ({
      id: m.id || `M${idx + 1}`,
      name: m.name,
      role: m.role || 'Software Engineer',
      avatar: m.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      capacity_hours: 10
    }));

    const defaultTasks = [
      { id: "TASK-A", name: "Task A: UI Wireframes & Architecture Specs", title: "Task A", description: "Define component wireframes and state layout.", priority: "HIGH", complexity: "Medium", estimatedHours: 8, assignedMember: formattedMembers[2]?.name || "Member C", status: "Completed", dependencies: [] },
      { id: "TASK-B", name: "Task B: Database Schema & API Setup", title: "Task B ⚠️", description: "Database schema, REST endpoints, and security pipeline.", priority: "HIGH", complexity: "High", estimatedHours: 10, assignedMember: formattedMembers[1]?.name || "Member B", status: "In Progress", dependencies: ["TASK-A"] },
      { id: "TASK-C", name: "Task C: User Auth & Endpoints Integration", title: "Task C", description: "Integrate JWT authentication and API client interceptors.", priority: "HIGH", complexity: "High", estimatedHours: 6, assignedMember: formattedMembers[0]?.name || "Member A", status: "Blocked", dependencies: ["TASK-B"] },
      { id: "TASK-D", name: "Task D: Dashboard Data Integration", title: "Task D", description: "Connect frontend metrics charts with backend endpoints.", priority: "MEDIUM", complexity: "Medium", estimatedHours: 6, assignedMember: formattedMembers[0]?.name || "Member A", status: "Pending", dependencies: ["TASK-C"] }
    ];

    const prjId = `PRJ-${Math.floor(100 + Math.random() * 900)}`;
    const updated = {
      id: prjId,
      name: newProjectData.name || "New EquiFlow Project",
      description: newProjectData.description || "Project created in EquiFlow.",
      goal: newProjectData.goal || "Optimize workflow throughput and remove bottleneck risks.",
      progress: 35,
      members: formattedMembers.length > 0 ? formattedMembers : currentProject.members,
      tasks: newProjectData.tasks || defaultTasks,
      dependencies: [
        { from: "TASK-A", to: "TASK-B" },
        { from: "TASK-B", to: "TASK-C" },
        { from: "TASK-C", to: "TASK-D" }
      ],
      // Work logs start empty — team members log their own activity
      workLogs: []
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('projects').insert({ id: updated.id, name: updated.name, description: updated.description, goal: updated.goal, progress: updated.progress });
        for (const m of updated.members) {
          await supabase.from('members').insert({ id: m.id, project_id: updated.id, name: m.name, role: m.role, avatar: m.avatar, capacity_hours: m.capacity_hours });
        }
        for (const t of updated.tasks) {
          await supabase.from('tasks').insert({ id: t.id, project_id: updated.id, name: t.name, title: t.title, description: t.description, priority: t.priority, complexity: t.complexity, estimated_hours: t.estimatedHours, assigned_member: t.assignedMember, status: t.status, dependencies: JSON.stringify(t.dependencies) });
        }
        for (const d of updated.dependencies) {
          await supabase.from('task_dependencies').insert({ project_id: updated.id, from_task: d.from, to_task: d.to });
        }
        for (const l of updated.workLogs) {
          await supabase.from('work_logs').insert({ id: l.id, project_id: updated.id, member_id: l.memberId, member_name: l.member, task_id: l.taskId, hours: l.hours, category: l.category, description: l.description });
        }
      } catch (err) {
        console.error("Supabase insert error:", err);
      }
    }

    currentProject = updated;
    aiService.updateProjectData(currentProject);
    return currentProject;
  },

  // --- 7. Task Management (Layer 1) ---
  getTasks: async (_projectId) => {
    await syncFromSupabase();
    return currentProject.tasks || [];
  },

  assignTask: async (taskId, memberName) => {
    currentProject.tasks = currentProject.tasks.map(t => 
      t.id === taskId ? { ...t, assignedMember: memberName, owner: memberName } : t
    );

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('tasks').update({ assigned_member: memberName }).eq('id', taskId);
      } catch (err) {
        console.error("Supabase assignTask error:", err);
      }
    }

    aiService.updateProjectData(currentProject);
    return currentProject.tasks;
  },

  // --- 8. Work Logging (Layer 1 Friction Tracking) ---
  getWorkLogs: async () => {
    await syncFromSupabase();
    return currentProject.workLogs || [];
  },

  addWorkLog: async (newLog) => {
    const logEntry = {
      id: newLog.id || `LOG-${Date.now().toString().slice(-4)}`,
      memberId: newLog.memberId || "M01",
      member: newLog.member || "Member A",
      taskId: newLog.taskId || "TASK-GEN",
      hours: Number(newLog.hours) || 1,
      category: newLog.category || "Core Task",
      description: newLog.description || "Work logged",
      timestamp: newLog.timestamp || new Date().toLocaleTimeString()
    };

    currentProject.workLogs = [...(currentProject.workLogs || []), logEntry];

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('work_logs').insert({
          id: logEntry.id,
          project_id: currentProject.id,
          member_id: logEntry.memberId,
          member_name: logEntry.member,
          task_id: logEntry.taskId,
          hours: logEntry.hours,
          category: logEntry.category,
          description: logEntry.description
        });
      } catch (err) {
        console.error("Supabase addWorkLog error:", err);
      }
    }

    aiService.updateProjectData(currentProject);
    return currentProject.workLogs;
  },

  deleteWorkLog: async (logId) => {
    currentProject.workLogs = (currentProject.workLogs || []).filter(l => l.id !== logId);

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('work_logs').delete().eq('id', logId);
      } catch (err) {
        console.error("Supabase deleteWorkLog error:", err);
      }
    }

    aiService.updateProjectData(currentProject);
    return currentProject.workLogs;
  },

  // --- 9. Apply AI Simulation to Project (Layer 3 -> Layer 2 -> Layer 1) ---
  applySimulation: async () => {
    const sim = aiService.getSimulationData();
    const targetMember = sim.recommendation?.targetMember || 'Member C';
    const taskToMove = sim.recommendation?.taskToReassign || 'TASK-B';

    currentProject.tasks = currentProject.tasks.map(t => {
      if (t.id === taskToMove) {
        return {
          ...t,
          assignedMember: targetMember,
          owner: targetMember,
          title: (t.title || t.name).replace(' ⚠️', '')
        };
      }
      if (t.dependencies && t.dependencies.includes(taskToMove) && t.status === 'Blocked') {
        return { ...t, status: 'In Progress' };
      }
      return t;
    });

    currentProject.workLogs = currentProject.workLogs.map(l => {
      if (l.taskId === taskToMove && l.category === 'Core Task') {
        return {
          ...l,
          member: targetMember,
          memberId: currentProject.members.find(m => m.name === targetMember)?.id || 'M03'
        };
      }
      return l;
    });

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('tasks').update({ assigned_member: targetMember }).eq('id', taskToMove);
      } catch (err) {
        console.error("Supabase applySimulation error:", err);
      }
    }

    aiService.updateProjectData(currentProject);
    return {
      success: true,
      project: currentProject,
      newAnalysis: aiService.runFullAnalysis()
    };
  }
};

export default api;
