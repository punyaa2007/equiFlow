/**
 * Member 2 - AI Analysis & Bottleneck Intelligence
 * Module: Work Classification Engine (classifier.js)
 * 
 * Responsibility:
 * Automatically categorize all logged work and team activities into standard
 * EquiFlow work classification taxonomies:
 * - CORE_TASK: Primary assigned development/deliverable work
 * - SUPPORT: Unblocking peers, pair debugging, technical assistance
 * - REVIEW: Code reviews, architecture assessments, QA inspections
 * - REWORK: Bug fixes from previous revisions, addressing feedback, refactoring
 * - INTERRUPTION: Unplanned meetings, critical hotfixes, context shifts
 * - OTHER: Admin, syncs, environment maintenance
 */

export const WORK_CATEGORIES = {
  CORE_TASK: 'Core Task',
  SUPPORT: 'Support',
  REVIEW: 'Review',
  REWORK: 'Rework',
  INTERRUPTION: 'Interruption',
  OTHER: 'Other'
};

const KEYWORD_PATTERNS = {
  SUPPORT: [/support/i, /help/i, /unblock/i, /assist/i, /pair/i, /mentoring/i, /guidance/i, /troubleshoot/i],
  REVIEW: [/review/i, /pr\b/i, /pull request/i, /inspect/i, /audit/i, /critique/i, /feedback/i],
  REWORK: [/rework/i, /refactor/i, /fix regression/i, /bug fix/i, /patch/i, /redo/i, /re-implement/i, /correction/i],
  INTERRUPTION: [/interrupt/i, /urgent meeting/i, /incident/i, /hotfix/i, /context switch/i, /emergency/i, /ad-hoc/i, /fire drill/i],
  CORE_TASK: [/implement/i, /develop/i, /build/i, /feature/i, /schema/i, /api/i, /endpoint/i, /ui/i, /component/i, /test/i, /deploy/i]
};

/**
 * Classifies a work log entry based on explicit type or NLP keyword heuristic.
 * @param {Object} log - Work log item from Member 1's tracking database
 * @returns {string} One of WORK_CATEGORIES
 */
export function classifyWorkLog(log) {
  if (!log) return WORK_CATEGORIES.OTHER;

  // 1. Direct explicit classification if provided
  if (log.category && Object.values(WORK_CATEGORIES).includes(log.category)) {
    return log.category;
  }

  // 2. Type-based mapping
  if (log.type) {
    const normType = String(log.type).toLowerCase();
    if (normType.includes('support')) return WORK_CATEGORIES.SUPPORT;
    if (normType.includes('review')) return WORK_CATEGORIES.REVIEW;
    if (normType.includes('rework') || normType.includes('bug')) return WORK_CATEGORIES.REWORK;
    if (normType.includes('interrupt') || normType.includes('hotfix')) return WORK_CATEGORIES.INTERRUPTION;
    if (normType.includes('core') || normType.includes('task') || normType.includes('dev')) return WORK_CATEGORIES.CORE_TASK;
  }

  // 3. Heuristic text analysis on activity description
  const text = `${log.description || ''} ${log.title || ''} ${log.notes || ''}`;
  
  for (const [categoryKey, patterns] of Object.entries(KEYWORD_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return WORK_CATEGORIES[categoryKey];
      }
    }
  }

  return WORK_CATEGORIES.CORE_TASK;
}

/**
 * Aggregates a list of work logs by their classified categories.
 * @param {Array<Object>} logs - List of work logs
 * @returns {Object} { [category]: hours }
 */
export function aggregateClassifiedHours(logs = []) {
  const breakdown = {
    [WORK_CATEGORIES.CORE_TASK]: 0,
    [WORK_CATEGORIES.SUPPORT]: 0,
    [WORK_CATEGORIES.REVIEW]: 0,
    [WORK_CATEGORIES.REWORK]: 0,
    [WORK_CATEGORIES.INTERRUPTION]: 0,
    [WORK_CATEGORIES.OTHER]: 0
  };

  logs.forEach(log => {
    const category = classifyWorkLog(log);
    const hours = Number(log.hours || log.duration_hours || log.time_spent || 0);
    breakdown[category] = (breakdown[category] || 0) + hours;
  });

  return breakdown;
}
