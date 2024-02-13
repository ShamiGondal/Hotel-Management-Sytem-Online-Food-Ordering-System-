import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDarkMode } from './Hooks/DarkModeContext';
import Cookies from 'js-cookie';

function Complaints() {
    const { isDarkMode } = useDarkMode();
    const [complaintType, setComplaintType] = useState('');
    const [complaintText, setComplaintText] = useState('');
    const localhost = `http://localhost:4000`;

    const handleTypeChange = (e) => {
        setComplaintType(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = Cookies.get('token');
            // Send complaint data to the server
            const response = await fetch(`${localhost}/api/addcomplaints`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}` // Assuming token is stored in cookies
                },
                body: JSON.stringify({ ComplaintType: complaintType, ComplaintText: complaintText })
            });
            if (response.ok) {
                console.log('Complaint posted successfully');
                setComplaintType('');
                setComplaintText('');
            } else {
                // Error posting complaint
                console.error('Error posting complaint');
            }
        } catch (error) {
            console.error('Error posting complaint:', error);
        }
    };

    if (isDarkMode) {
        document.body.style.backgroundColor = 'black';
    } else {
        document.body.style.backgroundColor = 'white';
    }

    return (
       <div className="pt-5 mt-5 ">
         <div className={` p-5 mt-5 pt-5 container bg-${isDarkMode ? 'dark' : 'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''} rounded-5 shadow shadow-lg  `}>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="complaintType">
                    <Form.Label>Complaint Type</Form.Label>
                    <Form.Control
                        as="select"
                        value={complaintType}
                        onChange={handleTypeChange}
                        required
                    >
                        <option value="">Select complaint type</option>
                        <option value="Food">Food</option>
                        <option value="Website">Website</option>
                        <option value="Hotel">Hotel</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="complaintText">
                    <Form.Label>Complaint Text</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={complaintText}
                        onChange={(e) => setComplaintText(e.target.value)}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit Complaint
                </Button>
            </Form>
        </div>
       </div>
    );
}

export default Complaints;
