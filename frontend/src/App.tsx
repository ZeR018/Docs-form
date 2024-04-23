import React, { Dispatch, SetStateAction } from 'react';
import './App.css'
import { Box, Tab, Tabs, Typography } from '@mui/material'
import FormTab from './FormTab/Form';
import TableTab from './TableTab/Table';

export type statusProps = {
  status: number,
  setStatus: Dispatch<SetStateAction<number>>
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={'span'}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  const [value, setValue] = React.useState(0);
  const handleChange = (_e: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  
  const [status, setStatus] = React.useState(0)
  return (
    <Box component='section' alignItems="center" display="flex" flexDirection="column" my={4}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Форма заявки" {...a11yProps(0)} />
          <Tab label="Сводная таблица" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <FormTab status={status} setStatus={setStatus}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <TableTab status={status}/>
      </CustomTabPanel>
    </Box>
  )
}

export default App
