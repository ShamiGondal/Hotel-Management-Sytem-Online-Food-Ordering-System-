import React, { useState } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { Button, Form } from 'react-bootstrap';
import { loadStripe } from '@stripe/stripe-js';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe('pk_test_51OINxgHgDxyW6XeqfBylUJikmmt49IPUqxlJazRsB9efRzOr0LvTlHGE13BwhNad29rn2dbTF8vgNZcFMhiyHlPf00Rk3E7pCN');

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const localhost = `http://localhost:4000/api`

    // Retrieve cart items and total amount from local storage
    const getCartItemsFromStorage = () => {
        const items = localStorage.getItem('cartItems');
        return items ? JSON.parse(items) : [];
    };

    const getTotalAmountFromStorage = () => {
        const amount = localStorage.getItem('totalAmount');
        return amount ? parseFloat(amount) : 0;
    };

    const cartItems = getCartItemsFromStorage();
    const totalAmount = getTotalAmountFromStorage();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        // Create payment method
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
            billing_details: {
                name: event.target.name.value,
            },
        });

        if (error) {
            console.error(error);
            setError(error.message);
            toast.error('Payment error. Please try again or use Cash on Delivery.');
            setLoading(false);
            return;
        }

        // Prepare the items array to send to the backend
        const itemsToSend = cartItems.map(item => ({
            name: item.Name,
            price: item.Price,
            quantity: item.Quantity,
        }));

        // Fetch payment intent client secret from your server
        // Fetch payment intent client secret from your server
        const response = await fetch(`${localhost}/payment-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: itemsToSend }),
        });

        const { sessionId } = await response.json();

        // Redirect to checkout with sessionId
        const { error: redirectToCheckoutError } = stripe.redirectToCheckout({
            sessionId: sessionId,
        });

        if (redirectToCheckoutError) {
            console.error(redirectToCheckoutError);
            toast.error('Failed to redirect to checkout. Please try again.');
            setLoading(false);
        }



    };




    return (
        <div className="mt-5 pt-5 container">
            <Form onSubmit={handleSubmit} className='mt-5'>
                <Form.Group>
                    <Form.Label>Name on Card</Form.Label>
                    <Form.Control type="text" name="name" required />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Card details</Form.Label>
                    <CardElement className="form-control" />
                </Form.Group>
                {cartItems && (
                    <div>
                        <h4>Items:</h4>
                        <ul>
                            {cartItems.map((item, index) => (
                                <li key={index}>
                                    {item.Name} - ${item.Price}
                                </li>
                            ))}
                        </ul>
                        <h4>Total Amount: ${totalAmount}</h4>
                    </div>
                )}
                {error && <div className="text-danger">{error}</div>}
                <Button type="submit" className='mt-5' disabled={!stripe || loading}>
                    {loading ? 'Processing...' : 'Pay'}
                </Button>
            </Form>
        </div>
    );
};

const WrappedPaymentForm = () => (
    <Elements stripe={stripePromise}>
        <PaymentForm />
    </Elements>
);

export default WrappedPaymentForm;
