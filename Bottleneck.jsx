import React, { useEffect, useState } from 'react';
import { api } from './api';

export default function Bottleneck({ onNavigate }) {
  const [bottleneck, setBottleneck] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBottleneckData() {
      try {
        const data = await api.getBottlenecks();
        setBottleneck(data);
      } catch (err) {
        console.error("Failed to load bottleneck data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBottleneckData();
  }, []);

  if (loading) return <div className="loading-container"><p>Analyzing Bottlenecks...</p></div>;

  return (
    <div className="bottleneck-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stage 6: Bottleneck Detection</h1>
          <p className="page-subtitle">Identify root causes, affected workflows, and AI rebalancing suggestions</p>
        </div>
        <div className="header-status-pill danger">
          <span className="status-dot pulsing"></span>
          Risk Level: {bottleneck.riskLevel}
        </div>
      </div>

      <div className="bottleneck-grid">
        <div className="content-card bottleneck-hero-card">
          <span className="badge badge-danger">Active Bottleneck</span>
          <h2 className="member-lg-name mt-2">Member: {bottleneck.affectedMember}</h2>
          <p className="member-lg-role">Task: {bottleneck.affectedTask}</p>
          <p className="text-red font-bold">Workload: {bottleneck.workloadPercentage}%</p>
          <p className="text-red font-bold">Risk Level: {bottleneck.riskLevel}</p>

          <div className="reason-callout-box mt-3">
            <h4 className="callout-heading">Reason:</h4>
            <p className="callout-text">{bottleneck.reason}</p>
          </div>
        </div>

        <div className="bottleneck-right-column">
          <div className="content-card">
            <h2 className="card-title">Affected Dependent Tasks</h2>
            <div className="affected-tasks-list mt-3">
              {bottleneck.affectedTasks.map((t) => (
                <div key={t.id} className="affected-task-item">
                  <span>{t.name} ({t.status})</span>
                  <span className="badge badge-danger">{t.delayEstimate}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="content-card ai-recommendation-box">
            <h3 className="ai-rec-title">AI Recommendation</h3>
            <p className="ai-rec-detail-text">"{bottleneck.aiRecommendation.details}"</p>
            <button className="btn btn-purple btn-block mt-3" onClick={() => onNavigate && onNavigate('simulation')}>
              Simulate Solution &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}