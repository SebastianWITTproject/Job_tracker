import React, { useState } from 'react';
import axios from 'axios';

const JobForm = ({ onJobAdded }) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('Pending');
  const [date, setDate] = useState('');

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newJob = { title, company, status, date };

    const token = localStorage.getItem('token');

    
    if (!token) {
      console.log("You need to be logged in to add a job");
      return; 
    }
  
   
    axios.post(`${API_URL}/api/jobs`, newJob, {
      headers: {
        'Authorization': `Bearer ${token}`  
      }
    })
      .then(() => {
        onJobAdded(); 
        setTitle('');
        setCompany('');
        setStatus('Pending');
        setDate('');
      })
      .catch((error) => {
        console.log('Error adding job:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="job-form">
      <h2>Add Job Application</h2>
      
      <input 
        type="text" 
        placeholder="Job Title" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        required 
        className="input-field" 
      />
      
      <input 
        type="text" 
        placeholder="Company" 
        value={company} 
        onChange={(e) => setCompany(e.target.value)} 
        required 
        className="input-field" 
      />
      
      <select 
        value={status} 
        onChange={(e) => setStatus(e.target.value)} 
        required 
        className="select-field"
      >
        <option value="Pending">Pending</option>
        <option value="Interview">Interview Scheduled</option>
        <option value="Offer">Offer Received</option>
        <option value="Rejected">Rejected</option>
      </select>

      <input 
        type="date" 
        value={date} 
        onChange={(e) => setDate(e.target.value)} 
        required 
        className="input-field" 
      />

      <button type="submit" className="submit-btn">Add Job</button>
    </form>
  );
};

export default JobForm;

