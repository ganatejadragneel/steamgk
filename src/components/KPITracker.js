import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import './KPITracker.css';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { styled } from '@mui/system';
import TableChartIcon from '@mui/icons-material/TableChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import Dashboard from './DashBoard';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4002/api';

const questions = [
  { id: 1, text: "Run", deadline: "6pm" },
  { id: 2, text: "Read", deadline: "10pm" },
  { id: 3, text: "Gym", deadline: "10am" },
  { id: 4, text: "Nutrition", deadline: "7pm" },
  { id: 5, text: "Sleep 10:30p", deadline: "10:30pm" },
  { id: 6, text: "Awake 6:30a", deadline: "7am" },
  { id: 7, text: "Tulsi", deadline: "8pm" },
  { id: 8, text: "Water", deadline: "8pm" },
  { id: 9, text: "Work 8 hours", deadline: "--" },
  { id: 10, text: "Amma Appa", deadline: "--" },
  { id: 11, text: "Jabam M", deadline: "10am" },
  { id: 12, text: "Jabam E", deadline: "8pm" },
  { id: 13, text: "Skincare", deadline: "9pm" },
  { id: 14, text: "Bath", deadline: "11am" }
];

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

const CustomTab = styled(Tab)(({ theme }) => ({
  minWidth: 'unset',
  padding: '6px 12px',
}));

const KPITracker = ({ onLogout }) => {
  // Initialize responses with false for all questions
  const initialResponses = {};
  questions.forEach(q => {
    initialResponses[q.id] = false;
  });
  
  // Initialize empty notes for all questions
  const initialNotes = {};
  questions.forEach(q => {
    initialNotes[q.id] = '';
  });

  const [responses, setResponses] = useState(initialResponses);
  const [todayNotes, setTodayNotes] = useState(initialNotes);
  const [tabValue, setTabValue] = useState(0);
  const [generalNote, setGeneralNote] = useState('');

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchUserResponses();
      await fetchNotes();
    };
    
    loadInitialData();
  }, []); // Empty dependency array means this runs once when component mounts

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
    setTodayNotes(prev => ({
      ...prev,
      [questionId]: note || '' // Ensure we never set undefined
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
      const today = new Date().toISOString().split('T')[0];
  
      // First submit responses
      await axios.post(
        `${API_URL}/kpi/submit`, 
        { responses }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      // Prepare notes data including general note
      const notesToSubmit = {
        ...todayNotes,
        '100': generalNote.trim()
      };
  
      // Submit notes
      await axios.post(
        `${API_URL}/kpi/notes`,
        {
          date: today,
          notes: notesToSubmit
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      // Fetch updated data after successful submission
      await fetchNotes();
      alert('Responses and notes submitted successfully!');
    } catch (error) {
      console.error('Error submitting data:', error);
      alert(error.response?.data?.message || 'Failed to submit data. Please try again.');
    }
  };

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/kpi/notes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Received notes:', res.data.notes); // Debug log
      
      const notesData = res.data.notes || {};
      const today = new Date().toISOString().split('T')[0];
      const todayData = notesData[today] || {};
  
      console.log('Today\'s notes:', todayData); // Debug log
  
      // Set today's notes in state
      const updatedNotes = { ...initialNotes }; // Start with empty notes
      Object.keys(todayData).forEach(questionId => {
        if (questionId === '100') {
          setGeneralNote(todayData[questionId] || '');
        } else {
          updatedNotes[questionId] = todayData[questionId] || '';
        }
      });
  
      setTodayNotes(updatedNotes);
      console.log('Updated notes state:', updatedNotes); // Debug log
    } catch (error) {
      console.error('Error fetching notes:', error);
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
            <div className="grid-header">
              <div className="header-cell">Activity</div>
              <div className="header-cell">Deadline</div>
              <div className="header-cell">Notes</div>
              <div className="header-cell">Status</div>
            </div>
            {questions.map(question => (
              <div key={question.id} className="grid-row">
                <div className="activity-name">{question.text}</div>
                <div className="activity-deadline">{question.deadline}</div>
                <div className="note">
                <input
                  type="text"
                  className="note-input"
                  placeholder="Notes"
                  maxLength="100"
                  value={todayNotes[question.id] || ''} // Ensure we never pass undefined
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
          <div className="general-notes-section">
            <h3>General Notes</h3>
            <textarea
              className="general-notes"
              placeholder="Enter your general notes here"
              maxLength="500"
              rows="4"
              value={generalNote}
              onChange={(e) => setGeneralNote(e.target.value)}
            />
          </div>
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
        </CustomTabPanel>
        <CustomTabPanel value={tabValue} index={1}>
          <Dashboard />
        </CustomTabPanel>
      </div>
    </div>
  );
};

export default KPITracker;