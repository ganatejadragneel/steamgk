import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LandingPage.css';

const API_URL = 'http://localhost:5000/api';

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const res = await axios.post(`${API_URL}/auth/login`, { username, password });
        localStorage.setItem('token', res.data.token);
        setIsLoggedIn(true);
        setMessage('Logged in successfully');
      } else {
        await axios.post(`${API_URL}/auth/signup`, { username, password });
        setMessage('Signed up successfully. Please log in.');
        setIsLogin(true);
      }
    } catch (error) {
      setMessage(error.response.data.message || 'An error occurred');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setMessage('Logged out successfully');
  };

  if (isLoggedIn) {
    return (
      <div className="landing-page">
        <div className="logged-in-container">
          <h2>Welcome, {username}!</h2>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      <div className="background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form onSubmit={handleSubmit}>
        <h3>{isLogin ? 'Login Here' : 'Sign Up Here'}</h3>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          placeholder="Email or Phone"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
        <p className="message">{message}</p>
        <p className="toggle-form" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}
        </p>
      </form>
    </div>
  );
};

export default LandingPage;