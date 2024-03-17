import { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useDarkMode } from './Hooks/DarkModeContext';
import Cookies from 'js-cookie';
import { Button } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import PaginationComponent from './PaginationComponent';



function Home() {
    //TODO : N0
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
    const [imageSrc, setImageSrc] = useState('');
    const [image, setImage] = useState(null);
    const [filteredReservationss, setFilteredReservations] = useState(reservations);

    const [selectedItem, setSelectedItem] = useState('Profile');

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 2;
    const [filteredOrders, setFilteredOrders] = useState([]);

    const filterOrders = (status) => {
        const filtered = orders.filter(order => order.Status === status);
        setFilteredOrders(filtered);
    };
    // Logic to get current orders based on pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    // Logic to change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
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

    //FOR ADDRESS PAGINIATION IN ADDRESS PART
    const addressesPerPage = 3;
    const startIndex = (currentPage - 1) * addressesPerPage;
    const endIndex = Math.min(startIndex + addressesPerPage, addresses.length);
    //FOR FILTERD RESERVATIONS
    const filteredReservations = (status) => {
        const filtered = reservations.filter(reservation => reservation.Status === status);
        setFilteredReservations(filtered);
        setCurrentPage(1); // Reset to first page when changing filters
    };


    return (
        <div>
            <div className="container-fluid ">
                <div className="row CustomMarginTop"  >
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

                                <div className="container mt-5" >
                                    <div className="main-body">
                                        <div className="row">
                                            <div className="col-lg-4">
                                                <div className={`card  bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}  `}>
                                                    <div className="card-body">
                                                        <div className="d-flex flex-column align-items-center text-center">
                                                            <img src={imageSrc} alt="User" className="rounded-circle p-1 bg-primary" width="150" />
                                                            <div className="mt-3 align-items-center d-flex flex-column">
                                                                <h4>{userDetails.FirstName}</h4>
                                                                <small className='fst-italic '>welcome back !</small>
                                                                <div className="col-md-6 ">

                                                                    <div className="d-flex justify-content-center">
                                                                        <input type="file" onChange={handleImageChange} className="form-control mt-3" style={{ width: '100%' }} />
                                                                    </div>
                                                                    <div className="d-flex justify-content-center">
                                                                        <button onClick={handleUpload} className='btn btn-primary mt-3' style={{ width: '100%' }}>Upload Image</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <hr className="my-4" />
                                                        <ul className="list-group list-group-flush">

                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-8">
                                                <div className={`card bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}  `}>
                                                    <div className="card-body">
                                                        <div className="row mb-3">
                                                            <div className="col-sm-3">
                                                                <h6 className="mb-0">Full Name</h6>
                                                            </div>
                                                            <div className="col-sm-9 text-secondary">
                                                                <input type="text" className="form-control" value={userDetails.FirstName} />
                                                            </div>
                                                        </div>
                                                        <div className="row mb-3">
                                                            <div className="col-sm-3">
                                                                <h6 className="mb-0">Last Name</h6>
                                                            </div>
                                                            <div className="col-sm-9 text-secondary">
                                                                <input type="text" className="form-control" value={userDetails.LastName} />
                                                            </div>
                                                        </div>
                                                        <div className="row mb-3">
                                                            <div className="col-sm-3">
                                                                <h6 className="mb-0">Email</h6>
                                                            </div>
                                                            <div className="col-sm-9 text-secondary">
                                                                <input type="text" className="form-control" value={userDetails.Email} />
                                                            </div>
                                                        </div>

                                                        <div className="row mb-3">
                                                            <div className="col-sm-3">
                                                                <h6 className="mb-0">Credits</h6>
                                                            </div>
                                                            <div className="col-sm-9 text-secondary">
                                                                <input type="text" className="form-control" value={userDetails.Credits} disabled />
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-sm-3"></div>
                                                            <div className="col-sm-9 text-secondary">
                                                                <input type="button" className="btn btn-primary px-4" value="Save Changes" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className={`card p-2 bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}   align-items-center d-flex flex-column`}>
                                                            <div className="row mt-5">
                                                                {Array.isArray(addresses) && addresses.slice(startIndex, endIndex).map(address => (
                                                                    <div key={address.id} className="col-lg-4 mb-4">
                                                                        <div className={`card bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}  shadow-lg  `}>
                                                                            <div className="card-body">
                                                                                <h5 className="card-title">Phone Number: {address.PhoneNumber}</h5>
                                                                                <p className="card-text">Address: {address.Address}</p>
                                                                                <button className="btn btn-primary me-2">Edit</button>
                                                                                <button className="btn btn-danger">Remove</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <PaginationComponent
                                                                currentPage={currentPage}
                                                                totalPages={Math.ceil(addresses.length / addressesPerPage)}
                                                                onPageChange={paginate}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )}
                            {selectedItem === 'Payment-History' && (
                                <div className="container mt-5">
                                    <div className="main-body">
                                        <div className="row row-cols-1 row-cols-md-2 g-4">
                                            {payments.slice((currentPage - 1) * 6, currentPage * 6).map((payment) => (
                                                <div className="col mb-4" key={payment.PaymentID}>
                                                    <div className={`card  bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}  `}>
                                                        <div className="card-body">
                                                            <h5 className="card-title">Order ID: {payment.OrderID}</h5>
                                                            <h6 className={`card-subtitle mb-2   `}>Date: {new Date(payment.PaymentDate).toLocaleString()}</h6>
                                                            <p className="card-text">Amount: ${payment.Amount}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <PaginationComponent
                                        currentPage={currentPage}
                                        totalPages={Math.ceil(payments.length / 6)}
                                        onPageChange={paginate}
                                    />
                                </div>
                            )}





                            {selectedItem === 'Orders' && (
                                <div className="mt-5">
                                    <h2 className={`text-${isDarkMode ? 'light' : 'dark'}`}>{selectedItem}</h2>
                                    <div className="container-fluid">
                                        <div className="row justify-content-start">
                                            <div className="col">
                                                <div className="d-flex gap-3 overflow-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                                                    <button className="btn btn-info fst-italic" onClick={() => filterOrders('Pending')}>
                                                        Pending
                                                    </button>
                                                    <button className="btn btn-success fst-italic" onClick={() => filterOrders('Confirmed')}>
                                                        Confirmed
                                                    </button>
                                                    <button className="btn btn-danger fst-italic" onClick={() => filterOrders('Rejected')}>
                                                        Rejected
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mt-3">
                                        {currentOrders.map(order => (
                                            <div key={order.id} className={`card ms-3 border-0 rounded-2 shadow-sm mb-4 bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'} `} style={{ borderRadius: '15px' }}>
                                                <div className={`card-body  `}>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h3>{`Order ID: ${order.OrderID}`}</h3>
                                                        <span className={`badge p-2 bg-${order.Status === 'Pending' ? 'primary' : order.Status === 'Confirmed' ? 'success' : 'danger'}`}>
                                                            {order.Status}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2">
                                                        <p>{`Order Date: ${order.OrderDate}`}</p>
                                                        <p>{`Payment Status: ${order.PaymentStatus}`}</p>
                                                        <p>{`Total Amount: ${order.TotalAmount}`}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    <div className="d-flex justify-content-center">
                                        <PaginationComponent
                                            currentPage={currentPage}
                                            totalPages={Math.ceil(filteredOrders.length / ordersPerPage)}
                                            onPageChange={paginate}
                                        />

                                    </div>
                                </div>
                            )}

                            {selectedItem === 'Reservations' && (
                                <div className="mt-5">
                                    <h2 className={`text-${isDarkMode ? 'light' : 'dark'}`}>{selectedItem}</h2>
                                    <div className="container-fluid mb-3">
                                        <div className="row justify-content-start">
                                            <div className="col">
                                                <div className="d-flex gap-3 overflow-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
                                                    <button className="btn btn-info fst-italic" onClick={() => filteredReservations('Pending')}>
                                                        Pending
                                                    </button>
                                                    <button className="btn btn-success fst-italic" onClick={() => filteredReservations('Confirmed')}>
                                                        Confirmed
                                                    </button>
                                                    <button className="btn btn-danger fst-italic" onClick={() => filteredReservations('Rejected')}>
                                                        Rejected
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {filteredReservationss.slice((currentPage - 1) * 3, currentPage * 3).map(reservation => {
                                        const reservationDate = new Date(reservation.ReservationDate);
                                        const date = reservationDate.toLocaleDateString(); // Format date
                                        const time = reservationDate.toLocaleTimeString(); // Format time
                                        return (
                                            <Card className={`mb-4 p-5 position-relative rounded-2 shadow bg-${isDarkMode ? 'dark' : 'light'} reservation-container text-${isDarkMode ? 'light' : 'dark'}`} key={reservation.id}>
                                                <CardContent>
                                                    <Typography variant='h5' component='div'>Reservation Details</Typography>
                                                    <div className="mt-3">
                                                        <strong className=''>Reservation Date:</strong> {date}<br />
                                                        <strong>Reservation Time:</strong> {time}<br />
                                                        <strong>No of Tables:</strong> {reservation.NoOfTables}<br />
                                                        <div className="status-badge position-absolute top-0 end-0 mt-2 me-2">
                                                            <span className={`badge bg-${reservation.Status === 'Pending' ? 'primary' : reservation.Status === 'Confirmed' ? 'success' : 'danger'} text-light fw-bold`}>
                                                                {reservation.Status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                    <div className="d-flex justify-content-center mt-4">
                                        <PaginationComponent
                                            currentPage={currentPage}
                                            totalPages={Math.ceil(filteredReservationss.length / 3)}
                                            onPageChange={paginate}
                                        />
                                    </div>
                                </div>
                            )}

                            {selectedItem === 'Complaints' && (
                                <div className="container mt-5">
                                    <h2 className={`text-${isDarkMode ? 'light' : 'dark'}`}>{selectedItem}</h2>
                                    <div className="row row-cols-1 row-cols-md-2 g-4">
                                        {complaints.slice((currentPage - 1) * 3, currentPage * 3).map(complaint => (
                                            <div className="col mb-4" key={complaint.ComplaintID}>
                                                <div className={`card border-${isDarkMode ? 'light' : 'dark'} text-${isDarkMode ? 'light' : 'dark'} bg-${isDarkMode ? 'dark' : 'light'}`}>
                                                    <div className="card-body d-flex flex-column">
                                                        <div>
                                                            <h5 className="card-title">Complaint ID: {complaint.ComplaintID}</h5>
                                                            <p className="card-text">Complaint Text: {complaint.ComplaintText}</p>
                                                            <p className="card-text">Complaint Date: {new Date(complaint.ComplaintDate).toLocaleString()}</p>
                                                        </div>
                                                        <div className="d-flex justify-content-between mt-auto">
                                                            <p className="card-text">Complaint Type: {complaint.ComplaintType}</p>
                                                            <p className={`card-text text-${complaint.IsResolved ? 'success' : 'danger'}`}>Resolved: {complaint.IsResolved ? 'Yes' : 'No'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="d-flex justify-content-center mt-4">
                                        <PaginationComponent
                                            currentPage={currentPage}
                                            totalPages={Math.ceil(complaints.length / 3)}
                                            onPageChange={paginate}
                                        />
                                    </div>
                                </div>
                            )}

                            {selectedItem === 'FeedBacks' && (
                                <div className="container mt-5">
                                    <h2 className={`text-${isDarkMode ? 'light' : 'dark'}`}>{selectedItem}</h2>
                                    <div className="row row-cols-1 row-cols-md-2  g-4">
                                        {feedback.slice((currentPage - 1) * 3, currentPage * 3).map(feedbackItem => (
                                            <div className="mb-4" key={feedbackItem.id}>
                                                <div className={`card  border-${isDarkMode ? 'light' : 'dark'} text-${isDarkMode ? 'light' : 'dark'}  bg-${isDarkMode ? 'dark' : 'light'}`}>
                                                    <div className="card-body ">
                                                        <h6 className="card-title">Comment: {feedbackItem.Comment}</h6>
                                                        <p className="card-text ">Food Rating:
                                                            <StarRatings
                                                                rating={feedbackItem.FoodRating}
                                                                starRatedColor="#f7d70e"
                                                                numberOfStars={5}
                                                                starDimension="20px"
                                                                starSpacing="2px"
                                                            />
                                                        </p>
                                                        <p className="card-text">Service Rating:
                                                            <StarRatings
                                                                rating={feedbackItem.ServiceRating}
                                                                starRatedColor="#f7d70e"
                                                                numberOfStars={5}
                                                                starDimension="20px"
                                                                starSpacing="2px"
                                                            />
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="d-flex justify-content-center mt-4">
                                        <PaginationComponent
                                            currentPage={currentPage}
                                            totalPages={Math.ceil(feedback.length / 3)}
                                            onPageChange={paginate}
                                        />
                                    </div>
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

