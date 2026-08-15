import React, { useState } from 'react';
import { api } from './api';

export default function CreateProject({ onProjectCreated }) {
  const [name, setName] = useState('E-Commerce Website');
  const [description, setDescription] = useState('Full-stack scalable e-commerce platform with automated payment workflows and inventory management.');
  const [goal, setGoal] = useState('Deliver production-ready store MVP with high throughput and zero security vulnerabilities.');
  
  const [members, setMembers] = useState([
    { id: '1', name: 'Arun', role: 'Backend Lead' },
    { id: '2', name: 'Priya', role: 'Frontend Developer' },
    { id: '3', name: 'Rahul', role: 'Database & QA' }
  ]);
  
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    setMembers([
      ...members,
      {
        id: String(members.length + 1),
        name: newMemberName.trim(),
        role: newMemberRole.trim() || 'Team Member'
      }
    ]);
    setNewMemberName('');
    setNewMemberRole('');
  };

  const handleRemoveMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    
    try {
      const created = await api.createProject({ name, description, goal, members });
      if (onProjectCreated) onProjectCreated(created);
    } catch (err) {
      console.error("Failed to create project:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-project-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Stage 1: Create New Project</h1>
          <p className="page-subtitle">Define project goals, scope, and allocate your core engineering team</p>
        </div>
        <div className="header-status-pill success">
          <span className="status-dot"></span>
          EquiFlow Setup Wizard
        </div>
      </div>

      {/* Main Form Card */}
      <div className="content-card form-container-card">
        <form onSubmit={handleSubmit}>
          {/* Section 1: Project Details */}
          <div className="form-section">
            <h2 className="section-title">1. Project Information</h2>
            
            <div className="form-group">
              <label className="form-label">Project Name *</label>
              <input 
                type="text" 
                className="form-input" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. E-Commerce Website"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Project Description</label>
              <textarea 
                className="form-textarea" 
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of application scope..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Project Goal</label>
              <input 
                type="text" 
                className="form-input" 
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Deliver production-ready store MVP"
              />
            </div>
          </div>

          <hr className="form-divider" />

          {/* Section 2: Team Member Allocation */}
          <div className="form-section">
            <div className="section-header-row">
              <div>
                <h2 className="section-title">2. Team Member Allocation</h2>
                <p className="card-subtitle">Add members to distribute project workload dynamically</p>
              </div>
              <span className="badge badge-purple">{members.length} Members Allocated</span>
            </div>

            {/* Equal-Width 3 Member Cards Grid */}
            <div className="members-chip-grid">
              {members.map((member) => (
                <div key={member.id} className="member-chip-card">
                  <div className="avatar-circle avatar-blue">
                    {member.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="chip-info">
                    <span className="chip-name">{member.name}</span>
                    <span className="chip-role">{member.role}</span>
                  </div>
                  <button 
                    type="button" 
                    className="chip-remove-btn"
                    onClick={() => handleRemoveMember(member.id)}
                    title="Remove Member"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add Member Row Input */}
            <div className="add-member-row">
              <input 
                type="text" 
                className="form-input"
                placeholder="Member Name (e.g. Rahul)"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
              />
              <input 
                type="text" 
                className="form-input"
                placeholder="Role (e.g. Database Lead)"
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
              />
              <button 
                type="button"
                className="btn btn-secondary"
                onClick={handleAddMember}
              >
                + Add Member
              </button>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="form-actions mt-6">
            <button 
              type="submit" 
              className={`btn btn-purple btn-lg btn-block ${isSubmitting ? 'loading' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Initializing Project...' : '🚀 Create Project & Continue to Task Breakdown'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}