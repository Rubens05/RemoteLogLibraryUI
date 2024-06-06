import React, { useState } from 'react';

const LogsTable = ({ logs, format, darkTheme }) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(16);
    const [useLocalTime, setUseLocalTime] = useState(false);
    const [sortDirection, setSortDirection] = useState('desc');
    const [columnWidths, setColumnWidths] = useState({
        level: 300,
        message: 600,
        senderID: 200,
        topic: 200,
        timestamp: 250
    });

    const [visibleColumns, setVisibleColumns] = useState({
        level: true,
        message: true,
        senderID: true,
        topic: true,
        timestamp: true
    });

    const toggleColumnVisibility = (column) => {
        setVisibleColumns(prev => ({
            ...prev,
            [column]: !prev[column]
        }));
    };

    const handleMouseDown = (colKey) => (event) => {
        const startX = event.clientX;
        const startWidth = columnWidths[colKey];

        const handleMouseMove = (e) => {
            const newWidth = Math.max(100, startWidth + (e.clientX - startX));
            setColumnWidths(prev => ({ ...prev, [colKey]: newWidth }));
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const toggleSortDirection = () => {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const sortedLogs = logs.sort((a, b) => {
        if (sortDirection === 'asc') {
            return new Date(a.timestamp) - new Date(b.timestamp);
        } else {
            return new Date(b.timestamp) - new Date(a.timestamp);
        }
    });

    const paginatedLogs = sortedLogs.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < Math.ceil(logs.length / itemsPerPage)) {
            setCurrentPage(newPage);
        }
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(0);
    };

    const toggleTimeFormat = () => {
        setUseLocalTime(!useLocalTime);
    };

    const getRowClass = (log) => {
        return format === 'colored' ? `log-level-${log.level}` : '';
    };

    const formatTimestamp = (timestamp) => {
        return useLocalTime ? new Date(timestamp).toLocaleString() : new Date(timestamp).toUTCString();
    };

    return (
        <div>


            <table className={`LogsTable ${darkTheme ? 'dark-theme' : 'light-theme'}`}>

                <thead>
                    <tr>
                        {Object.entries(visibleColumns).filter(([_, visible]) => visible).map(([column]) => (
                            <th key={column} style={{ width: `${columnWidths[column]}px`, position: 'relative' }}>
                                {column.charAt(0).toUpperCase() + column.slice(1)}

                                {column === 'timestamp' && (

                                    <span onClick={toggleSortDirection} style={{ cursor: 'pointer', position: 'relative' }}>
                                        {useLocalTime ? " Local " : " UTC "}
                                        {sortDirection === 'asc' ? ' ↑' : ' ↓'}
                                    </span>
                                )}

                                {column !== 'timestamp' && (<span
                                    className="resize-handle"

                                    onMouseDown={handleMouseDown(column)}
                                    style={{ cursor: 'ew-resize', position: 'absolute', right: '0', width: '10px', top: '0', bottom: '0' }}
                                />)}


                            </th>
                        ))}
                    </tr>
                </thead>


                <tbody>
                    {paginatedLogs.map((log) => (
                        <tr key={log.id}>
                            {visibleColumns.level && <td className={`${getRowClass(log)} td ellipsis`}>{log.level}</td>}
                            {visibleColumns.message && <td title={log.message} className={`${getRowClass(log)} td ellipsis`}>{log.message}</td>}
                            {visibleColumns.senderID && <td className={`${getRowClass(log)} td ellipsis`}>{log.idSender}</td>}
                            {visibleColumns.topic && <td className={`${getRowClass(log)} td ellipsis`}>{log.topic}</td>}
                            {visibleColumns.timestamp && <td className={`${getRowClass(log)} td ellipsis dateCell`}>{formatTimestamp(log.timestamp)}</td>}
                        </tr>
                    ))}

                </tbody>



            </table>

            <table className="LogsCheckbox">

                <thead>
                    <tr>
                        {Object.keys(visibleColumns).map((column) => (
                            <th key={column}>
                                <input
                                    type="checkbox"
                                    checked={visibleColumns[column]}
                                    onChange={() => toggleColumnVisibility(column)}
                                    style={{ marginRight: '5px' }}
                                />
                                {column.charAt(0).toUpperCase() + column.slice(1)}

                            </th>
                        ))}
                    </tr>
                </thead>
            </table>


            <div className="pagination-controls">
                <button onClick={() => handlePageChange(0)} disabled={currentPage === 0}>
                    First
                </button>
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
                    Previous
                </button>
                <span>Page {currentPage + 1} of {Math.ceil(logs.length / itemsPerPage)}</span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === Math.ceil(logs.length / itemsPerPage) - 1}>
                    Next
                </button>
                <button onClick={() => handlePageChange(Math.ceil(logs.length / itemsPerPage) - 1)} disabled={currentPage === Math.ceil(logs.length / itemsPerPage) - 1}>
                    Last
                </button>
                <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                    <option value="16">Items per page</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="500">500</option>
                </select>
                <button onClick={toggleTimeFormat}>
                    {useLocalTime ? "Switch to UTC" : "Switch to Local"}
                </button>
            </div>
        </div>
    );
};

export default LogsTable;
