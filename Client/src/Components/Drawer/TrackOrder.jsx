import React, { useEffect, useState } from 'react';
import { useDarkMode } from '../Hooks/DarkModeContext';
import Cookies from 'js-cookie';

const TrackOrder = () => {
    const [orderID, setOrderID] = useState('');
    const [error, setError] = useState(null);
    const { isDarkMode } = useDarkMode();
    const [orders, setOrders] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const token = Cookies.get('token')
    const apiUri = import.meta.env.VITE_REACT_APP_API_URL;

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

    const handleTrackOrder = async () => {
        try {
            if(!orderID){
                setError("ID  cannot be empty");
                return
            }
            // Fetch order data based on orderID
            const response = await fetch(`${apiUri}api/getOrder/${orderID}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch order data');
            }
            const data = await response.json();

            // Set the order details to the response object
            if (data && data.order) {
                setOrders(data.order);
                console.log(data.order)
                setError(null);
            } else {
                setOrders(null); // Set to null if no order found
                setError('Order not found');
            }
        } catch (error) {
            setOrders(null);
            setError('Failed to track order. Please check the order ID and try again.');
        }
    };



    const handleCallRider = () => {
        // Implement logic to initiate a call to the rider
        // This could involve using a third-party library or a service
        console.log('Calling rider...');
    };

    return (
        <div className='pb-4 pt-5'>
            <div className={`container mt-5 p-5 bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'} rounded shadow-lg`}>
                <h2 className="text-center mb-4">Track Your Order</h2>
                <div className="mb-3">
                    <label htmlFor="orderID" className="form-label">Enter Order ID:</label>
                    <input
                        type="text"
                        className="form-control"
                        id="orderID"
                        value={orderID}
                        onChange={(e) => setOrderID(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary btn-lg btn-block" onClick={handleTrackOrder}>Track Order</button>

                {error && <p className="text-danger mt-3 text-center">{error}</p>}

                {orders && (
                    <div className="mt-4">
                        <h3>Order Details</h3>
                        <p>Order ID: {orders.OrderID}</p>
                        <p>Order Date: {orders.OrderDate ? new Date(orders.OrderDate).toLocaleDateString() : ""}</p>
                        <p>Ordered Time: {orders.OrderTime}</p>
                        <p>Delivery Status: {orders.Status}</p>
                        <button className="btn btn-success btn-lg btn-block btn-sm" onClick={handleCallRider}>Call Rider</button>
                    </div>
                )}


                <div className="mt-5 text-center">
                    <p className='text-primary fw-medium  ' style={{ cursor: "pointer" }} onClick={() => window.location.href = 'tel:+1234567890'}><i className="fa-solid fa-phone text-primary"></i> HelpLine</p>
                    <p>Not sure where to find your order ID? Check your order confirmation email or contact our support team.</p>
                    <p>Looking for more delicious items? Browse our menu to discover new favorites!</p>
                    {/* Add link to menu page or any other engaging content */}
                </div>
            </div>
        </div>
    );
};

export default TrackOrder;
