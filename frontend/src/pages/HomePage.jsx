import React, { useEffect, useState } from 'react';
import LogsTable from '../components/homePage/LogsTable';
import SideBarLogs from '../components/homePage/SideBarLogs';
import Loader from '../components/common/Loader';
import '../App.css';

function HomePage() {
    const [backendData, setBackendData] = useState({ logs: [] });
    const [loading, setLoading] = useState(false);
    const [format, setFormat] = useState('default'); // New state for formatting
    const [darkTheme, setDarkTheme] = useState(false);
    const [lastFetchTime, setLastFetchTime] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(false); // Default autorefresh off
    const [initialFetch, setInitialFetch] = useState(true); // Initial fetch to get the logs, and handle filters change
    const [levelOptions, setLevelOptions] = useState([]);
    const [senderOptions, setSenderOptions] = useState([]);
    const [topicOptions, setTopicOptions] = useState([]);
    const [filters, setFilters] = useState({
        startDate: null,
        endDate: null,
        levels: [],
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
        const fetchLogs = async () => {
            setLoading(true);

            const { startDate, endDate, levels, senderID, topic, message, hourStart, hourEnd } = filters;
            console.log('Filters:', filters);
            const queryString = `startDate=${startDate}&endDate=${endDate}&level=${levels}&senderID=${senderID}` +
                `&topic=${topic}&message=${message}&hourStart=${hourStart}&hourEnd=${hourEnd}`;

            try {
                const response = await fetch(`/api?${queryString}`);
                const data = await response.json();
                setBackendData(data);
                if (data.logs.length > 0) {
                    console.log("Logs fetched:", data.logs);
                    setLastFetchTime(data.logs[0].timestamp);
                }

                if (autoRefresh) {
                    const newResponse = await fetch(`/api/new?lastTimestamp=${lastFetchTime}&hourStart=${hourStart}&hourEnd=${hourEnd}`);
                    const newData = await newResponse.json();
                    console.log('New logs:', newData);
                    if (newData.logs.length > 0) {
                        setBackendData(prev => ({ logs: [...newData.logs, ...prev.logs] }));
                        setLastFetchTime(newData.logs[0].timestamp);
                    }
                }

                if (backendData.logs.length > 0 && initialFetch === false && autoRefresh === false) {
                    console.log('Last fetch time:', backendData.logs[0].timestamp);
                    setLastFetchTime(backendData.logs[0].timestamp);
                }
            } catch (error) {
                console.error('Error fetching logs:', error);
            } finally {
                setLoading(false);
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
        setDarkTheme(!darkTheme);
        setFormat(format === 'default' ? 'colored' : 'default');
    };

    const handleAutoRefreshChange = () => {
        setAutoRefresh(!autoRefresh);
    }


    return (
        <div className='App'>

            <div className="App-sidebar">

                <div className="toggle-controls" >
                    <h1>| Filters |</h1>
                </div>

                <SideBarLogs
                    onFiltersChange={handleFiltersChange}
                    levelOptions={levelOptions}
                    senderOptions={senderOptions}
                    topicOptions={topicOptions}
                    filters={filters}
                />
            </div>

            <div>
                <div className='App-logs'>
                    {(loading === true && autoRefresh === false)
                        ? (
                            <Loader />)


                        : (backendData.logs.length === 0
                            ? (

                                <div className="toggle-controls">
                                    <h2>No results found</h2>

                                    <div className='toggle-controls'>
                                        <div className="toggle-controls">

                                            <button title='Change autorefresh mode' onClick={handleAutoRefreshChange}>
                                                {autoRefresh ? "Auto Refresh [ON]" : "Auto Refresh [OFF]"}</button>
                                        </div>
                                    </div>

                                </div>)
                            : (<div >
                                <div className="toggle-controls">
                                    {console.log(filters.startDate, filters.endDate)}
                                    {filters.startDate && filters.endDate
                                        // If the start and end date are set
                                        ? (filters.startDate === filters.endDate
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
                                            {autoRefresh ? "Auto Refresh [ON]" : "Auto Refresh [OFF]"}</button>
                                    </div>

                                </div>
                                <LogsTable logs={backendData.logs} format={format} darkTheme={darkTheme} />
                            </div>)
                        )
                    }
                </div>
            </div>

        </div >
    );
}


export default HomePage;

