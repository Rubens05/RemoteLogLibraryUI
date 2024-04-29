import React, { useEffect, useState } from 'react';
import LogsTable from './components/LogsTable';
import SideBar from './components/SideBar';
import './App.css';

function App() {
  const [backendData, setBackendData] = useState({ logs: [] });
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState('default'); // New state for formatting
  const [filters, setFilters] = useState({
    startDate: new Date(),
    endDate: new Date(),
    level: '',
    senderID: '',
    topic: '',
    message: '',
    hourStart: 0, // default 00
    hourEnd: 23 // default 23
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

  // Function to toggle the format
  const toggleFormat = () => {
    setFormat(format === 'default' ? 'colored' : 'default');
  };


  return (
    <div className='App'>
      <div className='App-header'>
        <div>
          <h1> RemoteLog User Interface</h1>
        </div>
      </div>

      <div className="App-content">
        <div className={"App-sidebar open"}>
          <h1>Filters</h1>
          <SideBar onFiltersChange={handleFiltersChange} />
        </div>

        <div className='App-logs'>
          {loading && <h1>Loading Logs...</h1>} {/*TODO insert loader component*/}
          {!loading && backendData.logs.length === 0 ? (
            <p>No results found</p>
          ) : (
            <div className='cointainer'>

              <div>
                <h1>Logs</h1>

                <button onClick={toggleFormat}>Toggle Format</button> {/* Toggle button */}
              </div>
              <LogsTable logs={backendData.logs} format={format} />
            </div>
          )}
        </div>
      </div>

    </div >
  );
}


export default App;

