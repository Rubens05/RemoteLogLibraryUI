import React, { useState } from 'react';
import DateRangeFilter from './DateRangeFilter';

const SideBar = ({ onFiltersChange, levelOptions, senderOptions, topicOptions, filters }) => {
    const [level, setLevel] = useState('');
    const [senderID, setSenderID] = useState('');
    const [topic, setTopic] = useState('');
    const [message, setMessage] = useState('');
    const [hourStart, setHourStart] = useState("00:00");
    const [hourEnd, setHourEnd] = useState("23:59");
    const [dateFilterKey, setDateFilterKey] = useState(0);

    const handleDateRangeChange = (start, end) => {
        onFiltersChange({ startDate: start, endDate: end });
        if (start !== end) {
            setHourStart("00:00");
            setHourEnd("23:59");
            onFiltersChange({ startDate: start, endDate: end, hourStart: "00:00", hourEnd: "23:59" });
        }
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

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            submitMessageSearch();
        }
    };

    const handleBlur = () => {
        submitMessageSearch();
    };



    const submitMessageSearch = () => {

        onFiltersChange({ message: message.trim() });

    };

    const clearFilters = () => {
        setLevel('');
        setSenderID('');
        setTopic('');
        setMessage('');
        setHourStart("00:00");
        setHourEnd("23:59");
        setDateFilterKey(prevKey => prevKey + 1);

        onFiltersChange({
            startDate: null,
            endDate: null,
            level: '',
            senderID: '',
            topic: '',
            message: '',
            hourStart: '00:00',
            hourEnd: '23:59'
        });
    };



    return (
        <div>

            <div>
                <DateRangeFilter key={dateFilterKey} // Key to force re-render of DateRangeFilter
                    onDateRangeChange={handleDateRangeChange} />
            </div>

            {/* <div>
                <div>
                    <label htmlFor='dateStart'>Start Date: </label>
                    <input type='date' id='dateStart' name='dateStart' value={filters.startDate}
                        onChange={(e) => handleDateRangeChange(e.target.value, filters.endDate)} />
                </div>
                <div>
                    <label htmlFor='dateEnd'>End Date: </label>
                    <input type='date' id='dateEnd' name='dateEnd' value={filters.endDate}
                        onChange={(e) => handleDateRangeChange(filters.startDate, e.target.value)} />
                </div>
            </div> */}

            <div>
                <div>
                    <label htmlFor='hourStart'>Start Time: </label>
                    <input type='time' id='hourStart' name='hourStart' value={hourStart} max={hourEnd} min={"00:00"}
                        onChange={(e) => handleTimeChange(e, 'start')}
                        onKeyDown={(e) => { if (e.key === 'Enter') submitTimeChange('start'); }}
                        onBlur={() => submitTimeChange('start')}
                    />
                </div>
                <div>
                    <label htmlFor="hourEnd">End Time:</label>
                    <input type="time" id="hourEnd" name="hourEnd" value={hourEnd} max={"23:59"} min={hourStart}
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

            <p>Message</p>
            <input type="text" id="message" name="message" value={message}
                placeholder="Search by message"
                onChange={handleMessageChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur} />

            <div className="pagination-controls">

                <button onClick={clearFilters}>Clear filters</button>

            </div>


        </div>
    );
}

export default SideBar;
