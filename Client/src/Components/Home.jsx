import { useEffect, useState } from 'react';
import { Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Typography, Drawer, IconButton, Table } from '@mui/material';
import { Label } from 'reactstrap';
import { useDarkMode } from './Hooks/DarkModeContext';
import Cookies from 'js-cookie';

import { Button } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';



function Home() {
    const [userDetails, setUserDetails] = useState({});
    const [addresses, setAddresses] = useState([]);
    const [orders, setOrders] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [payments, setPayments] = useState([]);
    const localhost = `http://localhost:4000`;
    const { isDarkMode } = useDarkMode();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState('Profile');
    // const { isDarkMode } = useDarkMode();
    // const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setSidebarOpen(false);
    };



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

        fetch(`${localhost}/api/my-addresses`, { headers })
            .then(response => response.json())
            .then(data => setAddresses(data))
            .catch(error => console.error('Error fetching addresses:', error));

        fetch(`${localhost}/api/my-orders`, { headers })
            .then(response => response.json())
            .then(data => setOrders(data))
            .catch(error => console.error('Error fetching orders:', error));

        fetch(`${localhost}/api/my-reservations`, { headers })
            .then(response => response.json())
            .then(data => setReservations(data))
            .catch(error => console.error('Error fetching reservations:', error));

        fetch(`${localhost}/api/my-feedback`, { headers })
            .then(response => response.json())
            .then(data => setFeedback(data))
            .catch(error => console.error('Error fetching feedback:', error));

        fetch(`${localhost}/api/my-complaints`, { headers })
            .then(response => response.json())
            .then(data => {
                console.log('complaints data:', data);
                setComplaints(data)
            })
            .catch(error => console.error('Error fetching complaints:', error));

        fetch(`${localhost}/api/my-payments`, { headers })
            .then(response => response.json())
            .then(data => {
                console.log('Payments data:', data); // Log the payments data
                setPayments(data.payments);
            })
            .catch(error => console.error('Error fetching payments:', error));
    }, []);

    if (isDarkMode) {
        document.body.style.backgroundColor = 'black';
    } else {
        document.body.style.backgroundColor = 'white';
    }

    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleUpload = async () => {
        const formData = new FormData();
        formData.append('image', image);
        const token = Cookies.get('token')
        await fetch('http://localhost:4000/api/uploadImage', {
            method: 'POST',
            headers: {
                'Authorization': `${token}` // Assuming token is stored in cookies
            },
            body: formData
        });

        alert('Image uploaded successfully');
    };

    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const token = Cookies.get('token')
                const response = await fetch('http://localhost:4000/api/my-Image', {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`
                    }
                }); // Assuming user ID is 1
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                setImageSrc(imageUrl);
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImage();
    }, []);




    return (
        <div className="">
            <div className="container-fluid ">
                <div className="row">
                    <div className={`col-md-3 sidebar ${sidebarOpen ? 'open' : 'closed'} bg-${isDarkMode ? "dark" : "light"}`}>
                        <Button className="toggle-btn  " onClick={toggleSidebar}>
                            {sidebarOpen ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-arrow-right-from-bracket"></i>}

                        </Button>
                        <ul className="list-group">
                            <li className="list-group-item" onClick={() => handleItemClick('Profile')}>
                                <i className="fa-solid fa-user"></i> Profile
                            </li>
                            <li className="list-group-item" onClick={() => handleItemClick('Orders')}>
                                <script src="https://cdn.lordicon.com/lordicon.js"></script>
                                <i className="fa-brands fa-first-order"></i> Orders
                            </li>
                            <li className="list-group-item" onClick={() => handleItemClick('Reservations')}>
                                <script src="https://cdn.lordicon.com/lordicon.js"></script>
                                <i className="fa-solid fa-book"></i> Reservations
                            </li>
                            <li className="list-group-item" onClick={() => handleItemClick('FeedBacks')}>
                                <i className="fa-regular fa-comment"></i> FeedBacks
                            </li>
                            <li className="list-group-item" onClick={() => handleItemClick('Complaints')}>
                                <i className="fa-brands fa-cuttlefish"></i>  Complaints
                            </li>
                            <li className="list-group-item" onClick={() => handleItemClick('Payment-History')}>
                                <i className="fa-brands fa-paypal"></i>  Payments
                            </li>

                        </ul>
                    </div>
                    <div className={`${sidebarOpen ? 'col-md-8' : 'col-md-10'} col-10 mt-5`}>
                        <div className="position-relative">
                            {selectedItem === 'Profile' && (
                                <div className="mt-5">
                                    <h2 className={` text-${isDarkMode ? 'light' : 'dark'} mb-3`}>{selectedItem}</h2>
                                    <Card className={`mb-4 p-2 rounded-2 shadow bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''} mb-5`}>
                                        <CardContent>
                                            <Typography variant='h5' component='div' className='fw-bolder fs-4'>Contact Information</Typography>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <List>
                                                        {Object.keys(userDetails).length > 0 && (
                                                            <>
                                                                <ListItem>
                                                                    <ListItemText primary={`First Name: ${userDetails.FirstName}`} />
                                                                </ListItem>
                                                                <ListItem>
                                                                    <ListItemText primary={`Last Name: ${userDetails.LastName}`} />
                                                                </ListItem>
                                                                <ListItem>
                                                                    <ListItemText primary={`Email: ${userDetails.Email}`} />
                                                                </ListItem>
                                                                <ListItem>
                                                                    <ListItemText primary={`Credits: ${userDetails.Credits}`} />
                                                                </ListItem>
                                                            </>
                                                        )}
                                                    </List>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="d-flex justify-content-center">
                                                        <img src={imageSrc} alt="User Image" className="img-fluid" style={{ maxHeight: '200px', maxWidth: '200px' }} />
                                                    </div>
                                                    <div className="d-flex justify-content-center">
                                                        <input type="file" onChange={handleImageChange} className="form-control mt-3" style={{ width: '80%' }} />
                                                    </div>
                                                    <div className="d-flex justify-content-center">
                                                        <button onClick={handleUpload} className='btn btn-primary mt-3' style={{ width: '50%' }}>Upload Image</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="table-responsive mt-5">
                                                <table className={`table table-${isDarkMode ? 'dark' : 'light'}`}>
                                                    <thead>
                                                        <tr>
                                                            <th>Phone Number</th>
                                                            <th>Address</th>
                                                            <th>Edit</th>
                                                            <th>Remove</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(addresses) && addresses.map(address => (
                                                            <tr key={address.id}>
                                                                <td>{address.PhoneNumber}</td>
                                                                <td>{address.Address}</td>
                                                                <td><button className='btn btn-primary'>Edit</button></td>
                                                                <td><button className='btn btn-danger'>Remove</button></td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {selectedItem === 'Payment-History' && (
                                <div className="mt-5">
                                    <h2 className={` text-${isDarkMode ? 'light' : 'dark'}`}>{selectedItem}</h2>
                                    <div className="table-responsive">
                                        <table className={`table table-${isDarkMode ? 'dark' : 'light'}`}>
                                            <thead>
                                                <tr>
                                                    <th>OrderID</th>
                                                    <th>Date</th>
                                                    <th>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {payments.map(payment => (
                                                    <tr key={payment.PaymentID}>
                                                        <td>{payment.OrderID}</td>
                                                        <td>{new Date(payment.PaymentDate).toLocaleString()}</td>
                                                        <td>${payment.Amount}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}



                            {selectedItem === 'Orders' && (
                                <div className="mt-5">
                                    <h2 className={` text-${isDarkMode ? 'light' : 'dark'}`}>{selectedItem}</h2>
                                    <div className=" table-responsive">
                                        <Card className={`mb-4 p-5 rounded-2 shadow bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                                            <CardContent>
                                                <Typography variant='h5' component='div' className='mb-3 fw-bold '>Orders Status</Typography>
                                                <table className={`table table-${isDarkMode ? 'dark' : 'light'}`}>
                                                    <thead>
                                                        <tr>
                                                            <th>Order ID</th>
                                                            <th>Order Date</th>
                                                            <th>Payment Status</th>
                                                            <th>Total Amount</th>
                                                            <th>Status</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {orders.map(order => (
                                                            <tr key={order.id}>
                                                                <td>{order.OrderID}</td>
                                                                <td>{order.OrderDate}</td>
                                                                <td className={`bg-${order.Status === 'Pending' ? 'primary' : order.Status === 'Confirmed' ? 'green' : 'danger'}`}>{order.PaymentStatus}</td>
                                                                <td>{order.TotalAmount}</td>
                                                                <td className={`bg-${order.Status === 'Pending' ? 'primary' : order.Status === 'Confirmed' ? 'green' : 'danger'}`}>
                                                                    {order.Status}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            )}
                            {selectedItem === 'Reservations' && (
                                <div className="mt-5">
                                    <h2 className={` text-${isDarkMode ? 'light' : 'dark'}`}>{selectedItem}</h2>

                                    <Card className={`mb-4 p-5 rounded-2 shadow bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                                        <CardContent>
                                            <Typography variant='h5' component='div'>Status</Typography>
                                            <table className={`table table-${isDarkMode ? 'dark' : 'light'}`}>
                                                <thead>
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Time</th>
                                                        <th>No of Tables</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {reservations.map(reservation => {
                                                        const reservationDate = new Date(reservation.ReservationDate);
                                                        const date = reservationDate.toLocaleDateString(); // Format date
                                                        const time = reservationDate.toLocaleTimeString(); // Format time
                                                        return (
                                                            <tr key={reservation.id}>
                                                                <td>{date}</td>
                                                                <td>{time}</td>
                                                                <td>{reservation.NoOfTables}</td>
                                                                <td className={`bg-${reservation.Status === 'Pending' ? 'primary' : reservation.Status === 'Confirmed' ? 'green' : 'danger'} text-light  fw-bold `}
                                                                >{reservation.Status}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </CardContent>
                                    </Card>

                                </div>

                            )}
                            {selectedItem === 'Complaints' && (
                                <div className="mt-5">
                                    <h2 className={` text-${isDarkMode ? 'light' : 'dark'}`}>{selectedItem}</h2>
                                    <div className="table-responsive">
                                        <table className={`table table-${isDarkMode ? 'dark' : 'light'}`}>
                                            <thead>
                                                <tr>
                                                    <th>Complaint ID</th>
                                                    <th>Customer ID</th>
                                                    <th>Complaint Type</th>
                                                    <th>Complaint Text</th>
                                                    <th>Complaint Date</th>
                                                    <th>Resolved</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {complaints.map(complaint => (
                                                    <tr key={complaint.ComplaintID}>
                                                        <td>{complaint.ComplaintID}</td>
                                                        <td>{complaint.CustomerID}</td>
                                                        <td>{complaint.ComplaintType}</td>
                                                        <td>{complaint.ComplaintText}</td>
                                                        <td>{new Date(complaint.ComplaintDate).toLocaleString()}</td>
                                                        <td>{complaint.IsResolved ? 'Yes' : 'No'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                            {selectedItem === 'FeedBacks' && (
                                <div className="mt-5">
                                    <h2 className={` text-${isDarkMode ? 'light' : 'dark'}`}>{selectedItem}</h2>

                                    <Card className={`mb-4 p-5 rounded-2 shadow bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                                        <CardContent>
                                            <Typography variant='h5' component='div'>Feedback</Typography>
                                            <div className="table-responsive ">
                                                <table className={`table table-${isDarkMode ? 'dark' : 'light'}`}>
                                                    <thead className="thead-dark">
                                                        <tr>
                                                            <th scope="col">Comment</th>
                                                            <th scope="col">Food Rating</th>
                                                            <th scope="col">Service Rating</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {feedback.map(feedbackItem => (
                                                            <tr key={feedbackItem.id}>
                                                                <td>{feedbackItem.Comment}</td>
                                                                <td>
                                                                    <StarRatings
                                                                        rating={feedbackItem.FoodRating}
                                                                        starRatedColor="#f7d70e"
                                                                        numberOfStars={5}
                                                                        starDimension="20px"
                                                                        starSpacing="2px"
                                                                    />
                                                                </td>
                                                                <td>
                                                                    <StarRatings
                                                                        rating={feedbackItem.ServiceRating}
                                                                        starRatedColor="#f7d70e"
                                                                        numberOfStars={5}
                                                                        starDimension="20px"
                                                                        starSpacing="2px"
                                                                    />
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                            )}

                        </div>


                    </div>
                </div>
            </div>
        </div>


    );
}

export default Home;

