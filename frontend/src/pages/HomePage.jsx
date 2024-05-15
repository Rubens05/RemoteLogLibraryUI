import React, { useEffect, useState } from 'react';
import LogsTable from '../components/LogsTable';
import SideBar from '../components/SideBar';
import '../App.css';

function HomePage() {
    const [backendData, setBackendData] = useState({ logs: [] });
    const [loading, setLoading] = useState(false);
    const [format, setFormat] = useState('default'); // New state for formatting
    const [lastFetchTime, setLastFetchTime] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(false); // Default autorefresh off
    const [initialFetch, setInitialFetch] = useState(true); // Initial fetch to get the logs, and handle filters change
    const [levelOptions, setLevelOptions] = useState([]);
    const [senderOptions, setSenderOptions] = useState([]);
    const [topicOptions, setTopicOptions] = useState([]);
    const [filters, setFilters] = useState({
        startDate: null,
        endDate: null,
        level: '',
        senderID: '',
        topic: '',
        message: '',
        hourStart: '00:00', // default 00
        hourEnd: '23:59' // default 23
    });

    // Initial fetch to get the filter options
    useEffect(() => {
        fetch('/api/filters')
            .then(response => response.json())
            .then(data => {
                setLevelOptions(data.levelOptions);
                setSenderOptions(data.senderOptions);
                setTopicOptions(data.topicOptions);
            })
            .catch(error => console.error('Error loading filter options:', error));
    }, []);


    // Fetch logs when filters change and peridically fetch new logs
    useEffect(() => {
        const fetchLogs = () => {
            setLoading(true);

            const { startDate, endDate, level, senderID, topic, message, hourStart, hourEnd } = filters;

            if (!startDate && !endDate) {
                const queryString = `level=${level}&senderID=${senderID}&topic=${topic}&message=${message}&hourStart=${hourStart}&hourEnd=${hourEnd}`;
                fetch(`/api?${queryString}`)
                    .then(response => response.json())
                    .then(data => {
                        setBackendData(data);
                        setLoading(false);

                    });
            } else {
                const queryString = `startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}
            &level=${level}&senderID=${senderID}&topic=${topic}&message=${message}&hourStart=${hourStart}&hourEnd=${hourEnd}`;
                fetch(`/api?${queryString}`)
                    .then(response => response.json())
                    .then(data => {
                        setBackendData(data);
                        setLoading(false);

                    });

            }

            if (backendData.logs.length > 0) {
                setLastFetchTime(backendData.logs[0].timestamp)
            }
        };

        if (initialFetch) {
            console.log('Initial fetch');
            fetchLogs();
            setInitialFetch(false);
        }

        let flag = false;
        if (autoRefresh === true) {
            console.log('Auto refresh');
            flag = true;
            fetchLogs();
        }

        if (flag) {
            const interval = setInterval(fetchLogs, 10000); // Fetch new logs every 5 minutes
            return () => clearInterval(interval);
        }


    }, [filters, autoRefresh]);

    const handleFiltersChange = (newFilters) => {
        setInitialFetch(true);
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    // Function to toggle the format
    const toggleFormat = () => {
        setFormat(format === 'default' ? 'colored' : 'default');
    };

    const handleAutoRefreshChange = () => {
        setAutoRefresh(!autoRefresh);
    }


    return (
        <div className='App'>

            <div className="App-sidebar">

                <div className="toggle-controls" >
                    <h1>Filters</h1>
                </div>

                <SideBar
                    onFiltersChange={handleFiltersChange}
                    levelOptions={levelOptions}
                    senderOptions={senderOptions}
                    topicOptions={topicOptions}
                    filters={filters}
                />
            </div>

            <div>
                <div className='App-logs'>
                    {/* Show the loading message if the logs are being fetched */}
                    {/*TODO insert loader component*/}
                    {loading === true
                        ? (
                            <div className="toggle-controls">
                                <h2>Loading Logs...</h2>
                            </div>)
                        : (backendData.logs.length === 0
                            ? (
                                <div className="toggle-controls">
                                    <h2>No results found</h2>
                                </div>)
                            : (<div >
                                <div className="toggle-controls">
                                    {filters.startDate && filters.endDate
                                        // If the start and end date are set
                                        ? (filters.startDate.toISOString().split('T')[0] === filters.endDate.toISOString().split('T')[0]
                                            // Show the date if both dates are the same

                                            ? (<h2>Showing logs of the day {backendData.logs[0].timestamp.split('T')[0]}</h2>)
                                            // Show the date range if both dates are set
                                            : (<h2>Showing logs between latest found: {backendData.logs[backendData.logs.length - 1].timestamp.split('T')[0] + " "}
                                                and earliest found: {backendData.logs[0].timestamp.split('T')[0]} </h2>))
                                        // Show all logs if no date range is set
                                        : (<h2>Showing all logs</h2>)}

                                    <button title='Change log colors' onClick={toggleFormat}>
                                        {format === "default" ? "Log format [Default]" : "Log format [Colored]"}</button>
                                    <div className="toggle-controls">

                                        <button title='Change autorefresh mode' onClick={handleAutoRefreshChange}>
                                            {autoRefresh ? "Auto Refresh [ON]" : "Auto Refresh [OFF]"}
                                        </button>
                                    </div>

                                </div>
                                <LogsTable logs={backendData.logs} format={format} />
                            </div>)
                        )
                    }
                </div>
            </div>

        </div >
    );
}


export default HomePage;

