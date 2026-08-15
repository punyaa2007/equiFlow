import React, { useEffect, useState } from 'react';
import { api } from './api';

export default function Simulation() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSimulated, setIsSimulated] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const result = await api.simulateSolution();
        setData(result);
      } catch (err) {
        console.error("Failed to load simulation data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="loading-container"><p>Loading Simulator...</p></div>;

  const { before, recommendation, after } = data;

  return (
    <div className="simulation-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stage 8: Before / After Solution Simulation</h1>
          <p className="page-subtitle">Test AI recommendations before applying structural team re-allocations</p>
        </div>
        <div className={`header-status-pill ${isSimulated ? 'success' : 'warning'}`}>
          <span className="status-dot pulsing"></span>
          State: {isSimulated ? 'Simulated (Optimized)' : 'Current (Overloaded)'}
        </div>
      </div>

      <div className="content-card simulation-trigger-card">
        <div>
          <h3>{recommendation.title}</h3>
          <p>AI Action: <strong>"{recommendation.suggestion}"</strong></p>
        </div>
        <button className={`btn ${isSimulated ? 'btn-secondary' : 'btn-purple'} btn-lg`} onClick={() => setIsSimulated(!isSimulated)}>
          {isSimulated ? 'Reset to Current State' : '⚡ Simulate Solution'}
        </button>
      </div>

      <div className="simulation-comparison-grid">
        <div className={`content-card sim-card ${!isSimulated ? 'active-state-card' : 'dimmed-card'}`}>
          <h2>BEFORE</h2>
          <p>Member: <strong>{before.member}</strong></p>
          <p>Workload: <strong className="text-red">{before.workload}%</strong></p>
          <p>Risk Level: <strong className="text-red">{before.risk}</strong></p>
          <p>Delay Risk: <strong className="text-orange">{before.delayRisk}%</strong></p>
        </div>

        <div className="vs-circle">VS</div>

        <div className={`content-card sim-card ${isSimulated ? 'active-state-card glowing-green' : 'dimmed-card'}`}>
          <h2>AFTER SIMULATION</h2>
          <p>Member: <strong>{after.member}</strong></p>
          <p>Workload: <strong className="text-green">{after.workload}%</strong></p>
          <p>Risk Level: <strong className="text-green">{after.risk}</strong></p>
          <p>Delay Risk: <strong className="text-green">{after.delayRisk}%</strong></p>
        </div>
      </div>
    </div>
  );
}