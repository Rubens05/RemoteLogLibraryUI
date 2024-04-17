import React, { useEffect, useState } from 'react';
import LogsTable from './components/LogsTable';
import './App.css';
function App() {
  const [backendData, setBackendData] = useState([{}]);

  useEffect(() => {
    fetch('/api')
      .then(response => response.json())
      .then(data => {
        setBackendData(data);
      });
  }, []);

  return (
    <div className='App-header' >
      {/* Check if the logs have been fetched */}
      {typeof backendData.logs === 'undefined' || backendData.logs.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h1>Logs</h1>
          <LogsTable logs={backendData.logs} />
        </div>
      )}
    </div>
  );
}

export default App;
