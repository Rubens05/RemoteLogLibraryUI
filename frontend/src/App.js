import React, { useEffect, useState } from 'react';

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
    <div>
      {(typeof backendData.logs === 'undefined') ?
        <p>Loading...</p> :
        <div>
          <h1>Logs</h1>
          <ul>
            {backendData.logs.map((log, index) => (
              <li key={index}>
                <p>Level: {log.level}</p>
                <p>Message: {log.message}</p>
                <p>IdSender: {log.idSender}</p>
                <p>Topic: {log.topic}</p>
                <p>Timestamp: {log.timestamp}</p>
              </li>
            ))}
          </ul>
        </div>
      }
    </div>
  );
}

export default App;