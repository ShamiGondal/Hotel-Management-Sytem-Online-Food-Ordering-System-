import { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useDarkMode } from './Hooks/DarkModeContext';
import Cookies from 'js-cookie';
import { Button } from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import PaginationComponent from './PaginationComponent';
import { toast } from 'react-toastify'

import { Modal } from 'react-bootstrap'; // Assuming you're using React Bootstrap components


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
    const [isLoggedIn, setisLoggedIn] = useState(Cookies.get('token'))
    const [filteredReservationss, setFilteredReservations] = useState(reservations);

    const [selectedItem, setSelectedItem] = useState('Profile');

    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10; // Change this to 10
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

    const [showModal, setShowModal] = useState(false);

    const [editedUserDetails, setEditedUserDetails] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: ''
    });



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
                // console.log('complaints data:', data);
                setComplaints(data)
            })
            .catch(error => console.error('Error fetching complaints:', error));

        fetch(`${localhost}/api/my-payments`, { headers })
            .then(response => response.json())
            .then(data => {
                // console.log('Payments data:', data); // Log the payments data
                setPayments(data.payments);
            })
            .catch(error => console.error('Error fetching payments:', error));

    }, []);

    if (isDarkMode) {
        document.body.style.backgroundColor = 'black';
    } else {
        document.body.style.backgroundColor = 'white';
    }

    console.log(userDetails)


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

    useEffect(() => {
        filterOrders('Pending');
        filteredReservations('Pending')
    }, [isLoggedIn]); // Empty dependency array to run only once when the component mounts


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


    // Define the fetchCustomerDetails function
    const fetchCustomerDetails = async () => {
        try {
            const token = Cookies.get('token');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            };

            const response = await fetch(`${localhost}/api/getCustomer`, { headers });
            const data = await response.json();
            // console.log("data",data)
            // setUserDetails(data);
            setEditedUserDetails({
                firstName: data.FirstName,
                lastName: data.LastNamea,
                email: data.Email,
                phoneNumber: data.PhoneNumber
            });
        } catch (error) {
            console.error('Error fetching Customer:', error);
        }
    };

    // Call fetchCustomerDetails inside useEffect
    useEffect(() => {
        fetchCustomerDetails();
        // Other fetch calls...
    }, []);


    const handleShowModal = () => {
        setEditedUserDetails(userDetails); // Set initial values to the current user details
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUserDetails({
            ...editedUserDetails,
            [name]: value
        });
    };

    const handleSaveChanges = async () => {
        try {
            const token = Cookies.get('token')
            const response = await fetch(`${localhost}/api/updateUser`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`

                },
                body: JSON.stringify(editedUserDetails)
            });

            if (!response.ok) {
                throw new Error('Failed to update user details');
            }

            setShowModal(false); // Close the modal after saving changes
        } catch (error) {
            console.error('Error updating user:', error);
            // Handle error scenario, e.g., show an error message to the user
        }
    };

    const removeAddress = (addressID) => {
        const token = Cookies.get('token'); // Assuming you're using cookies to store the token
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': token
        };

        fetch(`${localhost}/api/remove-address/${addressID}`, {
            method: 'DELETE',
            headers: headers
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to remove address');
                }
                console.log('Address removed successfully');
                // After successfully removing the address, refetch the addresses
                toast.success("Address Removed")
            })
            .catch(error => {
                console.error('Error removing address:', error); // Log error message
            });
    };


    return (
        <div>
            <div className="container-fluid ">
                <div className="row CustomMarginTop"  >
                    <div
                        className={`col-md-3 mt-md-4 sidebar ${sidebarOpen ? 'open' : 'closed'} bg-${isDarkMode ? 'dark' : 'light'}`}
                        onMouseEnter={() => setSidebarOpen(true)} // Open sidebar on mouse enter
                        onMouseLeave={() => setSidebarOpen(false)} // Close sidebar on mouse leave
                    >
                        <Button className="toggle-btn mt-5" onClick={toggleSidebar}>
                            <i className={`fa-solid ${sidebarOpen ? 'fa-xmark' : 'fa-arrow-right-from-bracket'}`}></i>
                        </Button>
                        <ul className="list-group">
                            <li className="list-group-item" onClick={() => handleItemClick('Profile')}>
                                <i className="fa-solid fa-user"></i> {sidebarOpen && 'Profile'}
                            </li>
                            <li className="list-group-item" onClick={() => handleItemClick('Orders')}>
                                <i className="fa-brands fa-first-order"></i> {sidebarOpen && 'Orders'}
                            </li>
                            <li className="list-group-item" onClick={() => handleItemClick('Reservations')}>
                                <i className="fa-solid fa-book"></i> {sidebarOpen && 'Reservations'}
                            </li>
                            <li className="list-group-item" onClick={() => handleItemClick('FeedBacks')}>
                                <i className="fa-regular fa-comment"></i> {sidebarOpen && 'FeedBacks'}
                            </li>
                            <li className="list-group-item" onClick={() => handleItemClick('Complaints')}>
                                <i className="fa-brands fa-cuttlefish"></i> {sidebarOpen && 'Complaints'}
                            </li>
                            <li className="list-group-item" onClick={() => handleItemClick('Payment-History')}>
                                <i className="fa-brands fa-paypal"></i> {sidebarOpen && 'Payments'}
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
                                                                <h6 className="mb-0">Phone Number</h6>
                                                            </div>
                                                            <div className="col-sm-9 text-secondary">
                                                                <input type="text" className="form-control" value={userDetails.PhoneNumber} />
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
                                                                <input type="button" className="btn btn-primary px-4" value="Edit" onClick={handleShowModal} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className={`card p-2 bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}   align-items-center d-flex flex-column`}>
                                                            <div className="row mt-5">
                                                                {Array.isArray(addresses) && addresses.slice(startIndex, endIndex).map(address => (
                                                                    <div key={address.AddressID} className="col-lg-4 mb-4">
                                                                        <div className={`card bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}  shadow-lg  `}>
                                                                            <div className="card-body">
                                                                                <h5 className="card-title fs-6">Street: <small> {address.StreetAddress}</small> </h5>
                                                                                <div className="d-flex gap-2" >
                                                                                    <p className="card-text">City: {address.City}</p>
                                                                                    <p className="card-text">State: {address.State}</p>
                                                                                </div>
                                                                                <div className="d-flex gap-2">
                                                                                    <p className="card-text">PostalCode: {address.PostalCode}</p>
                                                                                    <p className="card-text">Country: {address.Country}</p>
                                                                                </div>
                                                                                {/* <button className="btn btn-primary me-2">Edit</button> */}
                                                                                <button className="btn btn-danger" onClick={() => removeAddress(address.AddressID)}>Remove</button>
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
                                            <Modal show={showModal} onHide={handleCloseModal}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Edit User Details</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <div className="row mb-3">
                                                        <div className="card-body">
                                                            <div className="row mb-3">
                                                                <div className="col-sm-3">
                                                                    <h6 className="mb-0">Full Name</h6>
                                                                </div>
                                                                <div className="col-sm-9 text-secondary">
                                                                    <input type="text" className="form-control" name="FirstName" value={editedUserDetails.FirstName} onChange={handleInputChange} />
                                                                </div>
                                                            </div>
                                                            <div className="row mb-3">
                                                                <div className="col-sm-3">
                                                                    <h6 className="mb-0">Last Name</h6>
                                                                </div>
                                                                <div className="col-sm-9 text-secondary">
                                                                    <input type="text" className="form-control" name="LastName" value={editedUserDetails.LastName} onChange={handleInputChange} />
                                                                </div>
                                                            </div>
                                                            <div className="row mb-3">
                                                                <div className="col-sm-3">
                                                                    <h6 className="mb-0">Email</h6>
                                                                </div>
                                                                <div className="col-sm-9 text-secondary">
                                                                    <input type="text" className="form-control" name="Email" value={editedUserDetails.Email} onChange={handleInputChange} />
                                                                </div>
                                                            </div>
                                                            <div className="row mb-3">
                                                                <div className="col-sm-3">
                                                                    <h6 className="mb-0">Phone Number</h6>
                                                                </div>
                                                                <div className="col-sm-9 text-secondary">
                                                                    <input type="text" className="form-control" name="PhoneNumber" value={editedUserDetails.PhoneNumber} onChange={handleInputChange} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Add similar input fields for other user details */}
                                                </Modal.Body>


                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                                                    <Button variant="primary" onClick={handleSaveChanges}>Save Changes</Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </div>
                                    </div>
                                </div>

                            )}
                            {selectedItem === 'Payment-History' && (
                                <div className="container mt-5">
                                    <h2 className={`text-${isDarkMode ? 'light' : 'dark'}`}>{selectedItem}</h2>
                                    <div className="table-responsive">
                                        <table className={`table table-striped table-bordered table-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'} mt-4`}>
                                            <thead>
                                                <tr>
                                                    <th>Order ID</th>
                                                    <th>Date</th>
                                                    <th>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody  >
                                                {payments.slice((currentPage - 1) * 6, currentPage * 6).map(payment => (
                                                    <tr key={payment.PaymentID}>
                                                        <td>{payment.OrderID}</td>
                                                        <td>{new Date(payment.PaymentDate).toLocaleString()}</td>
                                                        <td>${payment.Amount}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {/* Pagination */}
                                    <div className="d-flex justify-content-center">
                                        <PaginationComponent
                                            currentPage={currentPage}
                                            totalPages={Math.ceil(payments.length / 6)}
                                            onPageChange={paginate}
                                        />
                                    </div>
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
                                        <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'scroll', scrollbarWidth: 'thin', scrollbarColor: 'pink' }}>
                                            <table className={`table table-striped  table-bordered table-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}`} style={{ borderRadius: '15px' }}>
                                                <thead>
                                                    <tr>
                                                        <th>Order ID</th>
                                                        <th>Status</th>
                                                        <th>Order Date</th>
                                                        <th>Payment Status</th>
                                                        <th>Total Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentOrders.map(order => (
                                                        <tr key={order.id}>
                                                            <td>{order.OrderID}</td>
                                                            <td>
                                                                <span className={`badge p-2 bg-${order.Status === 'Pending' ? 'primary' : order.Status === 'Confirmed' ? 'success' : 'danger'}`}>
                                                                    {order.Status}
                                                                </span>
                                                            </td>
                                                            <td>{new Date(order.OrderDate).toLocaleString()}</td>
                                                            <td>{order.PaymentStatus}</td>
                                                            <td>{order.TotalAmount}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Pagination */}
                                    <div className="d-flex justify-content-center">
                                        <PaginationComponent
                                            currentPage={currentPage}
                                            totalPages={Math.ceil(filteredOrders.length / 10)} // Use filteredOrders length here
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
                                    <div className="table-responsive">
                                        <table className={`table table-striped table-bordered table-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}`}>
                                            <thead>
                                                <tr>
                                                    <th>Reservation Date</th>
                                                    <th>Reservation Time</th>
                                                    <th>No of Tables</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredReservationss.slice((currentPage - 1) * 3, currentPage * 3).map(reservation => (
                                                    <tr key={reservation.id}>
                                                        <td>{new Date(reservation.ReservationDate).toLocaleDateString()}</td>
                                                        <td>{new Date(reservation.ReservationDate).toLocaleTimeString()}</td>
                                                        <td>{reservation.NoOfTables}</td>
                                                        <td>
                                                            <span className={`badge bg-${reservation.Status === 'Pending' ? 'primary' : reservation.Status === 'Confirmed' ? 'success' : 'danger'} text-light fw-bold`}>
                                                                {reservation.Status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
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
                                    <div className="table-responsive">
                                        <table className={`table table-striped table-bordered table-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}`}>
                                            <thead>
                                                <tr>
                                                    <th>Complaint ID</th>
                                                    <th>Complaint Text</th>
                                                    <th>Complaint Date</th>
                                                    <th>Complaint Type</th>
                                                    <th>Resolved</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {complaints.slice((currentPage - 1) * 3, currentPage * 3).map(complaint => (
                                                    <tr key={complaint.ComplaintID}>
                                                        <td>{complaint.ComplaintID}</td>
                                                        <td>{complaint.ComplaintText}</td>
                                                        <td>{new Date(complaint.ComplaintDate).toLocaleString()}</td>
                                                        <td>{complaint.ComplaintType}</td>
                                                        <td>
                                                            <span className={`badge bg-${complaint.IsResolved ? 'success' : 'danger'} text-light fw-bold`}>
                                                                {complaint.IsResolved ? 'Yes' : 'No'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
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
                                    <div className="table-responsive">
                                        <table className={`table table-striped table-bordered table-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}`}>
                                            <thead>
                                                <tr>
                                                    <th>Comment</th>
                                                    <th>Food Rating</th>
                                                    <th>Service Rating</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {feedback.slice((currentPage - 1) * 3, currentPage * 3).map(feedbackItem => (
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

