import React, { useEffect, useState } from 'react';
import SideBarBoards from '../components/boardsPage/SideBarBoards';
import LogCard from '../components/boardsPage/LogCard';
import Loader from '../components/common/Loader';
import '../App.css';


function BoardsPage() {
    const [backendData, setBackendData] = useState({ logs: [] });
    const [loading, setLoading] = useState(false);
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
        senderIDs: [],
        topics: [],
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
    }, []);


    // Fetch logs when filters change and peridically fetch new logs
    useEffect(() => {
        const fetchLogs = async () => {
            const { startDate, endDate, levels, senderIDs, topics, message, hourStart, hourEnd } = filters;
            console.log('Filters:', filters);
            const queryString = `startDate=${startDate}&endDate=${endDate}&level=${levels}&senderID=${senderIDs}` +
                `&topic=${topics}&hourStart=${hourStart}&hourEnd=${hourEnd}`;

            try {
                setLoading(true);
                let response;
                let data;

                if (initialFetch) {
                    response = await fetch(`/api?${queryString}`);
                    data = await response.json();
                    setBackendData(data);
                    if (data.logs.length > 0) {
                        console.log("Initial logs fetched:", data.logs);
                        setLastFetchTime(data.logs[0].timestamp);
                    }
                    setInitialFetch(false);
                } else if (autoRefresh) {
                    response = await fetch(`/api?${queryString}&lastTimestamp=${lastFetchTime}&autoRefresh=${autoRefresh}`);
                    data = await response.json();
                    if (data.logs.length > 0) {
                        setBackendData(prev => ({ logs: [...data.logs, ...prev.logs] }));
                        console.log('New logs fetched:', data.logs);
                        setLastFetchTime(data.logs[0].timestamp);
                    }
                }
            } catch (error) {
                console.error('Error fetching logs:', error);
            } finally {
                setLoading(false);
            }
        };

        if (initialFetch) {
            fetchLogs();
        }

        let interval;
        if (autoRefresh) {
            interval = setInterval(fetchLogs, 10000); // Fetch new logs every 10 seconds
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [filters, autoRefresh, initialFetch, lastFetchTime]);


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
                                        : (<h2>Showing all logs</h2>)}

                                    <button title='Change autorefresh mode' onClick={handleAutoRefreshChange}>
                                        {autoRefresh ? "Auto Refresh [ON]" : "Auto Refresh [OFF]"}</button>
                                </div>

                                {/* Make a card for each board*/}
                                {!filters.senderIDs && filters.senderIDs.length === 0
                                    ? <LogCard logs={backendData.logs} boardName={filters.senderIDs} filterStartDate={filters.startDate} filterEndDate={filters.endDate} filterInterval={filters.interval} />
                                    : senderOptions.map(board => {

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

