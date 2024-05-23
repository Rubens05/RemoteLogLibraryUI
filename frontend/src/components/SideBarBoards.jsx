import React, { useState } from 'react';

const SideBar = ({ onFiltersChange, levelOptions, senderOptions, topicOptions, filters }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [key, setKey] = useState(0);
    const [level, setLevel] = useState('');
    const [senderID, setSenderID] = useState('');
    const [topic, setTopic] = useState('');
    const [hourStart, setHourStart] = useState("00:00");
    const [hourEnd, setHourEnd] = useState("23:59");

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

    const handleLevelChange = (e) => {
        const newLevel = e.target.value;
        setLevel(newLevel);
        onFiltersChange({ level: newLevel });
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

    const clearFilters = () => {
        setStartDate(null);
        setEndDate(null);
        setLevel('');
        setSenderID('');
        setTopic('');
        setHourStart("00:00");
        setHourEnd("23:59");

        setKey(prevKey => prevKey + 1);
        onFiltersChange({
            startDate: null,
            endDate: null,
            level: '',
            senderID: '',
            topic: '',
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
            <select id="level" name="level" value={level} onChange={handleLevelChange}>
                <option value="">Select...</option>
                {levelOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>

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

            <div className="pagination-controls">
                <button onClick={clearFilters}>Clear filters</button>
            </div>
        </div>
    );
}

export default SideBar;
