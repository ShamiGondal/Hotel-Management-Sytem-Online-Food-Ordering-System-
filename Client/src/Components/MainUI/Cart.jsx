// Cart component
import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useDarkMode } from '../Hooks/DarkModeContext';
import { useCartContext } from '../Hooks/useCart';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useStripe } from '@stripe/react-stripe-js';
import sendNotification from '../helper/NotificationSender'; // Correct import path
import { ToastContainer, toast } from 'react-toastify';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
console.log(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

const Cart = () => {

    //TODO: Have to update the table to accpet the order Note too
    const stripe = useStripe();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { cartItems,
        totalAmount,
        totalActualAmount,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        addSingleItemToCart,
        setTotalAmount,
        setTotalActualAmount
    } = useCartContext();
    const apiUri = import.meta.env.VITE_REACT_APP_API_URL;
    // const [confirmOrder, setConfirmOrder] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [currentAddress, setCurrentAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('online');
    const [validCoupon, setValidCoupon] = useState(null);
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');

    const [coupons, setCoupons] = useState([]);
    // const [totalAmount, setTotalAmount] = useState(0);
    const [couponInput, setCouponInput] = useState('');
    const [couponError, setCouponError] = useState('');

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



    useEffect(() => {
        const token = Cookies.get('token');
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `${token}`
        };
        fetch(`${apiUri}api/my-addresses`, { headers })
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
            const token = Cookies.get('token');

            // console.log("customer ID ok ", customerId)
            if (!token) {
                navigate('/Login');
            } else {
                const orderId = generateRandomOrderId(); // Generate order ID here
                const response = await fetch(`${apiUri}api/placeOrder`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`
                    },
                    body: JSON.stringify({
                        orderId: orderId,
                        orderItems: cartItems.map(item => ({
                            foodItemID: item.FoodItemID ? item.FoodItemID : item.AddonID,
                            quantity: item.quantity,
                            subtotal: totalAmount // Update subtotal calculation
                        })),
                        paymentStatus: 'Pending',
                        status: 'Pending',
                        orderNote: orderNote,
                        deliveryAddress: currentAddress
                    }),
                });

                const data = await response.json();
                console.log('Order placed successfully:', data);
                sendNotification('Order', 'Your order has been placed successfully!');
                toast.dismiss();
                toast.success('Order placed successfully');

                // Add payment for both online and COD payment methods
                fetch(`${apiUri}api/addPayment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`
                    },
                    body: JSON.stringify({
                        orderId: orderId,
                        amount: totalAmount // Send total amount for both online and COD payments
                    }),
                }).then(paymentResponse => paymentResponse.json())
                    .then(paymentData => {
                        console.log('Payment added successfully:', paymentData);

                        if (paymentMethod === 'online') {
                            handleStripePayment(orderId); // Call function to initiate Stripe payment AFTER adding payment
                        } else {
                            clearCart();
                            setOpenDialog(false);
                        }
                    })
                    .catch(error => {
                        console.error('Error adding payment:', error);
                    });
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };


    const handleStripePayment = async (orderId) => {
        const token = Cookies.get('token')
        try {
            const itemsToSend = cartItems.map(item => ({
                name: item.Title,
                price_data: {
                    currency: 'usd',
                    unit_amount: totalAmount, // Convert total price to cents
                    product_data: {
                        name: item.Title,
                    },
                },
                quantity: item.quantity,
            }));

            const response = await fetch(`${apiUri}api/payment-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items: itemsToSend, totalAmount: totalAmount }),
            });

            const { sessionId } = await response.json();

            const { error } = await stripe.redirectToCheckout({
                sessionId: sessionId,
            });

            if (error) {
                console.error(error);
                toast.error('Failed to redirect to checkout. Please try again.');
            } else {
                // Stripe payment successful, add payment to the database
                const addPaymentResponse = await fetch(`${apiUri}api/addPayment`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`
                    },
                    body: JSON.stringify({
                        orderId: orderId,
                        amount: totalAmount // Send total amount for both online and COD payments
                    }),
                });

                const addPaymentData = await addPaymentResponse.json();
                console.log('Payment added successfully:', addPaymentData);
                sendNotification('Order', 'Made Successful Payment!');
                clearCart();
                setOpenDialog(false);
            }
        } catch (error) {
            console.error('Error handling Stripe payment:', error);
            toast.error('Payment error. Please try again.');
        }
    };



    useEffect(() => {
        return () => {
            if (!Cookies.get('token')) {
                navigate('/')
            }
        };
    })

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await fetch(`${apiUri}api/getCoupons`, {
                    method: "GET"
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch coupons');
                }
                const data = await response.json();
                setCoupons(data);
                console.log("copouns", coupons)
            } catch (error) {
                console.error('Error fetching coupons:', error);
            }
        };

        fetchCoupons();
    }, []);



    const calculateTotalAmounts = () => {
        let total = 0;
        let actualTotal = 0;

        // Calculate total and actual total without coupon
        cartItems.forEach(item => {
            total += parseFloat(item.totalPrice) * item.quantity;
            actualTotal += parseFloat(item.totalActualPrice) * item.quantity;
        });

        // Add delivery charge
        total += 2;

        // Calculate tax amount
        const taxAmount = (total * 5) / 100;

        // Apply tax
        total += taxAmount;

        // Apply coupon discount if applicable
        if (validCoupon) {
            const discountAmount = parseFloat(validCoupon.CopounDiscountAmount);
            total -= discountAmount;
        }


        // Update state with calculated totals
        setTotalAmount(total.toFixed(2));
        setTotalActualAmount(actualTotal.toFixed(2));
    };

    useEffect(() => {
        calculateTotalAmounts();
    }, [cartItems, validCoupon]);

    const applyCoupon = () => {
        // You can add more validation logic here if needed
        if (!couponInput) {
            setCouponError('Please enter a coupon code.');
            return;
        }

        // Check if the entered coupon code matches any active coupon in the database
        const coupon = coupons.flat().find(coupon => {
            return coupon.status === 'active' && coupon.couponCode.toUpperCase() === couponInput.toUpperCase();
        });
        if (coupon) {
            toast.success("Coupon Applied")
            setValidCoupon(coupon);
        } else {
            // No valid coupon found
            setValidCoupon(null);
            setCouponError('Invalid or inactive coupon code. Please try again.');
        }
    };

    const handleCouponChange = (event) => {
        setCouponInput(event.target.value);
        setCouponError(''); // Clear any previous error when the input changes
    };


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
            const response = await fetch(`${apiUri}api/addAddress`, {
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

            <div className="mt-5 container pt-5">
                {/* this part is the cart section show the cart details  */}
                <div className={`p-5 card rounded-2 bg-${isDarkMode ? 'dark' : 'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''} mt-5 pt-5 `}>
                    <div className="container">
                        <h2 className={`text-center mb-4  text-${isDarkMode ? 'light' : 'dark'}`}>Your <i className="fa-solid fa-cart-shopping text-success"></i> has <span className='text-warning' >{cartItems.length}</span> Items</h2>
                        {cartItems && cartItems.map((item, index) => (
                            <div key={index} className={`card mb-4  bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'} `} style={{ borderRadius: '15px' }}>
                                <div className="card-body">
                                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                                        <div>
                                            <h3>{item.Title} {item.selectedSize && <small className='me-2'> ({item.selectedSize.size})</small>}</h3>
                                            <small className='me-2'>Per Item Cost</small>
                                            <small className='me-2'>
                                                {item.Title} -
                                                {item.selectedSize && item.selectedSize.price ? (
                                                    <small className='me-2'>${item.selectedSize.price}</small>
                                                ) : (
                                                    <small className='me-2'>${item.Price}</small>
                                                )}
                                            </small>
                                            <div className="d-flex">
                                                {item.selectedAdditions && item.selectedAdditions.length > 0 && (
                                                    <>
                                                        <small className='me-2'>{item.selectedAdditions.map(({ selection }) => selection).join(', ')}: </small>
                                                        <small className='me-2'>${item.selectedAdditions.map(({ price }) => price).join(', ')}</small>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleRemove(index)}>Remove</button>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center mt-2 d-flex flex-column flex-md-row mt-2 mt-md-">
                                        <div>
                                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleDecrease(index)}>-</button>
                                            <span className="mx-2">{item.quantity}</span>
                                            <button className="btn btn-outline-secondary btn-sm" onClick={() => handleIncrease(index)}>+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className={`mt-4  bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}`}>
                            {cartItems && cartItems.length > 0 && (
                                <div>
                                    {cartItems.map((item, index) => (
                                        <div key={index}>
                                            {/* Your existing cart item display logic */}
                                        </div>
                                    ))}
                                    <hr />
                                    <div className={`d-flex justify-content-between `}>
                                        <span>Total Actual Price</span>
                                        <span>
                                            <small>${cartItems.reduce((total, item) => total + parseFloat(item.totalActualPrice || 0), 0)}</small>
                                        </span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <span>Total Price</span>
                                        <span>
                                            <small>${cartItems.reduce((total, item) => total + parseFloat(item.totalPrice || 0), 0)}</small>
                                        </span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <span>Delivery Charges</span>
                                        <span>$ 2</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between">
                                        <span>Tax and Charges</span>
                                        <span>5 %</span> {/* Assuming tax is 5% */}
                                    </div>
                                </div>
                            )}

                            <hr />

                            <div className="d-md-flex justify-content-between">
                                <input
                                    type="text"
                                    name='coupon'
                                    placeholder='Apply Coupon'
                                    className={`form-group rounded-2 p-2 border-1 border-danger mt-2 text-${isDarkMode ? "white" : "black"}`}
                                    value={couponInput}
                                    onChange={handleCouponChange}
                                />
                                <button className="btn btn-primary btn-sm mt-2" onClick={applyCoupon}>
                                    Apply Coupon
                                </button>
                            </div>
                            {couponError && <div className="text-danger">{couponError}</div>}
                            <hr />
                            <div className="d-flex justify-content-between">
                                <span className='fw-bold fs-5' style={{ color: "#79f" }}>To Pay</span>
                                {cartItems && cartItems.length > 0 ? (
                                    <span>$ {totalAmount}</span>
                                ) : (
                                    <span>$ 0</span>

                                )}
                            </div>

                            <hr />
                            <div className="text-end mt-3">
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className={`card mb-3 bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}  `}>
                                <div className="card-body">
                                    <h5 className="card-title">Address</h5>
                                    <select
                                        className="form-select"
                                        value={currentAddress.AddressID} // Set value to the AddressID of the current address
                                        onChange={(e) => setCurrentAddress(addresses.find(address => address.AddressID === parseInt(e.target.value)))} // Update currentAddress based on the selected option
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
                            <div className={`card mb-3 bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}`}>
                                <div className="card-body d-flex flex-column">
                                    <label htmlFor="orderNote" className="card-title fw-bold">Any Instructions</label>
                                    <textarea
                                        type="text"
                                        className={`form-control mt-2 bg-${isDarkMode ? 'dark' : 'light'} text-${isDarkMode ? 'light' : 'dark'}`}
                                        name="orderNote"
                                        id="orderNote"
                                        rows={2}
                                        value={orderNote}
                                        onChange={(e) => setorderNote(e.target.value ? e.target.value : 'No Instruction')}
                                    />
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
                            <p>
                                {currentAddress && `${currentAddress.StreetAddress}, ${currentAddress.City}, ${currentAddress.State}, ${currentAddress.PostalCode}, ${currentAddress.Country}`}
                            </p>

                        </div>
                        <div>
                            <h4>Payment Method:</h4>
                            <p>{paymentMethod === 'online' ? 'Online' : 'Cash on Delivery'}</p>
                        </div>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Addtions</th>
                                    <th>Quantity</th>
                                    {/* <th>Total</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.Title}
                                            {item.selectedSize && <small className='me-2'>-({item.selectedSize.size}) </small>}
                                        </td>
                                        <td>
                                            {item.selectedAdditions && item.selectedAdditions.length > 0 &&
                                                item.selectedAdditions.map((addition, idx) => (
                                                    <span key={idx} className='me-2'>{addition.selection}</span>
                                                ))
                                            }
                                        </td>
                                        <td>{item.quantity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-end">
                            <TextField
                                label="Total Amount"
                                value={totalAmount}
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
                <ToastContainer />
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
