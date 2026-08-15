import React, { useEffect, useState } from 'react';
import { api } from './api';

export default function Simulation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSimulated, setIsSimulated] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

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
    }, 600);
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
          <h1 className="page-title">Before / After Solution Simulation</h1>
          <p className="page-subtitle">Test AI recommendations before applying structural team re-allocations</p>
        </div>
        <div className={`header-status-pill ${isSimulated ? 'success' : 'warning'}`}>
          <span className="status-dot pulsing"></span>
          State: {isSimulated ? 'Simulated (Optimized)' : 'Current (Overloaded)'}
        </div>
      </div>

      <div className="content-card simulation-trigger-card">
        <div className="trigger-left">
          <div className="sparkle-icon">✨</div>
          <div>
            <h3 className="trigger-title">{recommendation.title}</h3>
            <p className="trigger-desc">
              AI Action: <strong>"{recommendation.suggestion}"</strong>
            </p>
          </div>
        </div>
        <div>
          <button 
            className={`btn ${isSimulated ? 'btn-secondary' : 'btn-purple'} btn-lg ${isSimulating ? 'loading' : ''}`}
            onClick={handleSimulateClick}
            disabled={isSimulating}
          >
            {isSimulating ? (
              <span>Calculating Impact...</span>
            ) : isSimulated ? (
              <span>Reset to Current State</span>
            ) : (
              <span>⚡ Simulate Solution</span>
            )}
          </button>
        </div>
      </div>

      <div className="simulation-comparison-grid">
        {/* BEFORE CARD */}
        <div className={`content-card sim-card sim-before ${!isSimulated ? 'active-state-card' : 'dimmed-card'}`}>
          <div className="sim-card-header">
            <div>
              <span className="badge badge-danger">BEFORE SIMULATION</span>
              <h2 className="sim-card-title mt-2">Current State</h2>
            </div>
            <div className="sim-badge-red">CRITICAL</div>
          </div>

          <div className="sim-metrics-list">
            <div className="sim-metric-item">
              <span className="sim-metric-label">Member B Workload</span>
              <span className="sim-metric-val text-red font-bold">{before.memberBWorkload}%</span>
            </div>
            <div className="sim-metric-progress">
              <div className="meter-bg">
                <div className="meter-fill meter-red" style={{ width: `${Math.min(before.memberBWorkload, 100)}%` }}></div>
              </div>
            </div>

            <div className="sim-metric-item">
              <span className="sim-metric-label">Bottleneck Risk</span>
              <span className="sim-metric-val text-red font-bold">{before.bottleneckRisk}</span>
            </div>

            <div className="sim-metric-item">
              <span className="sim-metric-label">Project Delay Risk</span>
              <span className="sim-metric-val text-orange font-bold">{before.delayRisk}%</span>
            </div>
          </div>

          <div className="sim-footer-status status-red-bg">
            <span>Status: <strong>{before.statusText}</strong></span>
          </div>
        </div>

        {/* VS DIVIDER */}
        <div className="sim-divider-column">
          <div className="vs-circle">VS</div>
          <div className="arrow-transfer">&rarr;</div>
        </div>

        {/* AFTER CARD */}
        <div className={`content-card sim-card sim-after ${isSimulated ? 'active-state-card glowing-green' : 'dimmed-card'}`}>
          <div className="sim-card-header">
            <div>
              <span className="badge badge-success">AFTER SIMULATION</span>
              <h2 className="sim-card-title mt-2">Optimized State</h2>
            </div>
            <div className="sim-badge-green">RECOMMENDED</div>
          </div>

          <div className="sim-metrics-list">
            <div className="sim-metric-item">
              <span className="sim-metric-label">Member B Workload</span>
              <div className="delta-val-row">
                <span className="sim-metric-val text-green font-bold">{after.memberBWorkload}%</span>
                <span className="delta-tag green">-27%</span>
              </div>
            </div>
            <div className="sim-metric-progress">
              <div className="meter-bg">
                <div className="meter-fill meter-green" style={{ width: `${after.memberBWorkload}%` }}></div>
              </div>
            </div>

            <div className="sim-metric-item">
              <span className="sim-metric-label">Bottleneck Risk</span>
              <div className="delta-val-row">
                <span className="sim-metric-val text-green font-bold">{after.bottleneckRisk}</span>
                <span className="delta-tag green">HIGH &rarr; LOW</span>
              </div>
            </div>

            <div className="sim-metric-item">
              <span className="sim-metric-label">Project Delay Risk</span>
              <div className="delta-val-row">
                <span className="sim-metric-val text-green font-bold">{after.delayRisk}%</span>
                <span className="delta-tag green">-41%</span>
              </div>
            </div>
          </div>

          <div className="sim-footer-status status-green-bg">
            <span>Status: <strong>{after.statusText}</strong></span>
          </div>
        </div>
      </div>

      {isSimulated && (
        <div className="content-card impact-summary-card animate-fade-in">
          <div className="impact-summary-header">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h3 className="impact-summary-title">Simulation Summary & Projected Results</h3>
          </div>
          <div className="impact-grid">
            <div className="impact-box">
              <span className="ib-title">Member B Workload Drop</span>
              <span className="ib-value text-green">118% &rarr; 91%</span>
              <span className="ib-desc">Relieves overload, placing Member B safely within capacity limits.</span>
            </div>
            <div className="impact-box">
              <span className="ib-title">Member C Capacity Fit</span>
              <span className="ib-value text-blue">64% &rarr; 88%</span>
              <span className="ib-desc">Member C absorbs Task B smoothly without exceeding 100% capacity.</span>
            </div>
            <div className="impact-box">
              <span className="ib-title">Milestone Safety</span>
              <span className="ib-value text-green">72% &rarr; 31% Risk</span>
              <span className="ib-desc">Task C & D dependency blockages are immediately resolved.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
