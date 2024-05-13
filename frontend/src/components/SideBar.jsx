import React, { useState } from 'react';
import DateRangeFilter from './DateRangeFilter';

const SideBar = ({ onFiltersChange, levelOptions, senderOptions, topicOptions, filters }) => {
    const [level, setLevel] = useState('');
    const [senderID, setSenderID] = useState('');
    const [topic, setTopic] = useState('');
    const [message, setMessage] = useState('');
    const [hourStart, setHourStart] = useState(0);
    const [hourEnd, setHourEnd] = useState(23);

    const [dateFilterKey, setDateFilterKey] = useState(0);

    const handleDateRangeChange = (start, end) => {
        onFiltersChange({ startDate: start, endDate: end });
        if (start !== end) {
            setHourStart(0);
            setHourEnd(23);
            onFiltersChange({ startDate: start, endDate: end, hourStart: 0, hourEnd: 23 });
        }
    };



    const handleHourStartChange = (e) => {
        setHourStart(e.target.value);
    };

    const handleHourEndChange = (e) => {
        setHourEnd(e.target.value);
    };

    const submitHourStart = () => {
        const hour = parseInt(hourStart, 10);
        if (!isNaN(hour) && hour >= 0 && hour <= 23) {
            setHourStart(hour);
            onFiltersChange({ hourStart: hour });
        }
    };

    const submitHourEnd = () => {
        const hour = parseInt(hourEnd, 10);
        if (!isNaN(hour) && hour >= 0 && hour <= 23) {
            setHourEnd(hour);
            onFiltersChange({ hourEnd: hour });
        }
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
        setHourStart(0);
        setHourEnd(23);
        setDateFilterKey(prevKey => prevKey + 1);

        onFiltersChange({
            startDate: null,
            endDate: null,
            level: '',
            senderID: '',
            topic: '',
            message: '',
            hourStart: 0,
            hourEnd: 23
        });
    };



    return (
        <div>

            <div>
                <DateRangeFilter key={dateFilterKey} // Key to force re-render of DateRangeFilter
                    onDateRangeChange={handleDateRangeChange} />
            </div>
            {console.log(filters.startDate, filters.endDate)}
            {(filters.startDate && filters.endDate && (filters.startDate.toISOString().split('T')[0] === filters.endDate.toISOString().split('T')[0]))
                ? (<div>
                    <div>
                        <label htmlFor='hourStart'>Start Hour: </label>
                        <input type='number' id='hourStart' name='hourStart' min='0' max='23' value={hourStart} disabled={false}
                            onChange={handleHourStartChange}
                            onKeyDown={(e) => { if (e.key === 'Enter') submitHourStart(); }}
                            onBlur={submitHourStart}
                        />
                        {console.log(hourStart)}



                    </div>
                    <div>
                        <label htmlFor="hourEnd">End Hour:</label>
                        <input type="number" id="hourEnd" name="hourEnd" min="0" max="23" value={hourEnd} disabled={false}
                            onChange={handleHourEndChange}
                            onKeyDown={(e) => { if (e.key === 'Enter') submitHourEnd(); }}
                            onBlur={submitHourEnd}
                        />
                        {console.log(hourEnd)}

                    </div>
                </div>

                )
                : (<div>
                    <div>
                        <label htmlFor='hourStart'>Start Hour: </label>
                        <input type='text' id='hourStart' name='hourStart' value="Select single day" disabled={true} />
                    </div>
                    <div>
                        <label htmlFor="hourEnd">End Hour:</label>
                        <input type="text" id="hourEnd" name="hourEnd" value="Select single day" disabled={true} />
                    </div>
                </div>)
            }

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
