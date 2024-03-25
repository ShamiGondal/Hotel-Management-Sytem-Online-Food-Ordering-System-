import { useState, useEffect } from 'react';
import { useDarkMode } from '../Hooks/DarkModeContext';
import { Button } from 'react-bootstrap';
import Settings from './Settings';
import PaymentDetails from './PaymentDetails';
import OrderDetails from './OrdersDetails';
import ReservationDetails from './ReservationDetails';
import ComplaintDetails from './ComplaintDetails';
import FeedbackDetails from './FeedbackDetails';
import { useLocation } from 'react-router-dom';

function Home() {
    const { isDarkMode } = useDarkMode();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState('Profile');
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const orderParam = params.get('order');
        const reservationParam = params.get('reservation');
        const paymentParam = params.get('payment');
        const feedbackParam = params.get('feedback');
        const complaintParam = params.get('complaint');

        if (orderParam) {
            setSelectedItem('Orders');
        } else if (reservationParam) {
            setSelectedItem('Reservations');
        } else if (paymentParam) {
            setSelectedItem('Payment-History');
        } else if (feedbackParam) {
            setSelectedItem('FeedBacks');
        } else if (complaintParam) {
            setSelectedItem('Complaints');
        }
    }, [location.search]);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setSidebarOpen(false);
    };

    if (isDarkMode) {
        document.body.style.backgroundColor = 'black';
    } else {
        document.body.style.backgroundColor = 'white';
    }

    // Define state for mobile sidebar
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);


    return (
        <div>
            <div className="container-fluid ">
                <div className="row CustomMarginTop"  >
                    <div className="d-md-none mt-2">
                        {/* Button to toggle mobile sidebar */}
                        <Button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}>
                            <i className={`fa-solid ${mobileSidebarOpen ? 'fa-xmark' : 'fa-arrow-right-from-bracket'} `}></i>
                        </Button>
                        {/* Mobile sidebar */}
                        {mobileSidebarOpen && (
                            <div className={`mobile-sidebar bg-${isDarkMode ? 'dark' : 'light'}`}>
                                <ul className="list-group p-3">
                                    <li className="list-group-item" onClick={() => handleItemClick('Profile')}>
                                        <i className="fa-solid fa-user"></i> Profile
                                    </li>
                                    <li className="list-group-item" onClick={() => handleItemClick('Orders')}>
                                        <i className="fa-brands fa-first-order"></i> Orders
                                    </li>
                                    <li className="list-group-item" onClick={() => handleItemClick('Reservations')}>
                                        <i className="fa-solid fa-book"></i> Reservations
                                    </li>
                                    <li className="list-group-item" onClick={() => handleItemClick('FeedBacks')}>
                                        <i className="fa-regular fa-comment"></i> FeedBacks
                                    </li>
                                    <li className="list-group-item" onClick={() => handleItemClick('Complaints')}>
                                        <i className="fa-brands fa-cuttlefish"></i> Complaints
                                    </li>
                                    <li className="list-group-item" onClick={() => handleItemClick('Payment-History')}>
                                        <i className="fa-brands fa-paypal"></i> Payments
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className={`col-md-3 mt-md-4 sidebar ${sidebarOpen ? 'open' : 'closed'} d-none d-md-block bg-${isDarkMode ? 'dark' : 'light'}`}
                        onMouseEnter={() => setSidebarOpen(true)} // Open sidebar on mouse enter
                        onMouseLeave={() => setSidebarOpen(false)} // Close sidebar on mouse leave
                    >
                        {/* Desktop sidebar */}
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

                    <div className={`${sidebarOpen ? 'col-md-8' : 'col-md-10'} col-12 mt-5 text-center `}>
                        <div className="position-relative">
                            {selectedItem === 'Profile' && (
                                <Settings />
                            )}
                            {selectedItem === 'Payment-History' && (
                                <PaymentDetails />
                            )}
                            {selectedItem === 'Orders' && (
                                <OrderDetails />
                            )}
                            {selectedItem === 'Reservations' && (
                                <ReservationDetails />
                            )}
                            {selectedItem === 'Complaints' && (
                                <ComplaintDetails />
                            )}
                            {selectedItem === 'FeedBacks' && (
                                <FeedbackDetails />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
