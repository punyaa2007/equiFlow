import React, { useEffect, useState } from 'react';
import { api } from './api';

export default function TaskBreakdown({ onAssignComplete }) {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadTasks() {
      try {
        const prj = await api.getProject();
        const tList = await api.getTasks(prj.id);
        setProject(prj);
        setTasks(tList);
      } catch (err) {
        console.error("Failed to load tasks:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  const handleMemberChange = async (taskId, newMemberName) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, assignedMember: newMemberName } : t));
    await api.assignTask(taskId, newMemberName);
  };

  const handleAssignClick = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      if (onAssignComplete) onAssignComplete();
    }, 400);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Decomposing project into executable task modules...</p>
      </div>
    );
  }

  const membersList = project?.members?.map(m => m.name) || ['Arun', 'Priya', 'Rahul'];

  return (
    <div className="task-breakdown-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stage 2: Task Breakdown & Assignment</h1>
          <p className="page-subtitle">Project: <strong>{project?.name}</strong> ({tasks.length} total tasks identified)</p>
        </div>
        <div className="header-status-pill warning">
          <span className="status-dot pulsing"></span>
          Pending Task Assignments
        </div>
      </div>

      <div className="content-card mb-6 task-banner-card">
        <div className="banner-left">
          <div className="banner-icon">📋</div>
          <div>
            <h3 className="banner-title">Automated Task Decomposition</h3>
            <p className="banner-subtitle">
              Review automatically generated tasks, adjust workload estimates, and re-assign tasks across team members.
            </p>
          </div>
        </div>
        <button 
          className={`btn btn-purple btn-lg ${isSaving ? 'loading' : ''}`}
          onClick={handleAssignClick}
        >
          ✓ Confirm Task Assignments & View Overview
        </button>
      </div>

      <div className="content-card">
        <div className="card-header mb-4">
          <h2 className="card-title">Project Tasks ({tasks.length})</h2>
          <span className="badge badge-purple">Interactive Re-assignment</span>
        </div>

        <div className="task-cards-list">
          {tasks.map((task) => (
            <div key={task.id} className="task-detail-row">
              <div className="task-main-col">
                <div className="task-badge-line">
                  <span className="task-id-tag">{task.id}</span>
                  <span className={`badge ${task.priority === 'HIGH' ? 'badge-danger' : 'badge-warning'}`}>
                    {task.priority} PRIORITY
                  </span>
                  <span className="badge badge-info">{task.complexity} Complexity</span>
                </div>
                <h3 className="task-row-title">{task.name}</h3>
                <p className="task-row-desc">{task.description}</p>
              </div>

              <div className="task-stats-col">
                <div className="stat-pill">
                  <span className="stat-pill-label">Est. Hours</span>
                  <span className="stat-pill-val">{task.estimatedHours} hrs</span>
                </div>
                <div className="stat-pill">
                  <span className="stat-pill-label">Status</span>
                  <span className={`stat-pill-val status-${task.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {task.status}
                  </span>
                </div>
              </div>

              <div className="task-assign-col">
                <label className="assign-select-label">Assigned Member</label>
                <select 
                  className="form-select"
                  value={task.assignedMember}
                  onChange={(e) => handleMemberChange(task.id, e.target.value)}
                >
                  {membersList.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="table-actions-footer mt-6">
          <button className="btn btn-purple btn-lg btn-block" onClick={handleAssignClick}>
            Assign Tasks & Continue to Project Overview &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}