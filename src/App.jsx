import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import CreateProject from './CreateProject';
import TaskBreakdown from './TaskBreakdown';
import WorkLog from './WorkLog';
import ProjectOverview from './ProjectOverview';
import Dashboard from './Dashboard';
import TeamWorkload from './TeamWorkload';
import Bottleneck from './Bottleneck';
import DependencyGraph from './DependencyGraph';
import Simulation from './Simulation';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeUser, setActiveUser] = useState(null);
  const [projectCode, setProjectCode] = useState('PRJ-001');

  useEffect(() => {
    // Load stored user & project code
    const storedUser = localStorage.getItem('equiflow_user');
    const storedCode = localStorage.getItem('equiflow_project_code');
    if (storedUser) {
      try { setActiveUser(JSON.parse(storedUser)); } catch (e) {}
    }
    if (storedCode) {
      setProjectCode(storedCode);
    }
  }, []);

  const handleAuthSuccess = (user, code) => {
    setActiveUser(user);
    if (code) setProjectCode(code);
    setShowAuthModal(false);
  };

  // Step definitions across all 3 technical areas
  const flowSteps = [
    { id: 'create-project', label: '1. Create Project', member: 'Member 1 (Data)', num: 1 },
    { id: 'task-breakdown', label: '2. Tasks & Assign', member: 'Member 1 (Data)', num: 2 },
    { id: 'work-log', label: '3. Log Work & Friction', member: 'Member 1 (Data)', num: 3 },
    { id: 'project-overview', label: '4. Overview & Team', member: 'Member 1 (Data)', num: 4 },
    { id: 'dashboard', label: '5. AI Dashboard', member: 'Member 3 (UI)', num: 5 },
    { id: 'workload', label: '6. Workload & Friction', member: 'Member 3 (UI)', num: 6 },
    { id: 'bottleneck', label: '7. Bottlenecks', member: 'Member 3 (UI)', num: 7 },
    { id: 'graph', label: '8. Dependencies (DAG)', member: 'Member 3 (UI)', num: 8 },
    { id: 'simulation', label: '9. AI Simulation', member: 'Member 3 (UI)', num: 9 }
  ];

  const getActiveMemberBadge = () => {
    if (['create-project', 'task-breakdown', 'work-log', 'project-overview'].includes(activeTab)) {
      return { tag: 'Member 1', label: 'Work & Contribution Tracking (Data Layer)' };
    }
    if (['bottleneck', 'simulation'].includes(activeTab)) {
      return { tag: 'Member 2 + 3', label: 'AI Intelligence & Solution Simulation' };
    }
    return { tag: 'Member 3', label: 'Dashboard & Visualizations' };
  };

  const activeBadge = getActiveMemberBadge();

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
              <span className="brand-subtitle">Team Workload & Bottleneck Platform</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="nav-links nav-scrollable">
            <button 
              className={`nav-link ${activeTab === 'create-project' ? 'active' : ''}`}
              onClick={() => setActiveTab('create-project')}
            >
              1. Create
            </button>

            <button 
              className={`nav-link ${activeTab === 'task-breakdown' ? 'active' : ''}`}
              onClick={() => setActiveTab('task-breakdown')}
            >
              2. Tasks
            </button>

            <button 
              className={`nav-link nav-link-special ${activeTab === 'work-log' ? 'active' : ''}`}
              onClick={() => setActiveTab('work-log')}
            >
              3. Log Work
            </button>

            <button 
              className={`nav-link ${activeTab === 'project-overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('project-overview')}
            >
              4. Overview
            </button>

            <button 
              className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              5. Dashboard
            </button>

            <button 
              className={`nav-link ${activeTab === 'workload' ? 'active' : ''}`}
              onClick={() => setActiveTab('workload')}
            >
              6. Workload
            </button>

            <button 
              className={`nav-link ${activeTab === 'bottleneck' ? 'active' : ''}`}
              onClick={() => setActiveTab('bottleneck')}
            >
              7. Bottlenecks
            </button>

            <button 
              className={`nav-link ${activeTab === 'graph' ? 'active' : ''}`}
              onClick={() => setActiveTab('graph')}
            >
              8. Dependencies
            </button>

            <button 
              className={`nav-link nav-link-special ${activeTab === 'simulation' ? 'active' : ''}`}
              onClick={() => setActiveTab('simulation')}
            >
              9. Simulation
            </button>
          </nav>

          {/* User Auth & Project Access Badge */}
          <div className="user-role-badge">
            <button 
              className="auth-btn-pill"
              onClick={() => setShowAuthModal(!showAuthModal)}
              title="Click to Login / Switch Project"
            >
              <span className="dot dot-green"></span>
              {activeUser ? `👤 ${activeUser.name} (${projectCode})` : '🔑 Login / Join Project'}
            </button>
            <span className="role-label">{activeBadge.label}</span>
          </div>
        </div>
      </header>

      {/* Auth Modal Overlay if triggered */}
      {showAuthModal && (
        <div className="auth-overlay animate-fade-in">
          <div className="auth-modal-box">
            <button className="auth-close-btn" onClick={() => setShowAuthModal(false)}>✕</button>
            <Auth onAuthSuccess={handleAuthSuccess} currentProjectCode={projectCode} activeUser={activeUser} />
          </div>
        </div>
      )}

      {/* Horizontally Scrollable Workflow Stepper Bar */}
      <div className="workflow-stepper-bar">
        <div className="stepper-container">
          {flowSteps.map((step, idx) => {
            const isActive = activeTab === step.id;
            return (
              <React.Fragment key={step.id}>
                <div 
                  className={`step-item ${isActive ? 'step-active' : ''}`}
                  onClick={() => setActiveTab(step.id)}
                  title={`${step.label} (${step.member})`}
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
        {/* Step 1: Create Project (Member 1) */}
        {activeTab === 'create-project' && (
          <CreateProject onProjectCreated={() => setActiveTab('task-breakdown')} />
        )}

        {/* Step 2: Task Breakdown & Assignment (Member 1) */}
        {activeTab === 'task-breakdown' && (
          <TaskBreakdown onAssignComplete={() => setActiveTab('work-log')} />
        )}

        {/* Step 3: Work & Contribution Tracking (Member 1) */}
        {activeTab === 'work-log' && (
          <WorkLog onWorkLogged={() => {}} activeUser={activeUser} />
        )}

        {/* Step 4: Project Overview (Member 1) */}
        {activeTab === 'project-overview' && (
          <ProjectOverview onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {/* Step 5: Main Dashboard (Member 3) */}
        {activeTab === 'dashboard' && (
          <Dashboard onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {/* Step 6: Team Workload (Member 3) */}
        {activeTab === 'workload' && (
          <TeamWorkload />
        )}

        {/* Step 7: Bottlenecks (Member 3 + Member 2) */}
        {activeTab === 'bottleneck' && (
          <Bottleneck onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {/* Step 8: Dependency Graph (Member 3 + Member 2) */}
        {activeTab === 'graph' && (
          <DependencyGraph onNavigate={(tab) => setActiveTab(tab)} />
        )}

        {/* Step 9: Simulation (Member 3 + Member 2) */}
        {activeTab === 'simulation' && (
          <Simulation onNavigate={(tab) => setActiveTab(tab)} />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} EquiFlow — 3-Member Shared Platform (Project Code: <strong>{projectCode}</strong>)</p>
          <div className="footer-status-pill">
            <span className="dot dot-green"></span>
            Real User Activity Telemetry Active
          </div>
        </div>
      </footer>
    </div>
  );
}
