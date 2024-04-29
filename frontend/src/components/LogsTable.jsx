// LogsTable.js
import React, { useState } from 'react';

const LogsTable = ({ logs, format }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 18;

    const paginatedLogs = logs.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < Math.ceil(logs.length / itemsPerPage)) {
            setCurrentPage(newPage);
        }
    };

    // Use a class based on the log level if format is 'colored', otherwise use a default class
    const getRowClass = (log) => {
        return format === 'colored' ? getLogLevelClass(log.level) : '';
    };

    // Function to return the class based on the log level
    const getLogLevelClass = (level) => `log-level-${level}`;

    return (
        <div>
            <table className="LogsTable">
                <thead>
                    <tr>
                        <th>Level</th>
                        <th>Message</th>
                        <th>Sender ID</th>
                        <th>Topic</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedLogs.map((log, index) => (
                        <tr key={index}>
                            <td className={getRowClass(log)}>{log.level}</td>
                            <td className={getRowClass(log)}>{log.message}</td>
                            <td className={getRowClass(log)}>{log.idSender}</td>
                            <td className={getRowClass(log)}>{log.topic}</td>
                            <td className={getRowClass(log)}>{log.timestamp}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-controls">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
                    Previous
                </button>
                <span>Page {currentPage + 1} of {Math.ceil(logs.length / itemsPerPage)}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === Math.ceil(logs.length / itemsPerPage) - 1}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default LogsTable; 
