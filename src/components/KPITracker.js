import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './KPITracker.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4002/api';

const questions = [
  { id: 1, text: "Run" },
  { id: 2, text: "Read" },
  { id: 3, text: "Gym" },
  { id: 4, text: "Nutrition" },
  { id: 5, text: "Sleep 10:30p" },
  { id: 6, text: "Awake 6:30a" },
  { id: 7, text: "Tulsi" },
  { id: 8, text: "Water" },
  { id: 9, text: "Work 8 hours" },
  { id: 10, text: "Amma Appa" },
  { id: 11, text: "Jabam M" },
  { id: 12, text: "Jabam E" },
  { id: 13, text: "Skincare" },
  { id: 14, text: "Bath" }
];

const KPITracker = ({ onLogout }) => {
  const [responses, setResponses] = useState({});

  useEffect(() => {
    fetchUserResponses();
  }, []);

  const fetchUserResponses = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/kpi/responses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResponses(res.data.responses);
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  };

  const handleResponseChange = (questionId, isDone) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: isDone
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/kpi/submit`, { responses }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Responses submitted successfully!');
    } catch (error) {
      console.error('Error submitting responses:', error);
      alert(error.response?.data?.message || 'Failed to submit responses. Please try again.');
    }
  };

  return (
    <div className="kpi-tracker">
      <div className="taskbar">
        <h1 className="title">KPI Tracker</h1>
        <button className="logout-btn" onClick={onLogout}>Log Out</button>
      </div>
      <div className="content">
        <div className="questions">
          {questions.map(question => (
            <div key={question.id} className="question">
              <p>{question.text}</p>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value="not-done"
                    checked={!responses[question.id]}
                    onChange={() => handleResponseChange(question.id, false)}
                  />
                  Not Done
                </label>
                <label>
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value="done"
                    checked={responses[question.id]}
                    onChange={() => handleResponseChange(question.id, true)}
                  />
                  Done
                </label>
              </div>
            </div>
          ))}
        </div>
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default KPITracker;