import React, { useEffect, useState } from 'react';
import { api } from './api';

export default function Simulation({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSimulated, setIsSimulated] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  useEffect(() => {
    async function loadSimulationData() {
      try {
        const result = await api.getSimulationData();
        setData(result);
      } catch (err) {
        console.error("Failed to load simulation data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSimulationData();
  }, []);

  const handleSimulateClick = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulated(!isSimulated);
      setIsSimulating(false);
    }, 500);
  };

  const handleApplyRebalancing = async () => {
    setIsApplying(true);
    try {
      await api.applySimulation();
      setAppliedSuccess(true);
      setTimeout(() => {
        if (onNavigate) onNavigate('dashboard');
      }, 1500);
    } catch (err) {
      console.error("Failed to apply simulation:", err);
      setIsApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading AI Workload Simulator...</p>
      </div>
    );
  }

  const { before, recommendation, after } = data;

  return (
    <div className="simulation-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stage 9: Before / After Solution Simulation</h1>
          <p className="page-subtitle">Member 3 + Member 2: Test AI recommendations before committing real sprint re-allocations</p>
        </div>
        <div className={`header-status-pill ${isSimulated ? 'success' : 'warning'}`}>
          <span className="status-dot pulsing"></span>
          State: {isSimulated ? 'Simulated (Optimized)' : 'Current (Overloaded)'}
        </div>
      </div>

      {appliedSuccess && (
        <div className="alert-banner alert-success animate-fade-in mb-4">
          <div className="alert-icon">✓</div>
          <div className="alert-content">
            <h4 className="alert-title">AI Rebalancing Applied Successfully!</h4>
            <p className="alert-text">Task reallocated to Member C. Workload balanced, downstream tasks unblocked. Redirecting to Dashboard...</p>
          </div>
        </div>
      )}

      {/* Trigger Card */}
      <div className="content-card simulation-trigger-card mb-6">
        <div className="trigger-left">
          <div className="sparkle-icon">✨</div>
          <div>
            <h3 className="trigger-title">{recommendation.title}</h3>
            <p className="trigger-desc">
              AI Action: <strong>"{recommendation.suggestion}"</strong>
            </p>
            <p className="trigger-impact-text mt-1">
              {recommendation.impact}
            </p>
          </div>
        </div>
        <div className="trigger-actions-group">
          <button 
            className={`btn ${isSimulated ? 'btn-secondary' : 'btn-purple'} btn-lg ${isSimulating ? 'loading' : ''}`}
            onClick={handleSimulateClick}
            disabled={isSimulating || isApplying}
          >
            {isSimulating ? (
              <span>Calculating Mathematical Impact...</span>
            ) : isSimulated ? (
              <span>Reset to Current State</span>
            ) : (
              <span>⚡ Simulate Solution</span>
            )}
          </button>

          {isSimulated && (
            <button 
              className={`btn btn-green btn-lg animate-fade-in ${isApplying ? 'loading' : ''}`}
              onClick={handleApplyRebalancing}
              disabled={isApplying}
            >
              {isApplying ? 'Applying to Live Project...' : '✓ Commit Rebalancing to Project'}
            </button>
          )}
        </div>
      </div>

      {/* Before / After Comparison Grid */}
      <div className="simulation-comparison-grid">
        {/* BEFORE CARD */}
        <div className={`content-card sim-card sim-before ${!isSimulated ? 'active-state-card' : 'dimmed-card'}`}>
          <div className="sim-card-header">
            <div>
              <span className="badge badge-danger">BEFORE SIMULATION</span>
              <h2 className="sim-card-title mt-2">Current Situation</h2>
            </div>
            <div className="sim-badge-red">CRITICAL OVERLOAD</div>
          </div>

          <div className="sim-metrics-list">
            <div className="sim-metric-item">
              <span className="sim-metric-label">Member B Workload</span>
              <span className="sim-metric-val text-red font-bold">{before.memberBWorkload}%</span>
            </div>
            <div className="sim-metric-progress">
              <div className="meter-bg">
                <div className="meter-fill fill-red" style={{ width: `${Math.min(before.memberBWorkload, 100)}%` }}></div>
              </div>
            </div>

            <div className="sim-metric-item mt-3">
              <span className="sim-metric-label">Member C Workload (Bandwidth)</span>
              <span className="sim-metric-val text-green">{before.memberCWorkload}%</span>
            </div>
            <div className="sim-metric-progress">
              <div className="meter-bg">
                <div className="meter-fill fill-green" style={{ width: `${before.memberCWorkload}%` }}></div>
              </div>
            </div>

            <div className="sim-metric-item mt-3">
              <span className="sim-metric-label">Bottleneck Risk</span>
              <span className="sim-metric-val text-red font-bold">{before.bottleneckRisk}</span>
            </div>

            <div className="sim-metric-item mt-3">
              <span className="sim-metric-label">Project Delay Risk</span>
              <span className="sim-metric-val text-orange font-bold">{before.delayRisk}%</span>
            </div>
            <div className="sim-metric-progress">
              <div className="meter-bg">
                <div className="meter-fill fill-orange" style={{ width: `${before.delayRisk}%` }}></div>
              </div>
            </div>

            <div className="sim-metric-item mt-3">
              <span className="sim-metric-label">Project Health</span>
              <span className="sim-metric-val text-red">{before.projectHealth || 'At Risk'} ({before.projectHealthScore || 35}%)</span>
            </div>
          </div>

          <div className="sim-summary-box red-summary">
            <p className="sim-summary-text">
              ⚠️ Member B is severely overloaded due to core deliverables + 5 hours of hidden support/rework friction. 2 downstream tasks are completely blocked.
            </p>
          </div>
        </div>

        {/* AFTER CARD */}
        <div className={`content-card sim-card sim-after ${isSimulated ? 'active-state-card simulated-glow' : 'dimmed-card'}`}>
          <div className="sim-card-header">
            <div>
              <span className="badge badge-success">AFTER SIMULATION</span>
              <h2 className="sim-card-title mt-2">Expected Improvement</h2>
            </div>
            <div className="sim-badge-green">OPTIMAL & BALANCED</div>
          </div>

          <div className="sim-metrics-list">
            <div className="sim-metric-item">
              <span className="sim-metric-label">Member B Workload</span>
              <span className="sim-metric-val text-green font-bold">
                {after.memberBWorkload}% 
                <span className="delta-badge green-delta"> -{before.memberBWorkload - after.memberBWorkload}%</span>
              </span>
            </div>
            <div className="sim-metric-progress">
              <div className="meter-bg">
                <div className="meter-fill fill-green" style={{ width: `${after.memberBWorkload}%` }}></div>
              </div>
            </div>

            <div className="sim-metric-item mt-3">
              <span className="sim-metric-label">Member C Workload</span>
              <span className="sim-metric-val text-blue font-bold">
                {after.memberCWorkload}% 
                <span className="delta-badge blue-delta"> +{after.memberCWorkload - before.memberCWorkload}%</span>
              </span>
            </div>
            <div className="sim-metric-progress">
              <div className="meter-bg">
                <div className="meter-fill fill-blue" style={{ width: `${after.memberCWorkload}%` }}></div>
              </div>
            </div>

            <div className="sim-metric-item mt-3">
              <span className="sim-metric-label">Bottleneck Risk</span>
              <span className="sim-metric-val text-green font-bold">
                {after.bottleneckRisk}
                <span className="delta-badge green-delta">RESOLVED</span>
              </span>
            </div>

            <div className="sim-metric-item mt-3">
              <span className="sim-metric-label">Project Delay Risk</span>
              <span className="sim-metric-val text-green font-bold">
                {after.delayRisk}% 
                <span className="delta-badge green-delta"> -{before.delayRisk - after.delayRisk}%</span>
              </span>
            </div>
            <div className="sim-metric-progress">
              <div className="meter-bg">
                <div className="meter-fill fill-green" style={{ width: `${after.delayRisk}%` }}></div>
              </div>
            </div>

            <div className="sim-metric-item mt-3">
              <span className="sim-metric-label">Project Health</span>
              <span className="sim-metric-val text-green">{after.projectHealth} ({after.projectHealthScore}%)</span>
            </div>
          </div>

          <div className="sim-summary-box green-summary">
            <p className="sim-summary-text">
              ✨ Reassigning Task B relieves Member B capacity, utilizes Member C bandwidth, drops delay risk by {before.delayRisk - after.delayRisk}%, and completely unblocks downstream tasks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
