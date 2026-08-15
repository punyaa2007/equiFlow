import React, { useState } from 'react';
import CreateProject from './CreateProject';
import TaskBreakdown from './TaskBreakdown';
import ProjectOverview from './ProjectOverview';
import Dashboard from './Dashboard';
import TeamWorkload from './TeamWorkload';
import Bottleneck from './Bottleneck';
import DependencyGraph from './DependencyGraph';
import Simulation from './Simulation';

export default function App() {
  // Initial page on application start is 'create-project'
  const [activeTab, setActiveTab] = useState('create-project');

  // Step definitions for visual workflow navigation progress bar
  const flowSteps = [
    { id: 'create-project', label: '1. Create Project', num: 1 },
    { id: 'task-breakdown', label: '2. Tasks & Assign', num: 2 },
    { id: 'project-overview', label: '3. Overview', num: 3 },
    { id: 'dashboard', label: '4. Dashboard', num: 4 },
    { id: 'workload', label: '5. Workload', num: 5 },
    { id: 'bottleneck', label: '6. Bottlenecks', num: 6 },
    { id: 'graph', label: '7. Dependencies', num: 7 },
    { id: 'simulation', label: '8. Simulation', num: 8 }
  ];

  return (
    <div className="app-shell">
      {/* Top Header Navigation */}
      <header className="top-navbar">
        <div className="nav-container">
          {/* Logo & Branding */}
          <div className="brand-logo" onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer' }}>
            <div className="logo-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </div>
            <div className="logo-text">
              <span className="brand-name">EquiFlow</span>
              <span className="brand-subtitle">Workload & Bottleneck Analytics</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="nav-links nav-scrollable">
            <button 
              className={`nav-link ${activeTab === 'create-project' ? 'active' : ''}`}
              onClick={() => setActiveTab('create-project')}
            >
              Create Project
            </button>

            <button 
              className={`nav-link ${activeTab === 'task-breakdown' ? 'active' : ''}`}
              onClick={() => setActiveTab('task-breakdown')}
            >
              Task Breakdown
            </button>

            <button 
              className={`nav-link ${activeTab === 'project-overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('project-overview')}
            >
              Project Overview
            </button>

            <button 
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>

            <button 
              className={`nav-link ${activeTab === 'workload' ? 'active' : ''}`}
              onClick={() => setActiveTab('workload')}
            >
              Team Workload
            </button>

            <button 
              className={`nav-link ${activeTab === 'bottleneck' ? 'active' : ''}`}
              onClick={() => setActiveTab('bottleneck')}
            >
              Bottlenecks
            </button>

            <button 
              className={`nav-link ${activeTab === 'graph' ? 'active' : ''}`}
              onClick={() => setActiveTab('graph')}
            >
              Dependencies
            </button>

            <button 
              className={`nav-link nav-link-special ${activeTab === 'simulation' ? 'active' : ''}`}
              onClick={() => setActiveTab('simulation')}
            >
              Simulation
            </button>
          </nav>

          {/* User Role Badge */}
          <div className="user-role-badge">
            <span className="role-tag">Member 3</span>
            <span className="role-label">Frontend & Visuals</span>
          </div>
        </div>
      </header>

      {/* Workflow Stepper Bar */}
      <div className="workflow-stepper-bar">
        <div className="stepper-container">
          {flowSteps.map((step, idx) => {
            const isActive = activeTab === step.id;
            return (
              <React.Fragment key={step.id}>
                <div 
                  className={`step-item ${isActive ? 'step-active' : ''}`}
                  onClick={() => setActiveTab(step.id)}
                >
                  <div className="step-circle">{step.num}</div>
                  <span className="step-label">{step.label}</span>
                </div>
                {idx < flowSteps.length - 1 && <div className="step-line"></div>}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="main-content-container">
        {/* Step 1: Create Project */}
        {activeTab === 'create-project' && (
          <CreateProject onProjectCreated={() => setActiveTab('task-breakdown')} />
        )}

        {/* Step 2: Task Breakdown & Assignment */}
        {activeTab === 'task-breakdown' && (
          <TaskBreakdown onAssignComplete={() => setActiveTab('project-overview')} />
        )}

        {/* Step 3: Project Overview */}
        {activeTab === 'project-overview' && (
          <ProjectOverview onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {/* Step 4: Existing Dashboard */}
        {activeTab === 'dashboard' && (
          <Dashboard onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {/* Step 5: Existing Team Workload */}
        {activeTab === 'workload' && (
          <TeamWorkload />
        )}

        {/* Step 6: Existing Bottlenecks */}
        {activeTab === 'bottleneck' && (
          <Bottleneck onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {/* Step 7: Existing Dependency Graph */}
        {activeTab === 'graph' && (
          <DependencyGraph onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {/* Step 8: Existing Simulation */}
        {activeTab === 'simulation' && (
          <Simulation />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} EquiFlow — College Project (Member 3 Frontend & Visualizations)</p>
          <div className="footer-status-pill">
            <span className="dot dot-green"></span>
            REST API Stubs Ready for Spring Boot Integration
          </div>
        </div>
      </footer>
    </div>
  );
}
