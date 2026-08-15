import React, { useEffect, useState } from 'react';
import { api } from './api';

export default function TeamWorkload() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkload() {
      try {
        const data = await api.getTeamWorkload();
        setTeam(data);
      } catch (err) {
        console.error("Failed to load workload:", err);
      } finally {
        setLoading(false);
      }
    }
    loadWorkload();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading Team Workload Analytics...</p>
      </div>
    );
  }

  // Calculate max scale for chart bars
  const maxHours = Math.max(...team.map(t => Math.max(t.assignedHours, t.actualHours)), 16);

  return (
    <div className="team-workload-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team Workload Visualization</h1>
          <p className="page-subtitle">Assigned vs Actual hours comparison & capacity monitoring</p>
        </div>
        <div className="header-summary-badge">
          <span>Capacity Threshold: <strong>100%</strong></span>
        </div>
      </div>

      {/* Overloaded Alert Banner if any member > 100% */}
      {team.some(m => m.workloadPercentage > 100) && (
        <div className="alert-banner alert-danger">
          <div className="alert-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div className="alert-content">
            <h4 className="alert-title">Overload Warning Detected!</h4>
            <p className="alert-text">
              <strong>Member B</strong> is operating at <strong>118% capacity</strong> (15 actual hours logged vs 10 assigned).
              This introduces critical delay risk to dependent tasks.
            </p>
          </div>
        </div>
      )}

      {/* Member Cards Detailed Grid */}
      <div className="member-cards-grid">
        {team.map((member) => {
          const isOverloaded = member.workloadPercentage > 100;
          const assignedWidth = (member.assignedHours / maxHours) * 100;
          const actualWidth = (member.actualHours / maxHours) * 100;

          return (
            <div 
              key={member.id} 
              className={`member-detail-card ${isOverloaded ? 'card-overloaded' : ''}`}
            >
              {/* Card Header */}
              <div className="member-card-header">
                <div className="member-avatar-box">
                  <div className={`avatar ${isOverloaded ? 'avatar-danger' : 'avatar-success'}`}>
                    {member.avatar}
                  </div>
                  <div>
                    <h3 className="member-name">{member.name}</h3>
                    <span className="member-role">{member.role}</span>
                  </div>
                </div>

                <div className="workload-pill-container">
                  <span className={`workload-pill ${isOverloaded ? 'pill-danger' : 'pill-success'}`}>
                    {member.workloadPercentage}% Workload
                  </span>
                </div>
              </div>

              {/* Workload Gauge Progress Bar */}
              <div className="gauge-section">
                <div className="gauge-label-row">
                  <span>Workload Level</span>
                  <span className={isOverloaded ? 'text-red font-bold' : 'text-green font-bold'}>
                    {member.status}
                  </span>
                </div>
                <div className="meter-bg">
                  <div 
                    className={`meter-fill ${isOverloaded ? 'meter-red' : 'meter-green'}`} 
                    style={{ width: `${Math.min(member.workloadPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Hours Comparison Chart (Assigned vs Actual) */}
              <div className="hours-comparison-box">
                <h4 className="box-subheading">Assigned vs Actual Work</h4>

                {/* Assigned Bar */}
                <div className="chart-bar-row">
                  <div className="chart-label">
                    <span>Assigned</span>
                    <span className="chart-val">{member.assignedHours}h</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill bar-assigned" style={{ width: `${assignedWidth}%` }}></div>
                  </div>
                </div>

                {/* Actual Bar */}
                <div className="chart-bar-row">
                  <div className="chart-label">
                    <span>Actual Logged</span>
                    <span className={`chart-val ${isOverloaded ? 'text-red' : 'text-primary'}`}>
                      {member.actualHours}h
                    </span>
                  </div>
                  <div className="bar-track">
                    <div 
                      className={`bar-fill ${isOverloaded ? 'bar-actual-over' : 'bar-actual-normal'}`} 
                      style={{ width: `${actualWidth}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Footer Stat Breakdown */}
              <div className="member-card-footer">
                <div className="stat-col">
                  <span className="stat-label">Active Tasks</span>
                  <span className="stat-val">{member.activeTasksCount} Tasks</span>
                </div>
                <div className="stat-col">
                  <span className="stat-label">Variance</span>
                  <span className={`stat-val ${member.actualHours > member.assignedHours ? 'text-red' : 'text-green'}`}>
                    {member.actualHours > member.assignedHours ? `+${member.actualHours - member.assignedHours}h` : `${member.actualHours - member.assignedHours}h`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Comparison Summary Table */}
      <div className="content-card mt-6">
        <h2 className="card-title mb-4">Summary Comparison Table</h2>
        <div className="table-responsive">
          <table className="workload-table">
            <thead>
              <tr>
                <th>Team Member</th>
                <th>Role</th>
                <th>Assigned Hours</th>
                <th>Actual Hours</th>
                <th>Workload %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {team.map(m => (
                <tr key={m.id} className={m.workloadPercentage > 100 ? 'row-highlight-red' : ''}>
                  <td>
                    <div className="table-user">
                      <span className="user-badge">{m.avatar}</span>
                      <strong>{m.name}</strong>
                    </div>
                  </td>
                  <td>{m.role}</td>
                  <td>{m.assignedHours} hrs</td>
                  <td><strong>{m.actualHours} hrs</strong></td>
                  <td>
                    <span className={`badge ${m.workloadPercentage > 100 ? 'badge-danger' : 'badge-success'}`}>
                      {m.workloadPercentage}%
                    </span>
                  </td>
                  <td>
                    {m.workloadPercentage > 100 ? (
                      <span className="status-tag status-red">⚠️ Overloaded</span>
                    ) : (
                      <span className="status-tag status-green">✓ Optimal</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
