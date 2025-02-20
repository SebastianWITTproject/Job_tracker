
import React, { useState, useEffect } from 'react';
import JobList from './JobList';
import Footer from './Footer';
import SignIn from './SignIn';
import SignUp from './SignUp';
import '../styles.css';


const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsAuthenticated(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleSignIn = async (email, password) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/api/login`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username);
      setIsAuthenticated(true);
      setUsername(data.username);
      } else {
        alert(data.error); 
      }
    } catch (error) {
      alert('Error during sign-in:', error);
    }
  };

  const handleSignUp = async (username, email, password) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${API_URL}/api/register`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        setIsSignUp(false);
      } else {
        alert(data.error); 
      }
    } catch (error) {
      alert('Error during sign-up:', error);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    setUsername('');
  };


  const switchToSignUp = () => setIsSignUp(true);
  const switchToSignIn = () => setIsSignUp(false);

  return (
    <div>
       <nav className="navbar">
        <h1>Job Application Tracker</h1>
        {isAuthenticated && (
          <div className="nav-user">
            <span>Welcome, {username}!</span>
            <button onClick={handleSignOut} className="logout-btn">Logout</button>
          </div>
        )}
      </nav>

      {isAuthenticated ? (
        <>
          <JobList />
          <Footer />
        </>
      ) : isSignUp ? (
        <SignUp onSignUp={handleSignUp} switchToSignIn={switchToSignIn} />
      ) : (
        <SignIn onSignIn={handleSignIn} switchToSignUp={switchToSignUp} />
      )}
    </div>
  );
};

export default App;
