import React, { useState } from 'react';
import { useDarkMode } from './Hooks/DarkModeContext';

const TrackOrder = () => {
    const [orderID, setOrderID] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [error, setError] = useState(null);
    const { isDarkMode } = useDarkMode();

    const handleTrackOrder = async () => {
        try {
            // Fetch order data based on orderID
            const response = await fetch(`API_ENDPOINT/orders/${orderID}`);
            if (!response.ok) {
                throw new Error('Failed to fetch order data');
            }
            const data = await response.json();
            setOrderData(data);
            setError(null);
        } catch (error) {
            setOrderData(null);
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

            {orderData && (
                <div className="mt-4">
                    <h3>Order Details</h3>
                    <p>Order Status: {orderData.status}</p>
                    <p>Delivery Time: {orderData.deliveryTime}</p>
                    <p>Rider Information: {orderData.riderName}, {orderData.riderPhone}</p>
                    <button className="btn btn-success btn-lg btn-block btn-sm" onClick={handleCallRider}>Call Rider</button>
                </div>
            )}

            <div className="mt-5 text-center">
            <p className='text-primary fw-medium  ' style={{cursor:"pointer"}}  onClick={() => window.location.href = 'tel:+1234567890'}><i className="fa-solid fa-phone text-primary"></i> HelpLine</p>
                <p>Not sure where to find your order ID? Check your order confirmation email or contact our support team.</p>
                <p>Looking for more delicious items? Browse our menu to discover new favorites!</p>
                {/* Add link to menu page or any other engaging content */}
            </div>
        </div>
        </div>
    );
};

export default TrackOrder;
