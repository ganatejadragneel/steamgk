import React, { useState } from 'react';
import { styled } from '@mui/system';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

const CustomTab = styled(Tab)(({ theme }) => ({
  minWidth: 'unset',
  padding: '6px 12px',
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Dashboard = () => {
  const [dashboardTabValue, setDashboardTabValue] = useState(0);

  const handleDashboardTabChange = (event, newValue) => {
    setDashboardTabValue(newValue);
  };

  return (
    <div>
      <Box sx={{ width: '100%', borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={dashboardTabValue} onChange={handleDashboardTabChange} aria-label="dashboard tabs">
          <CustomTab label="Dash 1" {...a11yProps(0)} />
          <CustomTab label="Dash 2" {...a11yProps(1)} />
          <CustomTab label="Dash 3" {...a11yProps(2)} />
        </Tabs>
      </Box>
      {/* Add the content for each tab */}
    </div>
  );
};

export default Dashboard;