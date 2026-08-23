/**
 * Member 2 - AI Analysis & Bottleneck Intelligence
 * Module: Workload & Hidden Workload Engine (workloadEngine.js)
 * 
 * Responsibility:
 * 1. Calculate Assigned Workload vs Actual Workload per member.
 * 2. Uncover Hidden Workload (Support, Rework, Interruptions, Code Reviews).
 * 3. Compute Effective Workload Percentage against team capacity.
 * 4. Categorize member load status (Optimal, Overloaded, Underloaded).
 */

import { aggregateClassifiedHours, WORK_CATEGORIES } from './classifier.js';

// Default nominal weekly/sprint baseline hours per team member (adjustable per project)
export const DEFAULT_MEMBER_CAPACITY_HOURS = 10;

/**
 * Calculates detailed workload metrics for a single team member.
 * @param {Object} member - Member profile object { id, name, role, avatar }
 * @param {Array<Object>} tasks - All project tasks
 * @param {Array<Object>} workLogs - All work logs logged by the team
 * @param {number} capacityHours - Nominal baseline capacity in hours
 * @returns {Object} Structured member workload intelligence
 */
export function calculateMemberWorkload(member, tasks = [], workLogs = [], capacityHours = DEFAULT_MEMBER_CAPACITY_HOURS) {
  const memberId = member.id || member.member_id;
  const memberName = member.name || member.username;

  // Filter tasks assigned to this member (by id or name match)
  const assignedTasks = tasks.filter(t => 
    t.assignedMember === memberName || 
    t.assigned_to === memberId || 
    t.owner === memberName ||
    t.memberId === memberId
  );

  // Sum planned / assigned hours
  const assignedHours = assignedTasks.reduce((sum, t) => {
    return sum + Number(t.estimatedHours || t.assigned_hours || t.estimated_hours || 0);
  }, 0);

  // Filter work logs logged by this member
  const memberLogs = workLogs.filter(l => 
    l.memberId === memberId || 
    l.member_id === memberId || 
    l.member === memberName ||
    l.user === memberName
  );

  // Aggregate classified hours
  const breakdown = aggregateClassifiedHours(memberLogs);

  // Actual logged work total
  let actualHours = Object.values(breakdown).reduce((sum, h) => sum + h, 0);

  // Fallback: If no granular work logs yet, use assignedHours with baseline modifier
  if (actualHours === 0 && member.actualHours) {
    actualHours = Number(member.actualHours);
  } else if (actualHours === 0 && assignedHours > 0) {
    actualHours = assignedHours;
  }

  // Hidden Workload: Unplanned hours spent on support, rework, interruptions & reviews
  const supportHours = breakdown[WORK_CATEGORIES.SUPPORT] || Number(member.supportHours || member.support_hours || 0);
  const reworkHours = breakdown[WORK_CATEGORIES.REWORK] || Number(member.reworkHours || member.rework_hours || 0);
  const interruptionHours = breakdown[WORK_CATEGORIES.INTERRUPTION] || Number(member.interruptionHours || member.interruption_hours || 0);
  const reviewHours = breakdown[WORK_CATEGORIES.REVIEW] || Number(member.reviewHours || member.review_hours || 0);

  const hiddenWorkHours = supportHours + reworkHours + interruptionHours + reviewHours;

  // Workload Percentage calculation
  const effectiveCapacity = member.capacity_hours || capacityHours;
  // If actualHours exceeds assigned or capacity, calculate against standard capacity
  const workloadPercentage = Math.round((actualHours / effectiveCapacity) * 100);

  // Status classification
  let status = 'Optimal';
  if (workloadPercentage > 100) {
    status = 'Overloaded';
  } else if (workloadPercentage < 60) {
    status = 'Underloaded';
  }

  return {
    id: memberId || `member-${memberName.toLowerCase().replace(/\s+/g, '-')}`,
    name: memberName,
    role: member.role || 'Software Engineer',
    avatar: member.avatar || memberName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
    assignedHours: Math.round(assignedHours * 10) / 10,
    actualHours: Math.round(actualHours * 10) / 10,
    hiddenWorkHours: Math.round(hiddenWorkHours * 10) / 10,
    supportHours: Math.round(supportHours * 10) / 10,
    reworkHours: Math.round(reworkHours * 10) / 10,
    interruptionHours: Math.round(interruptionHours * 10) / 10,
    reviewHours: Math.round(reviewHours * 10) / 10,
    workloadPercentage,
    status,
    activeTasksCount: assignedTasks.filter(t => t.status !== 'Completed' && t.status !== 'completed').length,
    totalTasksCount: assignedTasks.length,
    tasks: assignedTasks.map(t => t.name || t.title)
  };
}

/**
 * Computes workload analytics across all team members in a project.
 * @param {Array<Object>} members - Team members list
 * @param {Array<Object>} tasks - Project tasks list
 * @param {Array<Object>} workLogs - Work logs
 * @returns {Array<Object>} List of analyzed team member workloads
 */
export function calculateTeamWorkload(members = [], tasks = [], workLogs = []) {
  return members.map(member => calculateMemberWorkload(member, tasks, workLogs));
}
