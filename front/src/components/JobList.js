import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobItem from './JobItem';
import JobForm from './JobForm';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchJobs = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('You need to be logged in to view jobs.');
      return;
    }

    const url = statusFilter ? `${API_URL}/api/jobs?status=${statusFilter}` : `${API_URL}/api/jobs`;

    axios.get(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => setJobs(response.data))
      .catch(error => console.log('Error fetching jobs:', error));
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const updateJobStatus = (id, newStatus) => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('You need to be logged in to update job status.');
      return;
    }

    axios.put(`${API_URL}/api/jobs/${id}`, { status: newStatus }, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    })
      .then(() => {
        fetchJobs(); 
      })
      .catch(error => console.log('Error updating job status:', error));
  };

 
  const removeJob = (id) => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('You need to be logged in to remove a job.');
      return;
    }

    axios.delete(`${API_URL}/api/jobs/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    })
      .then(() => {
        fetchJobs();
      })
      .catch(error => console.log('Error deleting job:', error));
  };

  
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  return (
    <div className="job-list-container">
      <JobForm onJobAdded={fetchJobs} />

      <div className="job-form-container">
        <select onChange={handleStatusFilterChange} value={statusFilter}>
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Interview">Interview Scheduled</option>
          <option value="Offer">Offer Received</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <ul>
        {jobs.map((job) => (
          <JobItem 
            key={job._id} 
            job={job} 
            onUpdateStatus={updateJobStatus} 
            onRemove={removeJob} 
          />
        ))}
      </ul>
    </div>
  );
};

export default JobList;
