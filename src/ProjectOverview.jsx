import React, { useEffect, useState } from 'react';
import { api } from './api';

export default function ProjectOverview({ onNavigate }) {
  const [project, setProject] = useState(null);
  const [summary, setSummary] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      try {
        const prj = await api.getProject();
        const sum = await api.getDashboardSummary();
        const tList = await api.getTasks(prj.id);
        setProject(prj);
        setSummary(sum);
        setTasks(tList);
      } catch (err) {
        console.error("Failed to load project overview:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOverview();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Synthesizing project structural metrics...</p>
      </div>
    );
  }

  const memberTasksMap = {};
  if (project?.members) {
    project.members.forEach(m => {
      memberTasksMap[m.name] = tasks.filter(t => t.assignedMember === m.name);
    });
  } else {
    memberTasksMap['Priya'] = tasks.filter(t => t.assignedMember === 'Priya');
    memberTasksMap['Arun'] = tasks.filter(t => t.assignedMember === 'Arun');
    memberTasksMap['Rahul'] = tasks.filter(t => t.assignedMember === 'Rahul');
  }

  return (
    <div className="project-overview-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stage 3: Project Overview</h1>
          <p className="page-subtitle">Unified project architecture, team allocation tree, and status breakdown</p>
        </div>
        <div className="header-status-pill success">
          <span className="status-dot"></span>
          Project Active: {project?.name}
        </div>
      </div>

      <div className="content-card project-hero-card mb-6">
        <div className="hero-top-row">
          <div>
            <span className="badge badge-purple">PROJECT SCOPE</span>
            <h2 className="project-hero-title">{project?.name}</h2>
            <p className="project-hero-desc">{project?.description}</p>
          </div>
          <div className="progress-ring-box">
            <div className="progress-value-huge">{summary?.overallProgress || 42}%</div>
            <span className="progress-label">Overall Completion</span>
          </div>
        </div>

        <div className="overview-stats-grid mt-4">
          <div className="stat-card">
            <span className="stat-card-label">Total Tasks</span>
            <span className="stat-card-value">{summary?.totalTasks || tasks.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">Completed Tasks</span>
            <span className="stat-card-value text-green">{summary?.completedTasks || 3}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">Pending / In Progress</span>
            <span className="stat-card-value text-orange">{summary?.pendingTasks || 4}</span>
          </div>
          <div className="stat-card">
            <span className="stat-card-label">Core Team Size</span>
            <span className="stat-card-value">{project?.members?.length || 3} Members</span>
          </div>
        </div>
      </div>

      <div className="content-card mb-6">
        <div className="card-header">
          <div>
            <h2 className="card-title">Team Task Allocation Tree</h2>
            <p className="card-subtitle">Detailed breakdown of assigned responsibilities per team member</p>
          </div>
          <span className="badge badge-info">Hierarchical View</span>
        </div>

        <div className="team-tree-grid">
          {Object.entries(memberTasksMap).map(([memberName, memberTasks]) => (
            <div key={memberName} className="team-tree-card">
              <div className="tree-card-header">
                <div className="avatar-circle avatar-blue">
                  {memberName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="tree-member-name">{memberName}</h3>
                  <span className="tree-task-count">{memberTasks.length} Assigned Tasks</span>
                </div>
              </div>

              <div className="tree-nodes-list">
                {memberTasks.length > 0 ? (
                  memberTasks.map((t, idx) => (
                    <div key={t.id} className="tree-node-item">
                      <span className="tree-connector">
                        {idx === memberTasks.length - 1 ? '└──' : '├──'}
                      </span>
                      <div className="tree-node-content">
                        <span className="node-task-name">{t.name}</span>
                        <span className={`badge ${t.status === 'Completed' ? 'badge-success' : t.status === 'In Progress' ? 'badge-warning' : 'badge-danger'}`}>
                          {t.status}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="tree-empty-text">├── (No tasks assigned)</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="overview-navigation-footer">
        <button 
          className="btn btn-purple btn-lg btn-block"
          onClick={() => onNavigate && onNavigate('dashboard')}
        >
          Proceed to Main Monitoring Dashboard &rarr;
        </button>
      </div>
    </div>
  );
}