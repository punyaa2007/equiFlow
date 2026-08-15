import React, { useEffect, useState } from 'react';
import { api } from './api';

export default function TeamWorkload() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWorkload() {
      try {
        const data = await api.getTeamWorkload();
        setTeam(data);
      } catch (err) {
        console.error("Failed to load workload:", err);
      } finally {
        setLoading(false);
      }
    }
    loadWorkload();
  }, []);

  if (loading) return <div className="loading-container"><p>Loading Team Workload...</p></div>;

  const maxHours = Math.max(...team.map(t => Math.max(t.assignedHours, t.actualHours)), 16);

  return (
    <div className="team-workload-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stage 5: Team Workload Analysis</h1>
          <p className="page-subtitle">Assigned vs Actual hours comparison & capacity monitoring</p>
        </div>
        <div className="header-summary-badge">
          <span>Capacity Threshold: <strong>100%</strong></span>
        </div>
      </div>

      {team.some(m => m.workloadPercentage > 100) && (
        <div className="alert-banner alert-danger">
          <div className="alert-content">
            <h4 className="alert-title">Overload Warning Detected!</h4>
            <p className="alert-text">
              <strong>Arun</strong> (118% workload) & <strong>Priya</strong> (115% workload) are exceeding safe operational capacity thresholds.
            </p>
          </div>
        </div>
      )}

      <div className="member-cards-grid">
        {team.map((member) => {
          const isOverloaded = member.workloadPercentage > 100;
          const assignedWidth = (member.assignedHours / maxHours) * 100;
          const actualWidth = (member.actualHours / maxHours) * 100;

          return (
            <div key={member.id} className={`member-detail-card ${isOverloaded ? 'card-overloaded' : ''}`}>
              <div className="member-card-header">
                <div>
                  <h3 className="member-name">{member.name}</h3>
                  <span className="member-role">{member.role}</span>
                </div>
                <span className={`workload-pill ${isOverloaded ? 'pill-danger' : 'pill-success'}`}>
                  {member.workloadPercentage}% Workload
                </span>
              </div>

              <div className="hours-comparison-box">
                <div className="chart-bar-row">
                  <div className="chart-label">
                    <span>Assigned</span>
                    <span className="chart-val">{member.assignedHours}h</span>
                  </div>
                  <div className="bar-track">
                    <div className="bar-fill bar-assigned" style={{ width: `${assignedWidth}%` }}></div>
                  </div>
                </div>

                <div className="chart-bar-row">
                  <div className="chart-label">
                    <span>Actual Logged</span>
                    <span className={`chart-val ${isOverloaded ? 'text-red' : 'text-primary'}`}>
                      {member.actualHours}h
                    </span>
                  </div>
                  <div className="bar-track">
                    <div className={`bar-fill ${isOverloaded ? 'bar-actual-over' : 'bar-actual-normal'}`} style={{ width: `${actualWidth}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}