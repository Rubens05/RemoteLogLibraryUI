import React, { useEffect, useState } from 'react';
import DashBoard from '../components/DashBoard';
import SideBar from '../components/SideBar';
import '../App.css';

function DashboardPage() {
    const [backendData, setBackendData] = useState({ logs: [] });
    const [loading, setLoading] = useState(false);
    const [format, setFormat] = useState('default'); // New state for formatting
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

    // Function to toggle the format
    const toggleFormat = () => {
        setFormat(format === 'default' ? 'colored' : 'default');
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
                                <p>No results found</p>
                            </div>)
                            : (<div >
                                <div className="toggle-controls">
                                    {filters.startDate && filters.endDate
                                        // TODO MAKE THE STYLES If the start and end date are set
                                        ? (filters.startDate.toISOString().split('T')[0] === filters.endDate.toISOString().split('T')[0]
                                            // Show the date if both dates are the same
                                            ? (<h2>FIXME Dashboarding logs of the day {filters.endDate.toISOString().split('T')[0]}</h2>)
                                            // Show the date range if both dates are set
                                            : (<h2>FIXME Dashboarding logs between {filters.startDate.toISOString().split('T')[0]} and {filters.endDate.toISOString().split('T')[0]}</h2>))
                                        // Show all logs if no date range is set
                                        : (<h2>Showing all logs</h2>)}

                                </div>

                                <DashBoard logs={backendData.logs} />
                            </div>)
                        )
                    }
                </div>
            </div>

        </div >
    );
}


export default DashboardPage;

