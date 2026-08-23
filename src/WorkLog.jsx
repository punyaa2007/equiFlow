import React, { useEffect, useState } from 'react';
import { api } from './api';

const WORK_CATEGORIES = [
  { id: 'Core Task', label: 'Core Task', desc: 'Primary assigned deliverable development', badgeClass: 'badge-purple' },
  { id: 'Support', label: 'Support Work', desc: 'Unblocking teammates, pair debugging, assistance', badgeClass: 'badge-info' },
  { id: 'Review', label: 'Code Review', desc: 'PR inspections, architecture audits, QA testing', badgeClass: 'badge-success' },
  { id: 'Rework', label: 'Rework / Bugfix', desc: 'Fixing regressions, schema updates, redo work', badgeClass: 'badge-warning' },
  { id: 'Interruption', label: 'Interruption / Hotfix', desc: 'Unplanned meetings, production emergencies', badgeClass: 'badge-danger' }
];

export default function WorkLog({ onWorkLogged, activeUser }) {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [workLogs, setWorkLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form State
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Core Task');
  const [hours, setHours] = useState(2);
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const prj = await api.getProject();
        const tList = await api.getTasks(prj.id);
        const logs = await api.getWorkLogs();
        setProject(prj);
        setTasks(tList);
        setWorkLogs(logs);

        // Pre-select active logged-in user or first project member
        if (activeUser && activeUser.name) {
          setSelectedMember(activeUser.name);
        } else if (prj.members && prj.members.length > 0) {
          setSelectedMember(prj.members[0].name);
        }
        if (tList && tList.length > 0) {
          setSelectedTask(tList[0].id);
        }
      } catch (err) {
        console.error("Failed to load work log data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [activeUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMember || !hours) return;
    setIsSubmitting(true);

    try {
      const newLog = {
        id: `LOG-${Date.now().toString().slice(-4)}`,
        member: selectedMember,
        memberId: project?.members?.find(m => m.name === selectedMember)?.id || 'M01',
        taskId: selectedTask || 'TASK-GEN',
        hours: parseFloat(hours),
        category: selectedCategory,
        description: description.trim() || `${selectedCategory} logged by ${selectedMember}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const updatedLogs = await api.addWorkLog(newLog);
      setWorkLogs(updatedLogs);
      setDescription('');
      setHours(2);
      setSuccessMessage(`✓ Logged ${newLog.hours} hrs (${newLog.category}) for ${newLog.member}. AI model updated!`);
      setTimeout(() => setSuccessMessage(''), 4000);

      if (onWorkLogged) onWorkLogged();
    } catch (err) {
      console.error("Failed to add work log:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLog = async (logId) => {
    try {
      const updated = await api.deleteWorkLog(logId);
      setWorkLogs(updated);
      if (onWorkLogged) onWorkLogged();
    } catch (err) {
      console.error("Failed to delete log:", err);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Work & Contribution Tracking Data...</p>
      </div>
    );
  }

  // Calculate totals
  const totalLoggedHours = workLogs.reduce((sum, l) => sum + (Number(l.hours) || 0), 0);
  const hiddenLoggedHours = workLogs
    .filter(l => l.category !== 'Core Task')
    .reduce((sum, l) => sum + (Number(l.hours) || 0), 0);

  return (
    <div className="work-log-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Stage 3: Work & Contribution Tracking</h1>
          <p className="page-subtitle">Log your actual time, support work, review time, rework, and interruptions</p>
        </div>
        <div className="header-status-pill success">
          <span className="status-dot"></span>
          {workLogs.length} User Log Entries
        </div>
      </div>

      {successMessage && (
        <div className="alert-banner alert-success animate-fade-in mb-4">
          <div className="alert-icon">✓</div>
          <div className="alert-content">
            <h4 className="alert-title">{successMessage}</h4>
          </div>
        </div>
      )}

      {/* KPI Row */}
      <div className="overview-stats-grid mb-6">
        <div className="stat-card">
          <span className="stat-card-label">Total User Logged Hours</span>
          <span className="stat-card-value">{totalLoggedHours.toFixed(1)} hrs</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">Hidden Work (Support/Rework/Friction)</span>
          <span className="stat-card-value text-orange">{hiddenLoggedHours.toFixed(1)} hrs</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">User Log Entries</span>
          <span className="stat-card-value text-purple">{workLogs.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-label">AI Intelligence Sync</span>
          <span className="stat-card-value text-green">Real-time</span>
        </div>
      </div>

      <div className="work-log-layout-grid">
        {/* Left Column: Log Work Form */}
        <div className="content-card form-card">
          <div className="card-header mb-4">
            <div>
              <h2 className="card-title">Log Your Activity</h2>
              <p className="card-subtitle">Every entry directly updates Member 2's AI workload model</p>
            </div>
            <span className="badge badge-purple">User Input</span>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Team Member Select */}
            <div className="form-group mb-3">
              <label className="form-label">Logged By (Team Member) *</label>
              <select 
                className="form-input form-select"
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                required
              >
                {project?.members?.map(m => (
                  <option key={m.id || m.name} value={m.name}>
                    {m.name} ({m.role || 'Member'})
                  </option>
                ))}
              </select>
            </div>

            {/* Task Association */}
            <div className="form-group mb-3">
              <label className="form-label">Associated Task</label>
              <select 
                className="form-input form-select"
                value={selectedTask}
                onChange={(e) => setSelectedTask(e.target.value)}
              >
                <option value="TASK-GEN">General Sprint Overhead / Ad-hoc</option>
                {tasks.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.id}: {t.name} (Assigned to {t.assignedMember})
                  </option>
                ))}
              </select>
            </div>

            {/* Work Classification Category */}
            <div className="form-group mb-3">
              <label className="form-label">Work Classification Category *</label>
              <div className="category-chips-grid">
                {WORK_CATEGORIES.map(cat => (
                  <button
                    type="button"
                    key={cat.id}
                    className={`category-chip-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    <span className={`badge ${cat.badgeClass}`}>{cat.label}</span>
                    <span className="chip-desc">{cat.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hours & Presets */}
            <div className="form-row-2col mb-3">
              <div className="form-group">
                <label className="form-label">Hours Spent *</label>
                <input 
                  type="number" 
                  className="form-input" 
                  step="0.5"
                  min="0.5"
                  max="24"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quick Presets</label>
                <div className="quick-hour-buttons">
                  {[1, 2, 3, 5].map(h => (
                    <button 
                      key={h} 
                      type="button" 
                      className={`btn-hour-preset ${Number(hours) === h ? 'active' : ''}`}
                      onClick={() => setHours(h)}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label">Activity Description / Notes</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="e.g. Assisting peer with PostgreSQL query optimization"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              className={`btn btn-purple btn-block ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Recording Activity...' : '➕ Log Activity & Recalculate AI'}
            </button>
          </form>
        </div>

        {/* Right Column: Work History Timeline */}
        <div className="content-card history-card">
          <div className="card-header mb-4">
            <div>
              <h2 className="card-title">Activity Stream ({workLogs.length})</h2>
              <p className="card-subtitle">User activity entries logged for project {project?.name}</p>
            </div>
            <span className="badge badge-info">{workLogs.length} Entries</span>
          </div>

          <div className="work-logs-stream">
            {workLogs.length === 0 ? (
              <div className="empty-state-box">
                <div className="empty-icon">📝</div>
                <h4>No User Activity Logged Yet</h4>
                <p>Log your actual work hours above to populate the team telemetry and trigger Member 2's AI analysis!</p>
              </div>
            ) : (
              workLogs.slice().reverse().map((log) => {
                const catObj = WORK_CATEGORIES.find(c => c.id === log.category) || WORK_CATEGORIES[0];
                return (
                  <div key={log.id} className="log-stream-item">
                    <div className="log-item-left">
                      <div className="log-avatar">
                        {log.member?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'M'}
                      </div>
                      <div className="log-info">
                        <div className="log-title-row">
                          <span className="log-member-name">{log.member}</span>
                          <span className={`badge ${catObj.badgeClass}`}>{log.category}</span>
                          <span className="log-hours-pill"><strong>{log.hours} hrs</strong></span>
                        </div>
                        <p className="log-desc">{log.description}</p>
                        <span className="log-task-id">Task: {log.taskId}</span>
                      </div>
                    </div>
                    <div>
                      <button 
                        className="btn-icon-delete"
                        onClick={() => handleDeleteLog(log.id)}
                        title="Delete log"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
