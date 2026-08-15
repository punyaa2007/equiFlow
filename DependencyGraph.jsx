import React, { useEffect, useState } from 'react';
import { api } from './api';

export default function DependencyGraph({ onNavigate }) {
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGraphData() {
      try {
        const data = await api.getDependencies();
        setGraph(data);
      } catch (err) {
        console.error("Failed to load dependency graph:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGraphData();
  }, []);

  if (loading) return <div className="loading-container"><p>Rendering Graph...</p></div>;

  return (
    <div className="dependency-graph-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stage 7: Task Dependency Graph</h1>
          <p className="page-subtitle">Visual execution pipeline with bottleneck highlights</p>
        </div>
        <div className="header-status-pill warning">
          <span className="status-dot pulsing"></span>
          Bottleneck Identified: Backend ⚠️
        </div>
      </div>

      <div className="content-card graph-canvas-card">
        <div className="graph-visual-container">
          {graph.nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              <div className={`node-card ${node.isBottleneck ? 'bottleneck node-bottleneck-active' : ''}`}>
                <h3 className="node-title">{node.title}</h3>
                <p className="node-desc">{node.description}</p>
                <span className="node-owner-chip">Assigned: {node.owner}</span>
              </div>
              {index < graph.nodes.length - 1 && (
                <div className="flow-arrow-container">
                  <div className={`arrow-line ${node.isBottleneck ? 'arrow-bottleneck' : ''}`}></div>
                  <div className="arrow-head">↓</div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}