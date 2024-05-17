import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/BoardsPage';
import FormPage from './pages/FormPage';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import './App.css';

function App() {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/boards" element={<DashboardPage />} />
            <Route path="/contact" element={<FormPage />} />
          </Routes>
        </div>
      </Router>
    </LocalizationProvider >
  );
}


export default App;

