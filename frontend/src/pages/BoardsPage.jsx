import React, { useEffect, useState } from 'react';
import SideBarBoards from '../components/SideBarBoards';
import LogCard from '../components/dashboarComponents/LogCard';
import Loader from '../components/Loader';
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
        filterInterval: '',
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
                console.log('Boards:', data.boards);
            })
            .catch(error => console.error('Error loading boards:', error));
    }, []);


    // Fetch logs when filters change and peridically fetch new logs
    useEffect(() => {
        const fetchLogs = async () => {

            const { startDate, endDate, level, senderID, topic, hourStart, hourEnd } = filters;
            console.log('Filters:', filters);
            const queryString = `startDate=${startDate}&endDate=${endDate}&level=${level}&senderID=${senderID}` +
                `&topic=${topic}&hourStart=${hourStart}&hourEnd=${hourEnd}`;

            try {
                setLoading(true);
                const response = await fetch(`/api?${queryString}`);
                const data = await response.json();
                setLoading(false)
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

    const handleAutoRefreshChange = () => {
        setAutoRefresh(!autoRefresh);
    }

    return (
        <div className='App'>

            <div className="App-sidebar">

                <div className="toggle-controls" >
                    <h1>| Filters |</h1>
                </div>

                <SideBarBoards
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
                            <div className="Loader-grid">
                                <Loader />
                            </div>
                        )
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
                                    ? <LogCard logs={backendData.logs} boardName={filters.senderID} filterStartDate={filters.startDate} filterEndDate={filters.endDate} filterInterval={filters.interval} />
                                    : boards.map(board => {

                                        // Filtra los logs por el idSender del board
                                        const filteredLogs = backendData.logs.filter(log => {
                                            if (log.idSender === board) {
                                                return true;
                                            }
                                        });

                                        console.log(`Logs for board ${board}:`, filteredLogs);
                                        return (
                                            <LogCard key={board} logs={filteredLogs} boardName={board} filterStartDate={filters.startDate} filterEndDate={filters.endDate} filterInterval={filters.interval} />
                                        );
                                    })
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

