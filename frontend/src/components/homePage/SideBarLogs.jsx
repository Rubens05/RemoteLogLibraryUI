import React, { useState } from 'react';

const SideBarLogs = ({ onFiltersChange, levelOptions, senderOptions, topicOptions, filters }) => {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [key, setKey] = useState(0);
    const [levels, setLevels] = useState([]);
    const [senderIDs, setSenderIDs] = useState([]);
    const [topics, setTopics] = useState([]);
    const [message, setMessage] = useState('');
    const [hourStart, setHourStart] = useState("00:00");
    const [hourEnd, setHourEnd] = useState("23:59");
    const [dropdownOpen, setDropdownOpen] = useState({
        levels: false,
        senderIDs: false,
        topics: false
    });

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

    const handleSenderIDChange = (e) => {
        const selectedSenderID = e.target.value;
        let updatedSenderIDs;
        if (e.target.checked) {
            updatedSenderIDs = [...senderIDs, selectedSenderID];
        } else {
            updatedSenderIDs = senderIDs.filter(id => id !== selectedSenderID);
        }
        setSenderIDs(updatedSenderIDs);
        onFiltersChange({ senderIDs: updatedSenderIDs });
    };

    const handleTopicChange = (e) => {
        const selectedTopic = e.target.value;
        let updatedTopics;
        if (e.target.checked) {
            updatedTopics = [...topics, selectedTopic];
        } else {
            updatedTopics = topics.filter(topic => topic !== selectedTopic);
        }
        setTopics(updatedTopics);
        onFiltersChange({ topics: updatedTopics });
    };

    const toggleDropdown = (field) => {
        setDropdownOpen(prevState => ({
            ...prevState,
            [field]: !prevState[field]
        }));
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
        setStartDate(null);
        setEndDate(null);
        setLevels([]);
        setSenderIDs([]);
        setTopics([]);
        setMessage('');
        setHourStart("00:00");
        setHourEnd("23:59");

        setKey(prevKey => prevKey + 1);
        onFiltersChange({
            startDate: null,
            endDate: null,
            level: [],
            senderID: [],
            topic: [],
            message: '',
            hourStart: '00:00',
            hourEnd: '23:59'
        });

        setDropdownOpen({
            levels: false,
            senderIDs: false,
            topics: false
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
                <div className="dropdown-toggle" onClick={() => toggleDropdown('levels')}>
                    Select Levels
                </div>
                <div className={`dropdown-menu ${dropdownOpen.levels ? 'show' : ''}`}>
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
            <div className="dropdown">
                <div className="dropdown-toggle" onClick={() => toggleDropdown('senderIDs')}>
                    Select Sender IDs
                </div>
                <div className={`dropdown-menu ${dropdownOpen.senderIDs ? 'show' : ''}`}>
                    <div className="checkbox-group">
                        {senderOptions.map(option => (
                            <div key={option}>
                                <input
                                    type="checkbox"
                                    id={option}
                                    name="senderIDs"
                                    value={option}
                                    checked={senderIDs.includes(option)}
                                    onChange={handleSenderIDChange}
                                />
                                <label htmlFor={option}>{option}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <p>Topic</p>
            <div className="dropdown">
                <div className="dropdown-toggle" onClick={() => toggleDropdown('topics')}>
                    Select Topics
                </div>
                <div className={`dropdown-menu ${dropdownOpen.topics ? 'show' : ''}`}>
                    <div className="checkbox-group">
                        {topicOptions.map(option => (
                            <div key={option}>
                                <input
                                    type="checkbox"
                                    id={option}
                                    name="topics"
                                    value={option}
                                    checked={topics.includes(option)}
                                    onChange={handleTopicChange}
                                />
                                <label htmlFor={option}>{option}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

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

export default SideBarLogs;
