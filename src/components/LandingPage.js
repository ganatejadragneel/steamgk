import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LandingPage.css';
import KPITracker from './KPITracker';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4002/api';

const LandingPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    if (token && refreshToken) {
      setIsLoggedIn(true);
      setupTokenRefresh();
    }
  }, []);

  const setupTokenRefresh = () => {
    setInterval(async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
          localStorage.setItem('token', res.data.token);
        } catch (error) {
          console.error('Error refreshing token:', error);
          handleLogout();
        }
      }
    }, 14 * 60 * 1000); // Refresh every 14 minutes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // Login
        const res = await axios.post(`${API_URL}/auth/login`, { username, password });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        setIsLoggedIn(true);
        setMessage('Logged in successfully');
        setupTokenRefresh();
      } else {
        // Signup
        await axios.post(`${API_URL}/auth/signup`, { username, email, password });
        setMessage('Signed up successfully. Please log in.');
        setIsLogin(true); // Switch to login form
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await axios.post(`${API_URL}/auth/logout`, { refreshToken });
    } catch (error) {
      console.error('Error logging out:', error);
    }
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setMessage('Logged out successfully');
  };

  if (isLoggedIn) {
    return <KPITracker onLogout={handleLogout} />;
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
          placeholder="Username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {!isLogin && (
          <>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        )}
        <label htmlFor="password">Password</label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isLogin ? 'Log In' : 'Sign Up'}</button>
        {message && <p className="message">{message}</p>}
        <p className="toggle-form" onClick={() => {
          setIsLogin(!isLogin);
          setMessage('');
          setUsername('');
          setEmail('');
          setPassword('');
        }}>
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}
        </p>
      </form>
    </div>
  );
};

export default LandingPage;