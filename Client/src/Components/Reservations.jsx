import React, { useEffect, useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDarkMode } from './Hooks/DarkModeContext';
import Cookies from 'js-cookie';
import sendNotification from './NotificationSender';

function Reservation() {
    const [reservationID, setReservationID] = useState(generateReservationID());
    const [reservationDate, setReservationDate] = useState('');
    const [noOfTables, setNoOfTables] = useState(1);
    const { isDarkMode } = useDarkMode();
    const [status, setStatus] = useState('Pending');
    const [loggedIn, setLoggedIn] = useState(false);

    const localhost = `http://localhost:4000`;

    useEffect(() => {
        // Check if user is logged in
        const token = Cookies.get('token');
        if (token) {
            setLoggedIn(true);
        } else {
            // Redirect to login page if token is not present
            window.location.href = '/login';
        }
    }, []);

    function generateReservationID() {
        const digits = '0123456789';
        let id = '';
        for (let i = 0; i < 4; i++) {
            id += digits[Math.floor(Math.random() * digits.length)];
        }
        return id;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = Cookies.get('token');
        try {
            // Send reservation data to the server
            const response = await fetch(`${localhost}/api/createReservation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify({ reservationID, reservationDate, noOfTables, status }),
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.message);
                sendNotification('reservation', 'Your Reservation has been placed!');
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            console.error('Error creating reservation:', error);
            toast.error('An error occurred while creating the reservation.');
        }
    };

    return (
        <Container className="mt-5 pt-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <div className={`p-5 container bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                        <h2 className="mb-4 text-center">Make a Reservation</h2>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="reservationID">
                                <Form.Label>Reservation ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={reservationID}
                                    readOnly
                                />
                            </Form.Group>

                            <Form.Group controlId="reservationDate">
                                <Form.Label>Reservation Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={reservationDate}
                                    onChange={(e) => setReservationDate(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="noOfTables">
                                <Form.Label>No. of Tables</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={noOfTables}
                                    onChange={(e) => setNoOfTables(parseInt(e.target.value))}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100 mt-4">
                                Submit Reservation
                            </Button>
                        </Form>
                        <ToastContainer />
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default Reservation;
