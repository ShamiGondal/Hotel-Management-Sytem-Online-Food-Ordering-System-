import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Card, CardContent, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Rating } from '@mui/material';
import { Container, Row, Col } from 'reactstrap';
import { useDarkMode } from './Hooks/DarkModeContext';

function Home() {
    const [userDetails, setUserDetails] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [payments, setPayments] = useState([]);
    const localhost = `http://localhost:4000`
    const { isDarkMode } = useDarkMode();
    useEffect(() => {
        const token = Cookies.get('token')
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        };

        fetch(`${localhost}/api/getCustomer`, { headers })
            .then(response => response.json())
            .then(data => setUserDetails(data))
            .catch(error => console.error('Error fetching Customer:', error));

        // Fetch user addresses
        fetch(`${localhost}/api/my-addresses`, { headers })
            .then(response => response.json())
            .then(data => setAddresses(data))
            .catch(error => console.error('Error fetching addresses:', error));

        // Fetch user orders
        fetch(`${localhost}/api/my-orders`, { headers })
            .then(response => response.json())
            .then(data => setOrders(data))
            .catch(error => console.error('Error fetching orders:', error));

        // Fetch user reservations
        fetch(`${localhost}/api/my-reservations`, { headers })
            .then(response => response.json())
            .then(data => setReservations(data))
            .catch(error => console.error('Error fetching reservations:', error));

        // Fetch user feedback
        fetch(`${localhost}/api/my-feedback`, { headers })
            .then(response => response.json())
            .then(data => setFeedback(data))
            .catch(error => console.error('Error fetching feedback:', error));

        // Fetch user complaints
        fetch(`${localhost}/api/my-complaints`, { headers })
            .then(response => response.json())
            .then(data => setComplaints(data))
            .catch(error => console.error('Error fetching complaints:', error));

        // Fetch user payments
        fetch(`${localhost}/api/my-payments`, { headers })
            .then(response => response.json())
            .then(data => setPayments(data))
            .catch(error => console.error('Error fetching payments:', error));
    }, []);

    if (isDarkMode) {
        document.body.style.backgroundColor = 'black';
    } else {
        document.body.style.backgroundColor = 'white';
    }

    return (
        <Container className={`mt-5 pt-5 `}>
            <Row>
                <Col>
                    <Card className={`mb-4 p-5 rounded-2 shadow bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                        <CardContent>
                            <Typography variant='h5' component='div'>Profile</Typography>
                            <List>
                                {Object.keys(userDetails).length > 0 && (
                                    <ListItem>
                                        <ListItemText primary={`${userDetails.FirstName}, ${userDetails.LastName}, ${userDetails.Email},${userDetails.Credits}`} />
                                    </ListItem>
                                )}
                            </List>

                        </CardContent>
                    </Card>
                    <Card className={`mb-4 p-5 rounded-2 shadow bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                        <CardContent>
                            <Typography variant='h5' component='div'>Addresses</Typography>
                            <List>
                                {addresses.map(address => (
                                    <ListItem key={address.id}>
                                        <ListItemText primary={`${address.PhoneNumber}, ${address.Address}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                    <Card className={`mb-4 p-5 rounded-2 shadow bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                        <CardContent>
                            <Typography variant='h5' component='div'>Orders</Typography>
                            <List>
                                {orders.map(order => (
                                    <ListItem key={order.id}>
                                        <ListItemText primary={`${order.OrderID}: ${order.OrderDate}: ${order.PaymentStatus}: ${order.TotalAmount}: ${order.Status}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                    <Card className={`mb-4 p-5 rounded-2 shadow bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                        <CardContent>
                            <Typography variant='h5' component='div'>Reservations</Typography>
                            <List>
                                {reservations.map(reservation => (
                                    <ListItem key={reservation.id}>
                                        <ListItemText primary={`${reservation.ReservationDate}: ${reservation.NoOfTables}: ${reservation.Status}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Col>
                <Col>
                    <Card className={`mb-4 p-5 rounded-2 shadow bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                        <CardContent>
                            <Typography variant='h5' component='div'>Feedback</Typography>
                            <List>
                                {feedback.map(feedback => (
                                    <ListItem key={feedback.id}>
                                        <ListItemText primary={`${feedback.Comment}: ${feedback.FoodRating} : ${feedback.ServiceRating}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                    <Card className={`mb-4 p-5 rounded-2 shadow bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                        <CardContent>
                            <Typography variant='h5' component='div'>Complaints</Typography>
                            <List>
                                {complaints.map(complaint => (
                                    <ListItem key={complaint.id}>
                                        <ListItemText primary={`${complaint.ComplaintText}: ${complaint.ComplaintType}: ${complaint.status}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                    <Card className={`mb-4 p-5 rounded-2 shadow bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                        <CardContent>
                            <Typography variant='h5' component='div'>Payments</Typography>
                            <List>
                                {Array.isArray(payments) && payments.map(payment => (
                                    <ListItem key={payment.id}>
                                        <ListItemText primary={`${payment.date}: ${payment.amount}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Home;
