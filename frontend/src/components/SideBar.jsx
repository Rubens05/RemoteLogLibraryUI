import React, { useState } from 'react';
import DateRangeFilter from './DateRangeFilter';

const SideBar = ({ onFiltersChange }) => {
    const [level, setLevel] = useState('');
    const [senderID, setSenderID] = useState('');
    const [topic, setTopic] = useState('');
    const [message, setMessage] = useState('');
    const [hourStart, setHourStart] = useState(0);
    const [hourEnd, setHourEnd] = useState(23);

    // Handler for date range changes from DateRangeFilter
    const handleDateRangeChange = (start, end) => {
        onFiltersChange({ startDate: start, endDate: end });
    };

    // Handle changes in other filters (hourStart, hourEnd, Level...) and notify the parent component
    const handleHourStartChange = (e) => {
        const startVal = Math.min(parseInt(e.target.value, 10), hourEnd - 1);
        setHourStart(startVal);
        onFiltersChange({ hourStart: startVal });
    };

    const handleHourEndChange = (e) => {
        const endVal = Math.max(parseInt(e.target.value, 10), hourStart + 1);
        setHourEnd(endVal);
        onFiltersChange({ hourEnd: endVal });
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

    // Handle message changes
    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    // Handle Enter key press
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            submitMessageSearch();
        }
    };

    // Handle message blur
    const handleBlur = () => {
        submitMessageSearch();
    };

    // Submit message search
    const submitMessageSearch = () => {

        onFiltersChange({ message: message.trim() });

    };
    return (
        <div>
            <h1>Filters</h1>

            <p>Calendar</p>
            <DateRangeFilter onDateRangeChange={handleDateRangeChange} />

            <p>Hours Range</p>
            <div>
                <label htmlFor="hourStart">Start Hour:</label>
                <input type="number" id="hourStart" name="hourStart"
                    min="0" max="23" value={hourStart}
                    onChange={handleHourStartChange} />
            </div>
            <div>
                <label htmlFor="hourEnd">End Hour:</label>
                <input type="number" id="hourEnd" name="hourEnd"
                    min="0" max="23" value={hourEnd}
                    onChange={handleHourEndChange} />
            </div>

            <p>Level</p>
            <select id="level" name="level" value={level} onChange={handleLevelChange}>
                <option value="">Select...</option>
                <option value="ERROR">ERROR</option>
                <option value="WARNING">WARNING</option>
                <option value="INFO">INFO</option>
                <option value="DEBUG">DEBUG</option>
                <option value="CRITICAL">CRITICAL</option>
            </select>

            <p>Sender ID</p>
            <select id="senderID" name="senderID" value={senderID} onChange={handleSenderIDChange}>
                <option value="">Select...</option>
                <option value="SPACE">SPACE</option>
                <option value="MARS">MARS</option>
                <option value="CRYPTO">CRYPTO</option>
            </select>

            <p>Topic</p>
            <select id="topic" name="topic" value={topic} onChange={handleTopicChange}>
                <option value="">Select...</option>
                <option value="RASENGAN">RASENGAN</option>
                <option value="CAPITAL LETTERS TOPIC">CAPITAL LETTERS TOPIC</option>
                <option value="ANOTHER TOPIC">ANOTHER TOPIC</option>
            </select>

            <p>Message</p>
            <input type="text" id="message" name="message" value={message}
                placeholder="Search by message"
                onChange={handleMessageChange}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur} />
        </div>
    );
}

export default SideBar;
