import { useEffect, useState } from 'react';
import { Form, Button, Container, Col } from 'react-bootstrap';
import { useDarkMode } from '../Hooks/DarkModeContext';
import Cookies from 'js-cookie';
function Complaints() {

    //TODO : Have to beautify the complaint Page 
    const { isDarkMode } = useDarkMode();
    const [complaintType, setComplaintType] = useState('');
    const [complaintText, setComplaintText] = useState('');
    const apiUri = import.meta.env.VITE_REACT_APP_API_URL;
    const [LoggedIn, setLoggedIn] = useState(false)


    useEffect(() => {
        // Check if user is logged in
        const token = Cookies.get('token');
        console.log(token)
        if (token) {
            setLoggedIn(true);
        } else {
            window.location.href = '/login';
        }
    }, []);

    const handleTypeChange = (e) => {
        setComplaintType(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = Cookies.get('token');
            // Send complaint data to the server
            const response = await fetch(`${apiUri}api/addcomplaints`, {
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
        <Container className="pt-5 mt-5 d-flex justify-content-center align-items-center">
            <Col xs={12} md={8} lg={6}>
                <div className={`p-5 container bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''} rounded-5 shadow shadow-lg`}>
                    <h2 className="mb-4 text-center">Submit a Complaint</h2>
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
                                rows={5}
                                value={complaintText}
                                onChange={(e) => setComplaintText(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mt-3">
                            Submit Complaint
                        </Button>
                    </Form>
                </div>
            </Col>
        </Container>
    );
}

export default Complaints;
