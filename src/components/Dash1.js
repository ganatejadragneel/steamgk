import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement } from 'chart.js';

Chart.register(CategoryScale, LinearScale, PointElement);

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4002/api';

const Dash1 = () => {
  const [graphData, setGraphData] = useState([]);

  useEffect(() => {
    fetchGraphData();
  }, []);

  const fetchGraphData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/kpi/graph-data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGraphData(res.data.graphData);
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  };

  const data = {
    datasets: [
      {
        label: 'Activities',
        data: graphData,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MMM D',
          },
        },
      },
      y: {
        type: 'category',
        labels: ['Run', 'Read', 'Gym', 'Nutrition', 'Sleep 10:30p', 'Awake 6:30a', 'Tulsi', 'Water', 'Work 8 hours', 'Amma Appa', 'Jabam M', 'Jabam E', 'Skincare', 'Bath'],
      },
    },
  };

  return (
    <div>
      <h2>Dash 1</h2>
      <Scatter data={data} options={options} />
      {/* Add the arrow buttons for navigation */}
    </div>
  );
};

export default Dash1;