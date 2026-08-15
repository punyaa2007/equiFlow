import React, { useEffect, useState } from 'react';
import { api } from './api';

export default function Bottleneck({ onNavigate }) {
  const [bottleneck, setBottleneck] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBottleneckData() {
      try {
        const data = await api.getBottleneckData();
        setBottleneck(data);
      } catch (err) {
        console.error("Failed to load bottleneck data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBottleneckData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Analyzing Bottleneck Vectors & Risk Factors...</p>
      </div>
    );
  }

  return (
    <div className="bottleneck-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bottleneck Analysis</h1>
          <p className="page-subtitle">Identify root causes, affected workflows, and AI rebalancing suggestions</p>
        </div>
        <div className="header-status-pill danger">
          <span className="status-dot pulsing"></span>
          Risk Level: {bottleneck.riskLevel}
        </div>
      </div>

      <div className="bottleneck-grid">
        {/* Affected Member Hero Card */}
        <div className="content-card bottleneck-hero-card">
          <div className="card-badge-row">
            <span className="badge badge-danger">Active Bottleneck</span>
            <span className="badge badge-outline-red">HIGH Priority</span>
          </div>

          <div className="affected-member-box">
            <div className="member-avatar-lg">MB</div>
            <div className="member-info-lg">
              <h2 className="member-lg-name">{bottleneck.affectedMember}</h2>
              <p className="member-lg-role">Backend & Database Lead</p>
              <div className="workload-chip-lg">
                Workload: <strong>{bottleneck.workloadPercentage}%</strong>
              </div>
            </div>
          </div>

          <div className="bottleneck-metric-rows">
            <div className="metric-row-item">
              <span className="row-label">Bottleneck Risk Level:</span>
              <span className="row-value text-red font-bold">{bottleneck.riskLevel}</span>
            </div>
            <div className="metric-row-item">
              <span className="row-label">Hours Over Capacity:</span>
              <span className="row-value text-orange">+5 Hours</span>
            </div>
            <div className="metric-row-item">
              <span className="row-label">Downstream Blocked Tasks:</span>
              <span className="row-value">{bottleneck.affectedTasks.length} Tasks</span>
            </div>
          </div>

          <div className="reason-callout-box">
            <h4 className="callout-heading">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              Reason for Bottleneck
            </h4>
            <p className="callout-text">{bottleneck.reason}</p>
          </div>
        </div>

        {/* Affected Tasks & AI Recommendation Column */}
        <div className="bottleneck-right-column">
          <div className="content-card">
            <div className="card-header">
              <h2 className="card-title">Affected & Dependent Tasks</h2>
              <span className="badge badge-warning">{bottleneck.affectedTasks.length} At Risk</span>
            </div>

            <div className="affected-tasks-list">
              {bottleneck.affectedTasks.map((task) => (
                <div key={task.id} className="affected-task-item">
                  <div className="task-item-left">
                    <div className={`task-status-icon ${task.status === 'In Progress' ? 'icon-warning' : 'icon-danger'}`}>
                      {task.status === 'In Progress' ? '⚠️' : '⛔'}
                    </div>
                    <div>
                      <h4 className="task-name">{task.name}</h4>
                      <span className="task-id">{task.id}</span>
                    </div>
                  </div>
                  <div className="task-item-right">
                    <span className={`badge ${task.status === 'In Progress' ? 'badge-warning' : 'badge-danger'}`}>
                      {task.status}
                    </span>
                    <span className="delay-estimate-text">{task.delayEstimate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="content-card ai-recommendation-box">
            <div className="ai-rec-header">
              <div className="ai-rec-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
              </div>
              <div>
                <h3 className="ai-rec-title">AI Solution Recommendation</h3>
                <span className="ai-rec-action font-bold">{bottleneck.aiRecommendation.action}</span>
              </div>
            </div>

            <div className="ai-rec-body">
              <p className="ai-rec-detail-text">
                "{bottleneck.aiRecommendation.details}"
              </p>
              <div className="ai-impact-box">
                <strong>Expected Impact:</strong> {bottleneck.aiRecommendation.impact}
              </div>
            </div>

            <div className="ai-rec-footer">
              <button 
                className="btn btn-purple btn-block"
                onClick={() => onNavigate && onNavigate('simulation')}
              >
                Launch Before/After Simulation &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
