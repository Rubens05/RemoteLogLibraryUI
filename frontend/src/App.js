import React, { useEffect, useState } from 'react';
import LogsTable from './components/LogsTable';
import SideBar from './components/SideBar';
import './App.css';

function App() {
  const [backendData, setBackendData] = useState({ logs: [] });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: new Date(),
    endDate: new Date(),
    level: '',
    senderID: '',
    topic: '',
    message: '',
    hourStart: 0,
    hourEnd: 23
  });

  useEffect(() => {
    setLoading(true);

    const { startDate, endDate, level, senderID, topic, message, hourStart, hourEnd } = filters;
    const queryString = `startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}&level=${level}&senderID=${senderID}&topic=${topic}&message=${message}&hourStart=${hourStart}&hourEnd=${hourEnd}`;
    fetch(`/api?${queryString}`)
      .then(response => response.json())
      .then(data => {
        setBackendData(data);
        setLoading(false);
      });
  }, [filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className='App'>
      <div className='Header'>HEADER</div>
      <div className='SideBar'>
        <SideBar onFiltersChange={handleFiltersChange} />
      </div>
      <div className='LogTable'>

        {loading && <h1>Loading Logs...</h1>} {/*TODO insert loader component*/}

        {!loading && backendData.logs.length === 0 ? (
          <p>No results found</p>
        ) : (!loading &&
          <div>
            <h1>Logs</h1>
            <LogsTable logs={backendData.logs} />
          </div>
        )}


      </div>
      <div className='Footer'>FOOTER</div>
    </div>
  );
}


export default App;

