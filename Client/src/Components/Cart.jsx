import React from 'react';
import { Button, TextField } from '@mui/material';
import { useDarkMode } from './Hooks/DarkModeContext';

const Cart = ({ orderItems }) => {
    // Function to calculate total amount
    const calculateTotalAmount = () => {
        let total = 0;
        if (Array.isArray(orderItems)) {
            for (const item of orderItems) {
                total += item.subtotal;
            }
        }
        return total;
    };

    const {isDarkMode} = useDarkMode();
    // Function to handle order submission
    const handleOrderSubmit = async () => {
        try {
            const response = await fetch('http://your-api-url/placeOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: generateOrderId(),
                    orderItems: orderItems,
                    paymentStatus: 'Pending',
                    status: 'Pending',
                }),
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('An error occurred while placing the order.');
        }
    };

    // Function to generate a unique order ID
    const generateOrderId = () => {
        return Math.random().toString(36).substr(2, 9);
    };

    if (isDarkMode) {
        document.body.style.backgroundColor = 'black';
    } else {
        document.body.style.backgroundColor = 'white';
    }

    return (
        <div className="mt-5 container pt-5">
            <div className={`p-5 card rounded-2 bg-${isDarkMode ? 'dark' : 'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''} mt-5 pt-5 `}>
           <div className='container'>
                <h2 className="text-center mb-4">Your Cart</h2>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Price per Item</th>
                                <th>Total</th>
                                <th>Discount</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderItems && orderItems.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>
                                        <Button variant="outlined" size="small" onClick={() => handleDecrease(index)}>-</Button>
                                        <span className="mx-2">{item.quantity}</span>
                                        <Button variant="outlined" size="small" onClick={() => handleIncrease(index)}>+</Button>
                                    </td>
                                    <td>{item.price}</td>
                                    <td>{item.subtotal}</td>
                                    <td>{item.discount}%</td>
                                    <td><Button variant="outlined" color="secondary" size="small" onClick={() => handleRemove(index)}>Remove</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-end">
                    <TextField
                        label="Total Amount"
                        value={calculateTotalAmount()}
                        variant="outlined"
                        disabled
                    />
                </div>
                <div className="text-center mt-4">
                    <Button variant="contained" onClick={handleOrderSubmit}>Proceed to Order</Button>
                </div>
            </div>
           </div>
        </div>
    );
};

export default Cart;
