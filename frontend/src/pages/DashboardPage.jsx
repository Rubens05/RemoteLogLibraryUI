import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import PieChart from '../components/dashboarComponents/PieChart';
import LineChart from '../components/dashboarComponents/LineChart';
import BarChart from '../components/dashboarComponents/BarChart';
import '../App.css';

function DashboardPage() {
    const [backendData, setBackendData] = useState({ logs: [] });
    const [loading, setLoading] = useState(false);
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
        hourStart: 0, // default 00
        hourEnd: 23 // default 23
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


    // Fetch logs when filters change
    useEffect(() => {
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
            const queryString = `startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}&level=${level}&senderID=${senderID}&topic=${topic}&message=${message}&hourStart=${hourStart}&hourEnd=${hourEnd}`;
            fetch(`/api?${queryString}`)
                .then(response => response.json())
                .then(data => {
                    setBackendData(data);
                    setLoading(false);
                });

        }
    }, [filters]);

    const handleFiltersChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };



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
                    {/*TODO insert loader component*/}
                    {loading === true
                        ? (
                            <div className="toggle-controls">
                                <h2>Loading Dashboard...</h2>
                            </div>)
                        : (backendData.logs.length === 0
                            ? (<div className="toggle-controls">
                                <h2>No results found</h2>
                            </div>)
                            : (<div >
                                <div className="toggle-controls">
                                    {filters.startDate && filters.endDate
                                        // If the start and end date are set
                                        ? (filters.startDate.toISOString().split('T')[0] === filters.endDate.toISOString().split('T')[0]
                                            // Show the date if both dates are the same
                                            ? (<h2>Dashboarding logs of the day {backendData.logs[0].timestamp.split('T')[0]}</h2>)
                                            // Show the date range if both dates are set
                                            : (<h2>Dashboarding logs between latest found: {backendData.logs[backendData.logs.length - 1].timestamp.split('T')[0] + " "} and earliest found: {backendData.logs[0].timestamp.split('T')[0]}</h2>))
                                        // Show all logs if no date range is set
                                        : (<h2>Dashboarding all logs</h2>)}

                                </div>

                                <div className="dashboard-controls">
                                    <PieChart logs={backendData.logs} />
                                </div>
                                <div className="dashboard-controls">
                                    <BarChart logs={backendData.logs} />
                                </div>
                                <div className="dashboard-controls">
                                    <LineChart logs={backendData.logs} />
                                </div>
                            </div>


                            )
                        )
                    }
                </div>
            </div>

        </div >
    );
}


export default DashboardPage;

