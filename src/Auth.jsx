import React, { useState, useEffect } from 'react';
import { api } from './api';

export default function Auth({ onAuthSuccess, currentProjectCode, activeUser }) {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(activeUser?.id || '');
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState('Full Stack Developer');
  const [projectCodeInput, setProjectCodeInput] = useState(currentProjectCode || 'PRJ-001');
  const [mode, setMode] = useState('select'); // 'select' or 'custom'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjectInfo() {
      try {
        const prj = await api.getProject();
        if (prj && prj.members) {
          setMembers(prj.members);
          if (!activeUser && prj.members.length > 0) {
            setSelectedMember(prj.members[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load project members for auth:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjectInfo();
  }, [activeUser]);

  const handleLogin = (e) => {
    e.preventDefault();
    let userToSave = null;

    if (mode === 'select') {
      const found = members.find(m => m.id === selectedMember);
      if (found) {
        userToSave = found;
      } else if (members.length > 0) {
        userToSave = members[0];
      }
    } else {
      if (!customName.trim()) return;
      userToSave = {
        id: `M_${Date.now().toString().slice(-4)}`,
        name: customName.trim(),
        role: customRole,
        avatar: customName.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        capacity_hours: 10
      };
    }

    if (userToSave) {
      localStorage.setItem('equiflow_user', JSON.stringify(userToSave));
      localStorage.setItem('equiflow_project_code', projectCodeInput.trim() || 'PRJ-001');
      if (onAuthSuccess) {
        onAuthSuccess(userToSave, projectCodeInput.trim() || 'PRJ-001');
      }
    }
  };

  return (
    <div className="auth-component">
      <div className="auth-header">
        <div className="auth-badge-icon">🔐</div>
        <h2>Team Access & Role Identification</h2>
        <p className="auth-subtitle">Select your member identity or create a new team seat to log real-time contributions and track friction telemetry.</p>
      </div>

      <div className="auth-tabs-toggle">
        <button 
          type="button" 
          className={`auth-toggle-btn ${mode === 'select' ? 'active' : ''}`}
          onClick={() => setMode('select')}
        >
          Select Existing Member
        </button>
        <button 
          type="button" 
          className={`auth-toggle-btn ${mode === 'custom' ? 'active' : ''}`}
          onClick={() => setMode('custom')}
        >
          Join as New Member
        </button>
      </div>

      <form onSubmit={handleLogin} className="auth-form">
        {mode === 'select' ? (
          <div className="form-group">
            <label className="form-label">Choose Active Profile</label>
            {loading ? (
              <div className="loading-spinner-sm">Loading team profiles...</div>
            ) : (
              <div className="member-select-grid">
                {members.map((m) => (
                  <div 
                    key={m.id} 
                    className={`member-auth-card ${selectedMember === m.id ? 'selected' : ''}`}
                    onClick={() => setSelectedMember(m.id)}
                  >
                    <div className="member-avatar-circle">{m.avatar || m.name.substring(0, 2)}</div>
                    <div className="member-meta">
                      <span className="member-name-text">{m.name}</span>
                      <span className="member-role-text">{m.role}</span>
                    </div>
                    {selectedMember === m.id && <span className="check-mark">✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="custom-user-fields">
            <div className="form-group">
              <label className="form-label">Your Full Name</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Alex Rivera" 
                value={customName} 
                onChange={(e) => setCustomName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Your Role / Discipline</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Frontend Engineer, DevOps, QA Lead" 
                value={customRole} 
                onChange={(e) => setCustomRole(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        <div className="form-group project-code-group">
          <label className="form-label">Project Workspace Code</label>
          <div className="input-with-icon">
            <span className="input-prefix">🏢</span>
            <input 
              type="text" 
              className="form-control code-input" 
              placeholder="e.g. PRJ-001" 
              value={projectCodeInput} 
              onChange={(e) => setProjectCodeInput(e.target.value.toUpperCase())}
            />
          </div>
          <span className="form-hint">Syncs real-time state with all 3 teammates across this project ID.</span>
        </div>

        <button type="submit" className="btn-primary auth-submit-btn">
          Confirm Identity & Enter Workspace →
        </button>
      </form>
    </div>
  );
}
