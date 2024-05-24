import React, { useState } from 'react';

const SideBarBoards = ({ onFiltersChange, levelOptions, senderOptions, topicOptions, filters }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [key, setKey] = useState(0);
    const [levels, setLevels] = useState([]);
    const [senderID, setSenderID] = useState('');
    const [topic, setTopic] = useState('');
    const [interval, setInterval] = useState('');
    const [hourStart, setHourStart] = useState("00:00");
    const [hourEnd, setHourEnd] = useState("23:59");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleStartDateChange = (start) => {
        setStartDate(start);
        onFiltersChange({ startDate: start, endDate });
    };

    const handleEndDateChange = (end) => {
        setEndDate(end);
        onFiltersChange({ startDate, endDate: end });
    };

    const handleTimeChange = (e, type) => {
        const time = e.target.value;
        if (type === 'start') {
            setHourStart(time);
        } else {
            setHourEnd(time);
        }
    };

    const submitTimeChange = (type) => {
        const timeValue = type === 'start' ? hourStart : hourEnd;
        onFiltersChange({ [type === 'start' ? 'hourStart' : 'hourEnd']: timeValue });
    };

    const handleLevelsChange = (e) => {
        const selectedLevel = e.target.value;
        let updatedLevels;
        if (e.target.checked) {
            updatedLevels = [...levels, selectedLevel];
        } else {
            updatedLevels = levels.filter(level => level !== selectedLevel);
        }
        setLevels(updatedLevels);
        onFiltersChange({ levels: updatedLevels });
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleSenderIDChange = (e) => {
        const newSenderID = e.target.value;
        setSenderID(newSenderID);
        onFiltersChange({ senderID: newSenderID });
    };

    const handleTopicChange = (e) => {
        const newTopic = e.target.value;
        setTopic(newTopic);
        onFiltersChange({ topic: newTopic });
    };

    const handleIntervalChange = (e) => {
        const newInterval = e.target.value;
        setInterval(newInterval);
        onFiltersChange({ interval: newInterval });
    }


    const clearFilters = () => {
        setStartDate(null);
        setEndDate(null);
        setLevels([]);
        setSenderID('');
        setTopic('');
        setInterval('');
        setHourStart("00:00");
        setHourEnd("23:59");

        setKey(prevKey => prevKey + 1);
        onFiltersChange({
            startDate: null,
            endDate: null,
            levels: [],
            senderID: '',
            topic: '',
            interval: '',
            hourStart: '00:00',
            hourEnd: '23:59'
        });
    };



    return (
        <div>

            <div key={key}>
                <div>
                    <label htmlFor='dateStart'>Start Date: </label>
                    <input type='date' id='dateStart' name='dateStart' value={startDate} max={filters.endDate}
                        onChange={(e) => handleStartDateChange(e.target.value)} />
                </div>
                <div>
                    <label htmlFor='dateEnd'>End Date: </label>
                    <input type='date' id='dateEnd' name='dateEnd' value={endDate} min={filters.startDate}
                        onChange={(e) => handleEndDateChange(e.target.value)} />
                </div>
            </div>

            <div>
                <div>
                    <label htmlFor='hourStart'>Start Time: </label>
                    <input type='time' id='hourStart' name='hourStart' value={hourStart}
                        onChange={(e) => handleTimeChange(e, 'start')}
                        onKeyDown={(e) => { if (e.key === 'Enter') submitTimeChange('start'); }}
                        onBlur={() => submitTimeChange('start')}
                    />
                </div>
                <div>
                    <label htmlFor="hourEnd">End Time:</label>
                    <input type="time" id="hourEnd" name="hourEnd" value={hourEnd}
                        onChange={(e) => handleTimeChange(e, 'end')}
                        onKeyDown={(e) => { if (e.key === 'Enter') submitTimeChange('end'); }}
                        onBlur={() => submitTimeChange('end')}
                    />
                </div>
            </div>

            <p>Level</p>
            <div className="dropdown">
                <div className="dropdown-toggle" onClick={toggleDropdown}>
                    Select Levels
                </div>
                <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                    <div className="checkbox-group">
                        {levelOptions.map(option => (
                            <div key={option}>
                                <input
                                    type="checkbox"
                                    id={option}
                                    name="levels"
                                    value={option}
                                    checked={levels.includes(option)}
                                    onChange={handleLevelsChange}
                                />
                                <label htmlFor={option}>{option}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <p>Sender ID</p>
            <select id="senderID" name="senderID" value={senderID} onChange={handleSenderIDChange}>
                <option value="">Select...</option>
                {senderOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>

            <p>Topic</p>
            <select id="topic" name="topic" value={topic} onChange={handleTopicChange}>
                <option value="" >Select...</option>
                {topicOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>

            <p>Time Interval</p>
            <select id="interval" name="interval" value={interval} onChange={handleIntervalChange}>
                <option value="" >Select...</option>
                <option value="minute">Minute</option>
                <option value="hour">Hour</option>
                <option value="day">Day</option>
            </select>

            <div className="pagination-controls">
                <button onClick={clearFilters}>Clear filters</button>
            </div>
        </div>
    );
}

export default SideBarBoards;
