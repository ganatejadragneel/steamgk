import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './KPITracker.css';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import TableChartIcon from '@mui/icons-material/TableChart';
import DashboardIcon from '@mui/icons-material/Dashboard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4002/api';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }


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

const CustomTab = styled(Tab)(({ theme }) => ({
    minWidth: 'unset',
    padding: '6px 12px',
  }));

const KPITracker = ({ onLogout }) => {
  const [responses, setResponses] = useState({});
  const [notes, setNotes] = useState({});
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchUserResponses();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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

  const handleNoteChange = (questionId, note) => {
    setNotes(prev => ({
      ...prev,
      [questionId]: note
    }));
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
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
            <CustomTab icon={<TableChartIcon />} {...a11yProps(0)} />
            <CustomTab icon={<DashboardIcon />} {...a11yProps(1)} />
        </Tabs>
        </Box>
        </Box>
        <CustomTabPanel value={tabValue} index={0}>
        <div className="questions-grid">
          {questions.map(question => (
            <div key={question.id} className="grid-row">
              <div className="activity-name">{question.text}</div>
              <div className="note">
                <input
                  type="text"
                  className="note-input"
                  placeholder="Notes"
                  maxLength="100"
                  value={notes[question.id] || ''}
                  onChange={(e) => handleNoteChange(question.id, e.target.value)}
                />
              </div>
              <div className="response">
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
            </div>
          ))}
        </div>
        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <div>
            <h1>Dashboard</h1>
          </div>
        </CustomTabPanel>
      </div>
    </div>
  );
};

export default KPITracker;