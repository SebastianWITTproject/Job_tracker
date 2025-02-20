import React, { useState } from 'react';

const JobItem = ({ job, onUpdateStatus, onRemove }) => {
  const [status, setStatus] = useState(job.status); 
  const [isEditing, setIsEditing] = useState(false);

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    onUpdateStatus(job._id, newStatus);
    setIsEditing(false);
  };

  const handleRemove = () => {
    onRemove(job._id);
  };

  return (
    <li className="job-item">
      <h3>{job.title}</h3>
      <p className="company">{job.company}</p>
      <p className="date">Date: {job.date}</p>

      <div className="status-container">
        <span className={`status ${status}`}>{status}</span>
        {isEditing ? (
          <select value={status} onChange={handleStatusChange} className="status-select">
            <option value="Pending">Pending</option>
            <option value="Interview">Interview Scheduled</option>
            <option value="Offer">Offer Received</option>
            <option value="Rejected">Rejected</option>
          </select>
        ) : (
          <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
        )}
      </div>

      <button onClick={handleRemove} className="remove-btn">Remove</button>
    </li>
  );
};

export default JobItem;
