// Cart component
import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useDarkMode } from './Hooks/DarkModeContext';
import { useCartContext } from './Hooks/useCart';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useStripe } from '@stripe/react-stripe-js';


const stripePromise = loadStripe('pk_test_51OINxgHgDxyW6XeqfBylUJikmmt49IPUqxlJazRsB9efRzOr0LvTlHGE13BwhNad29rn2dbTF8vgNZcFMhiyHlPf00Rk3E7pCN');

const Cart = () => {

    //TODO: Have to update the table to accpet the order Note too
    const stripe = useStripe();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useCartContext();
    const localhost = `http://localhost:4000`;
    // const [confirmOrder, setConfirmOrder] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [currentAddress, setCurrentAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('online');

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const navigate = useNavigate();
    const { isDarkMode } = useDarkMode();

    const handleRemove = (index) => {
        removeFromCart(cartItems[index].FoodItemID);
    };

    const handleIncrease = (index) => {
        increaseQuantity(cartItems[index].FoodItemID);
    };

    const handleDecrease = (index) => {
        decreaseQuantity(cartItems[index].FoodItemID);
    };

    const calculateTotalAmount = () => {
        let total = 0;
        if (Array.isArray(cartItems)) {
            for (const item of cartItems) {
                const discountAmount = (item.Price * item.quantity * item.FoodItemDiscount) / 100;
                const discountedPrice = item.Price * item.quantity - discountAmount;
                total += discountedPrice;
            }
        }
        return total;
    };

    useEffect(() => {
        const token = Cookies.get('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        };
        fetch(`${localhost}/api/my-addresses`, { headers })
            .then(response => response.json())
            .then(data => {
                console.log("Addresses:", data);
                setAddresses(data);
                if (data && data.length > 0) {
                    setCurrentAddress(data[0]);
                }
            })
            .catch(error => console.error('Error fetching addresses:', error));
    }, []);

    const generateRandomOrderId = () => {
        const min = 1000;
        const max = 9999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const [orderNote, setorderNote] = useState([])

    const handleOrderSubmit = async () => {
        try {
            const token = Cookies.get("token");
            if (!token) {
                navigate('/Login');
            } else {
                const orderId = generateRandomOrderId(); // Generate order ID here
                const response = await fetch(`${localhost}/api/placeOrder`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`
                    },
                    body: JSON.stringify({
                        orderId: orderId,
                        orderItems: cartItems.map(item => ({
                            foodItemID: item.FoodItemID,
                            quantity: item.quantity,
                            subtotal: item.Price * item.quantity - (item.Price * item.quantity * item.FoodItemDiscount) / 100
                        })),
                        paymentStatus: 'Pending',
                        status: 'Pending',
                        orderNote: orderNote
                    }),
                });

                if (paymentMethod === 'online') {
                    const paymentResponse = await fetch(`${localhost}/api/addPayment`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${token}`
                        },
                        body: JSON.stringify({
                            orderId: orderId, // Use the same order ID here
                            amount: calculateTotalAmount(), // Assuming cartTotal is the total amount to be paid
                            paymentDate: new Date().toISOString(), // Assuming you want to set the payment date as the current date
                        }),
                    });
                    const paymentData = await paymentResponse.json();
                    console.log('Payment added successfully:', paymentData);
                    handleSubmit()
                } else {
                    setOpenDialog(false)
                }

                const data = await response.json();
                console.log('Order placed successfully:', data);
                toast.success('Order placed successfully');
                clearCart();
                setOpenDialog(false);
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };


    const handleSubmit = async () => {

        try {

            // Prepare the items array to send to the backend
            const itemsToSend = cartItems.map(item => ({
                name: item.Name,
                price: item.Price,
                quantity: item.quantity,
            }));

            // Fetch payment intent client secret from your server
            const response = await fetch(`${localhost}/api/payment-session`, {
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

        } catch (error) {
            console.error('Error creating payment method:', error);
            setError(error.message);
            toast.error('Payment error. Please try again or use Cash on Delivery.');
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (!Cookies.get('token')) {
                navigate('/')
            }
        };
    })




    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');


    const handleConfirmAddress = async () => {
        const addressData = {
            streetAddress: streetAddress,
            city: city,
            state: state,
            postalCode: postalCode,
            country: country,
        };

        try {
            const token = Cookies.get('token')
            const response = await fetch('http://localhost:4000/api/addAddress', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`
                },
                body: JSON.stringify(addressData)
            });

            if (!response.ok) {
                throw new Error('Failed to add address');
            }

            // Reset input fields after successful submission
            setStreetAddress('');
            setCity('');
            setState('');
            setPostalCode('');
            setCountry('');

            toast("Address Added Successfully")
        } catch (error) {
            console.error('Error adding address:', error);
            // Handle error appropriately (e.g., show error message)
        }
    };


    return (
        <>
            <ToastContainer />
            <div className="mt-5 container pt-5">
                {/* this part is the cart section show the cart details  */}
                <div className={`p-5 card rounded-2 bg-${isDarkMode ? 'dark' : 'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''} mt-5 pt-5 `}>
                    <div className="container">
                        <h2 className={`text-center mb-4  text-${isDarkMode ? 'light' : 'dark'}`}>Your <i className="fa-solid fa-cart-shopping text-success"></i> has <span className='text-warning' >{cartItems.length}</span> Items</h2>
                        {cartItems && cartItems.map((item, index) => (
                            <div key={index} className="card  mb-4" style={{ borderRadius: '15px' }}>
                                <div className="card-body  ">
                                    <div className="d-flex mt-2 mt-md- flex-column flex-md-row justify-content-between align-items-center">
                                        <h3>{item.Title}</h3>
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleRemove(index)}>Remove</button>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-2 d-flex flex-column flex-md-row mt-2 mt-md- ">
                                        <div className=''>
                                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleDecrease(index)}>-</button>
                                            <span className="mx-2">{item.quantity}</span>
                                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleIncrease(index)}>+</button>
                                        </div>
                                        <div className='d-flex flex-column flex-md-row mt-2 mt-md-0'>
                                            <small className='me-2'>Price per Item: {item.Price}</small>
                                            <small>Total: {item.Price * item.quantity}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="mt-4">
                            <div className="d-flex justify-content-between">
                                <span>Order Total</span>
                                <span>$ {calculateTotalAmount()}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <span>Delivery Charges</span>
                                <span>$ 2</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <span>Tax and Charges</span>
                                <span>0 %</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <span className='fw-bold fs-5 ' style={{ color: "#79f" }} >To Pay</span>
                                <span>$ {calculateTotalAmount()}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between">
                                <input type="text" name='coupoun' placeholder='Apply Copoun' className={`form-group rounded-2 p-2 border-1 border-danger  mt-2 text-${isDarkMode ? "white" : "black"}`} />
                            </div>
                            <button className="btn btn-primary btn-sm  mt-3">Apply Coupon</button>
                            <div className="text-end mt-3">
                            </div>
                        </div>
                        <div className="mt-4">
                            <div className={`card mb-3 bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}  `}>
                                <div className="card-body">
                                    <h5 className="card-title">Address</h5>
                                    <select
                                        className="form-select"
                                        value={currentAddress.AddressID}
                                        onChange={(e) => setCurrentAddress(e.target.value)}
                                    >
                                        {addresses.map((address, index) => (
                                            <option key={index} value={address.AddressID}>
                                                {`${address.StreetAddress}, ${address.City}, ${address.State}, ${address.PostalCode}, ${address.Country}`}
                                            </option>
                                        ))}
                                    </select>
                                    <button className="btn btn-danger mt-4 btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal" aria-current="page" onClick={handleConfirmAddress}>
                                        Add New Address
                                    </button>
                                </div>
                            </div>
                            {/* address modal  */}
                            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className={`modal-content bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}`}>
                                        <div className="modal-header">
                                            <h1 className="modal-title fs-5" id="exampleModalLabel">Add New Address</h1>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="d-flex flex-column">
                                                <label htmlFor="streetAddress">Street Address:</label>
                                                <input type="text" value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)} required={true} />
                                                <label htmlFor="city">City:</label>
                                                <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required={true} />
                                                <label htmlFor="state">State:</label>
                                                <input type="text" value={state} onChange={(e) => setState(e.target.value)} required={true} />
                                                <label htmlFor="postalCode">Postal Code:</label>
                                                <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required={true} />
                                                <label htmlFor="country">Country:</label>
                                                <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required={true} />
                                            </div>
                                        </div>


                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <button type="button" className="btn btn-primary" onClick={handleConfirmAddress}>Confirm Address</button>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className={`card mb-3 bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}  `}>
                                <div className="card-body">
                                    <h5 className="card-title">Payment Option</h5>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="payment" value="online" onChange={handlePaymentMethodChange} checked={paymentMethod === 'online'} />
                                        <label className="form-check-label">Online</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="radio" className="form-check-input" name="payment" value="cod" onChange={handlePaymentMethodChange} checked={paymentMethod === 'cod'} />
                                        <label className="form-check-label">Cash on Delivery</label>
                                    </div>
                                </div>
                            </div>
                            <div className={`card mb-3 bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}  `}>
                                <div className="card-body d-flex flex-column">
                                    <label htmlFor="orderNote" className='card-title fw-bold '>Any Instructions</label>
                                    <TextField type="text" className='input-group rounded-2 border-0 mt-2 '
                                        name="orderNote"
                                        id="orderNote"
                                        value={orderNote}
                                        onChange={(e) => setorderNote(e.target.value)} />
                                </div>
                            </div>
                        </div>
                        {cartItems.length > 0 && (
                            <div className="text-center mt-4">
                                <button className="btn btn-primary" onClick={() => setOpenDialog(true)}>Proceed to Order</button>
                            </div>
                        )}
                    </div>

                </div>
                {/* This dilogue box show the summary for the order that is going to be placed  */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Order Summary</DialogTitle>
                    <DialogContent>
                        <div>
                            <h4>Selected Address:</h4>
                            {/* <p>{currentAddress}</p> */}
                        </div>
                        <div>
                            <h4>Payment Method:</h4>
                            {/* <p>{paymentMethod}</p> */}
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.Name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.Price * item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-end">
                            <TextField
                                label="Total Amount"
                                value={calculateTotalAmount()}
                                variant="outlined"
                                disabled
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        {paymentMethod === 'online' ? (
                            <Button onClick={(event) => handleOrderSubmit(event)} disabled={!stripe || loading}>
                                {loading ? 'Processing' : 'Pay'}
                            </Button>
                        ) : (
                            <Button onClick={handleOrderSubmit}>Confirm Order</Button>
                        )}

                    </DialogActions>
                </Dialog>
            </div>

        </>
    );
};


const WrappedPaymentForm = () => (
    <Elements stripe={stripePromise}>
        <Cart />
    </Elements>
);



export default WrappedPaymentForm;
