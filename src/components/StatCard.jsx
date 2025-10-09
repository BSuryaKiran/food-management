import React from 'react';

const StatCard = ({ icon, value, label, className = '' }) => {
  return (
    <article className={`stat-card card ${className}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-label">{label}</p>
      </div>
    </article>
  );
};

export default StatCard;
