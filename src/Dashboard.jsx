import React, { useEffect, useState } from 'react';
import { api } from './api';

export default function Dashboard({ onNavigate }) {
  const [data, setData] = useState(null);
  const [workload, setWorkload] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const summary = await api.getDashboardSummary();
        const team = await api.getTeamWorkload();
        setData(summary);
        setWorkload(team);
      } catch (err) {
        console.error("Failed to load dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading EquiFlow Overview...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page animate-fade-in">
      {/* Header Banner */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Project Overview</h1>
          <p className="page-subtitle">Real-time team performance, workload balance, and bottleneck analysis</p>
        </div>
        <div className="header-status-pill warning">
          <span className="status-dot pulsing"></span>
          Status: {data.projectHealth}
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="kpi-grid">
        {/* Project Health Card */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Project Health</span>
            <div className="kpi-icon-box green">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{data.projectHealthScore}%</span>
            <span className="kpi-tag badge-warning">Needs Action</span>
          </div>
          <p className="kpi-footer">Based on workload distribution & milestone delays</p>
        </div>

        {/* Bottleneck Risk Card */}
        <div 
          className="kpi-card clickable highlight-red"
          onClick={() => onNavigate && onNavigate('bottleneck')}
          title="Click to view Bottleneck details"
        >
          <div className="kpi-header">
            <span className="kpi-label">Bottleneck Risk</span>
            <div className="kpi-icon-box red">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value text-red">{data.bottleneckRisk}</span>
            <span className="kpi-arrow-link">View details &rarr;</span>
          </div>
          <p className="kpi-footer">1 Member overloaded (Member B @ 118%)</p>
        </div>

        {/* Delay Risk Card */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Delay Risk</span>
            <div className="kpi-icon-box orange">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value text-orange">{data.delayRisk}%</span>
            <span className="kpi-progress-inline">
              <span className="progress-bar-fill orange" style={{ width: `${data.delayRisk}%` }}></span>
            </span>
          </div>
          <p className="kpi-footer">High probability of milestone slippage</p>
        </div>

        {/* Hidden Work Card */}
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Hidden Work</span>
            <div className="kpi-icon-box blue">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{data.hiddenWorkHours} hrs</span>
            <span className="kpi-tag badge-info">Logged Extra</span>
          </div>
          <p className="kpi-footer">Unplanned actual hours logged beyond scope</p>
        </div>
      </div>

      {/* Main Content Grid: Workload Visualizer & AI Banner */}
      <div className="dashboard-grid">
        {/* Team Workload Summary Section */}
        <div className="content-card">
          <div className="card-header">
            <div>
              <h2 className="card-title">Team Workload Overview</h2>
              <p className="card-subtitle">Capacity vs Actual logging across members</p>
            </div>
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate && onNavigate('workload')}
            >
              Full Workload Report
            </button>
          </div>

          <div className="workload-summary-list">
            {workload.map((m) => {
              const isOverloaded = m.workloadPercentage > 100;
              return (
                <div key={m.id} className={`workload-item ${isOverloaded ? 'overloaded' : ''}`}>
                  <div className="workload-item-header">
                    <div className="user-info">
                      <div className={`avatar-circle ${isOverloaded ? 'avatar-red' : 'avatar-blue'}`}>
                        {m.avatar}
                      </div>
                      <div>
                        <div className="user-name">
                          {m.name}
                          {isOverloaded && <span className="badge badge-danger">OVERLOADED</span>}
                        </div>
                        <div className="user-role">{m.role}</div>
                      </div>
                    </div>
                    <div className="workload-stat">
                      <span className={`workload-pct ${isOverloaded ? 'text-red' : 'text-green'}`}>
                        {m.workloadPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Horizontal Bar Chart */}
                  <div className="progress-bar-bg">
                    <div 
                      className={`progress-bar-fill ${isOverloaded ? 'fill-red' : 'fill-green'}`} 
                      style={{ width: `${Math.min(m.workloadPercentage, 100)}%` }}
                    ></div>
                  </div>

                  <div className="workload-item-footer">
                    <span>Assigned: <strong>{m.assignedHours}h</strong></span>
                    <span>Actual: <strong>{m.actualHours}h</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Recommendation Banner & Quick Actions */}
        <div className="content-card ai-recommendation-card">
          <div className="card-header">
            <div className="ai-badge-header">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <h2 className="card-title text-purple">AI Smart Recommendation</h2>
            </div>
            <span className="badge badge-purple">Automated Insight</span>
          </div>

          <div className="ai-box-content">
            <p className="ai-prompt-text">
              "{data.aiRecommendation}"
            </p>

            <div className="ai-impact-preview">
              <div className="impact-pill">
                <span className="impact-label">Member B Pressure:</span>
                <span className="impact-val text-green">-27%</span>
              </div>
              <div className="impact-pill">
                <span className="impact-label">Delay Risk Drop:</span>
                <span className="impact-val text-green">72% &rarr; 31%</span>
              </div>
            </div>

            <div className="ai-card-actions">
              <button 
                className="btn btn-purple"
                onClick={() => onNavigate && onNavigate('simulation')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Simulate Solution
              </button>
              
              <button 
                className="btn btn-outline"
                onClick={() => onNavigate && onNavigate('graph')}
              >
                View Dependency Graph
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
