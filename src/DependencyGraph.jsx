import React, { useEffect, useState } from 'react';
import { api } from './api';

export default function DependencyGraph({ onNavigate }) {
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    async function loadGraphData() {
      try {
        const data = await api.getDependencyGraph();
        setGraph(data);
        const bn = data.nodes.find(n => n.isBottleneck);
        if (bn) setSelectedTask(bn);
      } catch (err) {
        console.error("Failed to load dependency graph:", err);
      } finally {
        setLoading(false);
      }
    }
    loadGraphData();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Rendering Task Dependency Graph...</p>
      </div>
    );
  }

  return (
    <div className="dependency-graph-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Task Dependency Graph</h1>
          <p className="page-subtitle">Visual workflow execution paths & downstream blockage detection</p>
        </div>
        <div className="header-status-pill warning">
          <span className="status-dot pulsing"></span>
          Bottleneck Identified: Task B ⚠️
        </div>
      </div>

      <div className="graph-layout">
        <div className="content-card graph-canvas-card">
          <div className="graph-header">
            <h2 className="card-title">Workflow Execution Path</h2>
            <div className="graph-legend">
              <span className="legend-item"><span className="dot dot-completed"></span> Completed</span>
              <span className="legend-item"><span className="dot dot-bottleneck"></span> Bottleneck ⚠️</span>
              <span className="legend-item"><span className="dot dot-blocked"></span> Blocked</span>
              <span className="legend-item"><span className="dot dot-pending"></span> Pending</span>
            </div>
          </div>

          <div className="graph-visual-container">
            {graph.nodes.map((node, index) => {
              const isSelected = selectedTask && selectedTask.id === node.id;
              const hasNext = index < graph.nodes.length - 1;

              return (
                <React.Fragment key={node.id}>
                  <div 
                    className={`node-card ${node.status} ${node.isBottleneck ? 'node-bottleneck-active' : ''} ${isSelected ? 'node-selected' : ''}`}
                    onClick={() => setSelectedTask(node)}
                  >
                    <div className="node-top-bar">
                      <span className="node-id-tag">{node.id}</span>
                      {node.isBottleneck && (
                        <span className="node-warning-badge pulse-badge">
                          ⚠️ BOTTLENECK
                        </span>
                      )}
                    </div>

                    <h3 className="node-title">{node.title}</h3>
                    <p className="node-desc">{node.description}</p>

                    <div className="node-footer">
                      <span className="node-owner-chip">👤 {node.owner}</span>
                      <span className={`node-status-chip status-${node.status}`}>
                        {node.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {hasNext && (
                    <div className="flow-arrow-container">
                      <div className={`arrow-line ${node.isBottleneck ? 'arrow-bottleneck' : ''}`}></div>
                      <div className="arrow-head">↓</div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="graph-sidebar">
          {selectedTask ? (
            <div className={`content-card node-details-card ${selectedTask.isBottleneck ? 'border-red' : ''}`}>
              <div className="card-header">
                <span className="badge badge-primary">{selectedTask.id} Details</span>
                {selectedTask.isBottleneck && <span className="badge badge-danger">CRITICAL NODE</span>}
              </div>

              <h2 className="selected-task-title">{selectedTask.title}</h2>
              <p className="selected-task-desc">{selectedTask.description}</p>

              <div className="detail-meta-list">
                <div className="meta-item">
                  <span className="meta-label">Assigned Owner:</span>
                  <span className="meta-val">{selectedTask.owner}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Execution Status:</span>
                  <span className={`meta-val font-bold status-text-${selectedTask.status}`}>
                    {selectedTask.status.toUpperCase()}
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Downstream Impact:</span>
                  <span className="meta-val">
                    {selectedTask.isBottleneck ? "Blocking 2 dependent tasks (Task C, Task D)" : "None"}
                  </span>
                </div>
              </div>

              {selectedTask.isBottleneck && (
                <div className="node-ai-action-box">
                  <h4>AI Insight for {selectedTask.id}</h4>
                  <p>This task is consuming 15 hours of Member B's capacity, delaying all subsequent downstream milestones.</p>
                  <button 
                    className="btn btn-purple btn-block mt-3"
                    onClick={() => onNavigate && onNavigate('simulation')}
                  >
                    Simulate Workload Shift &rarr;
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="content-card empty-sidebar">
              <p>Click any task node in the graph to view detailed properties & dependencies.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
