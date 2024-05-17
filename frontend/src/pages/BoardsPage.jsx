import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import LogCard from '../components/dashboarComponents/LogCard';
import '../App.css';


function BoardsPage() {
    const [backendData, setBackendData] = useState({ logs: [] });
    const [loading, setLoading] = useState(false);
    const [lastFetchTime, setLastFetchTime] = useState(null);
    const [autoRefresh, setAutoRefresh] = useState(false); // Default autorefresh off
    const [initialFetch, setInitialFetch] = useState(true); // Initial fetch to get the logs, and handle filters change
    const [boards, setBoards] = useState([]); // New state for boards
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

        // Fetch the list of boards
        fetch('/api/boards')
            .then(response => response.json())
            .then(data => {
                setBoards(data.boards);
            })
            .catch(error => console.error('Error loading boards:', error));
    }, []);


    // Fetch logs when filters change and peridically fetch new logs
    useEffect(() => {
        const fetchLogs = () => {
            setLoading(true);

            const { startDate, endDate, level, senderID, topic, message, hourStart, hourEnd } = filters;
            console.log('Filters:', filters);
            const queryString = `startDate=${startDate}&endDate=${endDate}&level=${level}&senderID=${senderID}` +
                `&topic=${topic}&message=${message}&hourStart=${hourStart}&hourEnd=${hourEnd}`;

            fetch(`/api?${queryString}`)
                .then(response => response.json())
                .then(data => {
                    setBackendData(data);
                    if (data.logs.length > 0) {
                        setLastFetchTime(data.logs[0].timestamp);
                    }
                });

            if (autoRefresh) {
                fetch(`/api/new?lastTimestamp=${lastFetchTime}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.logs.length > 0) {
                            setBackendData(prev => ({ logs: [...data.logs, ...prev.logs] }));
                            setLastFetchTime(data.logs[0].timestamp);
                        }

                    });
            }


            if (backendData.logs.length > 0 && initialFetch === false && autoRefresh === false) {
                setLastFetchTime(backendData.logs[0].timestamp)
            }

            setLoading(false);

        };

        if (initialFetch) {
            fetchLogs();
            setInitialFetch(false);
        }

        let flag = false;
        if (autoRefresh === true) {
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

    const handleAutoRefreshChange = () => {
        setAutoRefresh(!autoRefresh);
    }

    return (
        <div className='App'>

            <div className="App-sidebar">

                <div className="toggle-controls" >
                    <h1>| Filters |</h1>
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
                    {/*TODO insert loader component*/}
                    {loading === true
                        ? (
                            <div className="toggle-controls">
                                <h2>Loading Boards...</h2>
                            </div>)
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
                                    {filters.startDate && filters.endDate
                                        // If the start and end date are set
                                        ? (filters.startDate === filters.endDate
                                            // Show the date if both dates are the same
                                            ? (<h2>Showing logs of the day {backendData.logs[0].timestamp.split('T')[0]}</h2>)
                                            // Show the date range if both dates are set
                                            : (<h2>Showing logs between latest found:
                                                {backendData.logs[backendData.logs.length - 1].timestamp.split('T')[0] + " "}
                                                and earliest found: {backendData.logs[0].timestamp.split('T')[0]}</h2>))
                                        // Show all logs if no date range is set
                                        : (filters.senderID ? <h2>Showing logs from {filters.senderID}</h2> : <h2>Showing logs from all boards</h2>)}

                                    <button title='Change autorefresh mode' onClick={handleAutoRefreshChange}>
                                        {autoRefresh ? "Auto Refresh [ON]" : "Auto Refresh [OFF]"}</button>
                                </div>

                                {/* Make a card for each board*/}

                                {filters.senderID
                                    ? <LogCard logs={backendData.logs} boardName={filters.senderID} />
                                    : boards.map(board => (
                                        <LogCard key={board.id} logs={backendData.logs.filter(log => log.boardId === board.id)} boardName={board} />
                                    ))
                                }

                            </div>


                            )
                        )
                    }
                </div>
            </div>

        </div >
    );
}


export default BoardsPage;

