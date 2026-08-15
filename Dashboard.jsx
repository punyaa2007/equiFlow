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
      <div className="page-header">
        <div>
          <h1 className="page-title">Stage 4: Dashboard Overview</h1>
          <p className="page-subtitle">Real-time team performance, workload balance, and bottleneck analysis</p>
        </div>
        <div className="header-status-pill warning">
          <span className="status-dot pulsing"></span>
          Status: {data.projectHealth}
        </div>
      </div>

      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Project Health</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{data.projectHealthScore}%</span>
            <span className="kpi-tag badge-warning">Needs Action</span>
          </div>
        </div>

        <div 
          className="kpi-card clickable highlight-red"
          onClick={() => onNavigate && onNavigate('bottleneck')}
        >
          <div className="kpi-header">
            <span className="kpi-label">Bottleneck Risk</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value text-red">{data.bottleneckRisk}</span>
            <span className="kpi-arrow-link">View details &rarr;</span>
          </div>
          <p className="kpi-footer">1 Member overloaded (Arun @ 118%)</p>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Delay Risk</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value text-orange">{data.delayRisk}%</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Hidden Work</span>
          </div>
          <div className="kpi-value-row">
            <span className="kpi-value">{data.hiddenWorkHours} hrs</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="content-card">
          <div className="card-header">
            <h2 className="card-title">Team Workload Overview</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate && onNavigate('workload')}>
              Full Workload Report
            </button>
          </div>
          <div className="workload-summary-list">
            {workload.map((m) => (
              <div key={m.id} className={`workload-item ${m.workloadPercentage > 100 ? 'overloaded' : ''}`}>
                <div className="workload-item-header">
                  <span>{m.name} ({m.role})</span>
                  <span className={m.workloadPercentage > 100 ? 'text-red' : 'text-green'}>{m.workloadPercentage}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div 
                    className={`progress-bar-fill ${m.workloadPercentage > 100 ? 'fill-red' : 'fill-green'}`} 
                    style={{ width: `${Math.min(m.workloadPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-card ai-recommendation-card">
          <h2 className="card-title text-purple">AI Smart Recommendation</h2>
          <p className="ai-prompt-text">"{data.aiRecommendation}"</p>
          <button className="btn btn-purple" onClick={() => onNavigate && onNavigate('simulation')}>
            Simulate Solution
          </button>
        </div>
      </div>
    </div>
  );
}