import React, { useState } from 'react';
import '../App.css';
function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        country: '',
        age: '',
        subject: '',
        message: '',
        otherInfo: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formId = 'mayrvpbj';  // TODO Sacar a .env
        const url = `https://formspree.io/f/${formId}`;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            alert('Thanks for your submission!');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: '',
                country: '',
                age: '',
                otherInfo: ''
            });
        } else {
            alert('There was a problem with your submission. Please try again.');
        }
    };

    return (
        <div className="contact-form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name*</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email*</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <input type="text" id="country" name="country" value={formData.country} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="age">Age</label>
                    <input type="number" id="age" name="age" value={formData.age} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="otherInfo">Other info</label>
                    <input type="text" id="otherInfo" name="otherInfo" value={formData.otherInfo} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="subject">Subject*</label>
                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label htmlFor="message">Message*</label>
                    <input id="message" name="message" value={formData.message} onChange={handleChange} required />
                </div>
                <button type="submit" className="send-button">Send Message!</button>
            </form>
        </div>
    );
}

export default ContactForm;
