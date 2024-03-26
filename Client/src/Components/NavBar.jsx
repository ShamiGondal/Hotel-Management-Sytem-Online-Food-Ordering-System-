import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Button } from "@mui/material";
import { useDarkMode } from "./Hooks/DarkModeContext";
import Cookies from "js-cookie";
import { useCartContext } from "./Hooks/useCart";
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const Navbar = () => {

    //TODO : HAVE TO UPDATE THE DELIVERY BUTOON FUNCTIONALITY FOR NOW EVERYTIME IT TAKES ADDRESS BUT NEED TO UPDATE IT

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('token'));
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({});
    const apiUri = import.meta.env.VITE_REACT_APP_API_URL;
    const { cartItems } = useCartContext();
    const [imageSrc, setImageSrc] = useState('');
    const { isDarkMode, toggleDarkMode, isDrawerDarkMode, setIsDrawerDarkMode } = useDarkMode();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [streetAddress, setStreetAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');
    const [imageUpdated, setImageUpdated] = useState(false);
    const [UniqueCategories, setUniqueCategories] = useState([]);
    const [foodItems, setFoodItems] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const notificationRef = useRef(null);
    const [notifications, setNotifications] = useState([]); // State to hold notifications
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        setIsDrawerDarkMode(isDarkMode);
    }, [isDarkMode, setIsDrawerDarkMode]);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };


    const handleMenuItemClick = (menuItem) => {
        setDrawerOpen(false); // Close the drawer after selecting an item
        // Navigate to the corresponding URL
        navigate(`/${menuItem.replace(' ', '-')}`);
        // For the Login menu item, set the selected menu item to null to prevent duplicate rendering
        if (menuItem === 'Login') {
            setSelectedMenuItem(null);
        } else {
            setSelectedMenuItem(menuItem);
        }
    };


    const handleSignOut = () => {
        Cookies.remove('token'); // Remove token from cookies
        setIsLoggedIn(false); // Update login status
        navigate('/'); // Redirect to home page
    };


    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
        toggleDarkMode();

    }

    const handleMenuOpens = () => {
        setIsMenuOpen(true);
    };

    const handleMenuCloses = () => {
        setIsMenuOpen(false);
    };

    if (isDrawerDarkMode) {
        document.body.style.backgroundColor = 'black';
    } else {
        document.body.style.backgroundColor = 'white';
    }



    useEffect(() => {
        const fetchToken = () => {
            const token = Cookies.get('token');
            setIsLoggedIn(!!token); // Update isLoggedIn based on the presence of token

        }
        fetchToken();
        const intervalId = setInterval(fetchToken, 1000);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []);


    useEffect(() => {
        if (isLoggedIn || imageUpdated) {
            const fetchImage = async () => {
                try {
                    const token = Cookies.get('token');
                    if (!token) {
                        console.error('Token is missing.');
                        return;
                    }

                    const response = await fetch(`${apiUri}api/my-Image`, {
                        method: 'GET',
                        headers: {
                            'Authorization': token
                        }
                    });

                    if (!response.ok) {
                        console.error('Error fetching image:', response.statusText);
                        return;
                    }

                    const blob = await response.blob();
                    const imageUrl = URL.createObjectURL(blob);
                    setImageSrc(imageUrl);
                    console.log('Image fetched successfully.');
                } catch (error) {
                    console.error('Error fetching image:', error);
                }
            };

            // Fetch the image initially
            fetchImage();

            // Set imageUpdated to false once the image is fetched
            if (imageUpdated) {
                setImageUpdated(false);
            }
        }
    }, [isLoggedIn, imageUpdated]);


    const token = Cookies.get('token');
    useEffect(() => {
        if (token) {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            };

            fetch(`${apiUri}api/getCustomer`, { headers })
                .then(response => response.json())
                .then(data => setUserDetails(data))
                .catch(error => console.error('Error fetching Customer:', error));

        }
    }, [token, setUserDetails]);


    const handleConfirmAddress = async () => {
        const addressData = {
            streetAddress: streetAddress,
            city: city,
            state: state,
            postalCode: postalCode,
            country: country,
        };

        try {
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
            navigate('/')
        } catch (error) {
            console.error('Error adding address:', error);
            // Handle error appropriately (e.g., show error message)
        }
    };


    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    console.error('Token is missing.');
                    return;
                }

                const response = await fetch(`${apiUri}api/my-addresses`, {
                    headers: {
                        'Authorization': token
                    }
                });

                if (!response.ok) {
                    console.error('Error fetching addresses:', response.statusText);
                    return;
                }

                const data = await response.json();
                // Sort addresses by date in descending order
                data.sort((a, b) => new Date(b.date) - new Date(a.date));
                // Select the most recent address
                const mostRecentAddress = data[0];
                setAddresses([mostRecentAddress]);
            } catch (error) {
                console.error('Error fetching addresses:', error);
            }
        };

        fetchAddresses();
    }, [isLoggedIn]);


    // Function to toggle notification box visibility
    const toggleNotification = () => {
        setShowNotification(prevState => !prevState);
    };


    const playNotificationSound = () => {
        const audio = new Audio('../assets/audios/notifications-sound-127856.mp3');
        audio.play();
    };

    // playNotificationSound();
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const token = Cookies.get('token');

                // Fetch customer notifications
                const response = await fetch(`${apiUri}api/notifications/customer`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch customer notifications');
                }
                const customerNotifications = await response.json();

                // Fetch promotion notifications
                const promotionResponse = await fetch(`${apiUri}api/notifications/promotions`, {
                    method: 'GET',
                });
                if (!promotionResponse.ok) {
                    throw new Error('Failed to fetch promotion notifications');
                }
                const promotionNotifications = await promotionResponse.json();

                // Concatenate promotion notifications with customer notifications
                const allNotifications = [...customerNotifications, ...promotionNotifications];
                setNotifications(allNotifications.reverse());

                // Filter unread notifications
                const unread = allNotifications.filter(notification => notification.IsCustomerRead === 0);
                setUnreadNotifications(unread);
                if (unread.length > 0) {
                    playNotificationSound();
                }
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        // Call the function to fetch notifications
        fetchNotifications();

        // Poll for new notifications every 30 seconds
        const notificationPollingInterval = setInterval(fetchNotifications, 3000);

        return () => clearInterval(notificationPollingInterval);
    }, [isLoggedIn]);


    const markNotificationAsRead = async (notificationId) => {
        try {
            await fetch(`${apiUri}api/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    isCustomerRead: 1, // Set IsCustomerRead to 1 when notification is clicked
                }),
            });

            // Update the local state to mark the notification as read
            const updatedNotifications = notifications.map((notification) =>
                notification.notification_id === notificationId
                    ? { ...notification, IsCustomerRead: 1 }
                    : notification
            );
            setNotifications(updatedNotifications);

            // Remove the notification from unreadNotifications if it was there
            setUnreadNotifications((prevNotifications) =>
                prevNotifications.filter((id) => id !== notificationId)
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotification(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    // Function to toggle the menu dropdown
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    //getting menu for drawer
    useEffect(() => {
        // Fetch food items from the endpoint
        fetch(`${apiUri}api/getFoodItems`)
            .then(response => response.json())
            .then(data => {
                // Filter out unique categories from the fetched data
                const uniqueCategories = data.reduce((categories, item) => {
                    if (!categories.includes(item.Category)) {
                        categories.push(item.Category);
                    }
                    return categories;
                }, []);

                // Update the component state with the fetched food items and unique categories
                setFoodItems(data);
                setUniqueCategories(uniqueCategories);
                console.log(uniqueCategories)
                console.log(data)
            })
            .catch(error => {
                // Handle errors
                console.error('Error fetching food items:', error);
                // You can set an error state or display an error message here if needed
            });
    }, []);


    return (
        <>
            <ToastContainer />
            <nav className={`navbar navbar-expand-lg fixed-top bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}    `}>
                <div className="container-fluid">
                    <div className="navbar-brand d-flex gap-4">
                        <Button onClick={toggleDrawer}>
                            <i className="fa-solid fa-bars fw-bolder text-danger fs-4 "></i>
                        </Button>
                        <Link to="/"><i className="fa-solid fa-utensils fw-3 text-danger"></i></Link>
                        {isLoggedIn && addresses.length > 0 ? (
                            addresses.map((address, index) => (
                                <Link key={index} to="#" className={`btn btn-danger d-none d-md-block btn-sm rounded-2 bg-transparent text-${isDarkMode ? "light" : "danger"} border-0`} type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" aria-current="page">
                                    <div>
                                        <i className="fa-solid fa-location-dot text-danger me-2"></i>
                                        {address && address.City && address.State && address.PostalCode && address.Country ? (
                                            `${address.City}, ${address.State}, ${address.PostalCode}, ${address.Country}`
                                        ) : (
                                            "Pick Location"
                                        )}
                                    </div>

                                </Link>
                            ))
                        ) : (
                            <Link to={isLoggedIn ? "#" : "/Login"} className={`btn btn-danger text-${isDarkMode ? "light" : "danger"}  d-none d-md-block btn-sm rounded-2 bg-transparent  border-0`} >
                                <i className={`fa-solid fa-plus text-danger me-2"`}></i>{" Add Address"}
                            </Link>
                        )}

                    </div>

                    <div className="d-flex gap-3 me-md-5" role="search">
                        {Cookies.get('token') ? (
                            <div className="d-none d-md-inline" style={{ position: 'absolute', bottom: 55, left: 0, width: '100%' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px' }}>
                                    <button
                                        onMouseEnter={handleMenuOpens}
                                        onMouseLeave={handleMenuCloses}
                                        style={{
                                            cursor: 'pointer',
                                            marginBottom: -60,
                                            position: 'absolute',
                                            right: 10,
                                            padding: 0,
                                            width: '40px',
                                            height: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginRight: "260px",
                                            border: 'none',
                                            background: "transparent"
                                        }}
                                    >
                                        <img src={imageSrc} alt="Footer Logo" style={{ height: '30px', width: '30px', marginRight: '20px', borderRadius: '50%' }} />
                                        <div className={`d-flex text-${isDarkMode ? 'light' : 'dark'} fw-medium`} style={{ fontSize: '13px', display: 'flex', whiteSpace: 'nowrap' }}>
                                            Hi! {Object.keys(userDetails).length > 0 && `${userDetails.FirstName}  `}
                                            <i className="fa-solid fa-caret-down text-danger ms-2 fs-6 "></i>
                                        </div>
                                        {/* Custom Menu */}
                                        <ul
                                            className={`custom-menu bg-${isDarkMode ? "dark" : "light"} text-${isDarkMode ? "light" : "dark"}`}
                                            style={{
                                                left: 'calc(100% - 100px - 70px)', // Adjust the left position to create space from the right side
                                                width: '250px', // Set the width to your desired value
                                                display: isMenuOpen ? 'block' : 'none',
                                                flexDirection: 'column',
                                                padding: '0',
                                                margin: '0',
                                                marginTop: '-9px',
                                                listStyleType: 'none',
                                                backgroundColor: '#fff',
                                                transition: 'all 0.3s ease-in-out',
                                                position: 'absolute', top: '100%', right: 0, maxHeight: '300px', overflowY: 'auto', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 999,

                                            }}
                                        >

                                            <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => handleMenuItemClick('My-Home')}><i className="fa-solid fa-gauge text-danger fs-5"></i> Dashboard</li>
                                            <li style={{ padding: '8px 16px', cursor: 'pointer', borderTop: '1px solid #ccc' }} onClick={handleSignOut}><i className="fa fa-sign-out text-danger" aria-hidden="true"></i> Sign Out</li>
                                            <li style={{ padding: '8px 16px', cursor: 'pointer', borderTop: '1px solid #ccc' }}><i className="fa-solid fa-circle-info text-danger"></i> Help Center</li>
                                        </ul>

                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button className="btn btn-danger rounded-2 d-none d-md-inline">
                                <Link to='/Login' className="text-decoration-none text-white">Login</Link>
                            </button>
                        )}
                        <div style={{ position: 'relative' }}>
                            <button onClick={() => navigate('/cart')} className="btn btn-outline-warning" style={{ marginRight: '0px' }}>
                                <i className="fa-solid fa-cart-shopping"></i>
                            </button>
                            <span className={`badge food-items-container  ${isDarkMode ? 'dark-mode' : 'light-mode'}`} style={{ position: 'absolute', top: -5, right: -10, marginRight: '0px' }}>
                                {cartItems.length}
                            </span>
                        </div>

                        {/* Notification Icon with Badge */}
                        <div style={{ position: 'relative' }}>
                            <button className="btn bg-bg-transparent  text-danger " onClick={toggleNotification}>
                                <i className="fa-solid fa-bell"></i>
                            </button>
                            {unreadNotifications && (
                                <span className="badge bg-danger" style={{ position: 'absolute', top: '-10px', right: '-10px' }}>
                                    {unreadNotifications.length}
                                </span>
                            )}
                            {showNotification && (
                                <div
                                    ref={notificationRef}
                                    className={`notification-box rounded-2 border-warning shadow-lg bg-${isDarkMode ? 'dark' : 'light'}`}
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        width: '300px',
                                        maxHeight: '400px',
                                        overflowY: 'auto',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        zIndex: 999,
                                    }}
                                >
                                    {notifications.map((notification, index) => (
                                        <div key={index}>
                                            <div
                                                className={`p-4 fst-italic  fs-6 text-${isDarkMode ? 'light' : 'dark'} fw-${notification.IsCustomerRead === 0 ? 'bold' : 'light'}`}
                                                onClick={() => markNotificationAsRead(notification.notification_id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <div className="d-flex justify-content-between ">
                                                    <p>{notification.message}</p>
                                                    <p className="text-danger fw-bold">{notification.type}</p>
                                                </div>
                                                <small>{new Date(notification.created_at).toLocaleString()}</small>
                                            </div>
                                            {index !== notifications.length - 1 && <hr className="notification-divider" />}
                                        </div>
                                    ))}

                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            {/* modal for the delivery*/}
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
            {/* address taking */}
            <ul className={`nav justify-content-center d-md-none mt-5 bg-${isDarkMode ? 'dark' : 'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''} `}>
                <li className="nav-item mt-3 mb-2 ">
                    {isLoggedIn && addresses.length > 0 ? (
                        addresses.map((address, index) => (
                            <Link key={index} to="#" className={`btn btn-danger btn-sm rounded-2  bg-transparent text-${isDarkMode ? "light" : "danger"} border-0 z-3 `} type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" aria-current="page">
                                <div>
                                    <i className="fa-solid fa-location-dot text-danger me-2"></i>
                                    {address && address.City && address.State && address.PostalCode && address.Country ? (
                                        `${address.City}, ${address.State}, ${address.PostalCode}, ${address.Country}`
                                    ) : (
                                        "Pick Location"
                                    )}
                                </div>

                            </Link>
                        ))
                    ) : (
                        <Link to={isLoggedIn ? "#" : "/Login"} className={`btn btn-danger btn-sm rounded-2 bg-transparent  border-0 text-${isDarkMode ? "light" : "danger"} `} >
                            <i className="fa-solid fa-plus text-danger me-2"></i>{"Add Address"}
                        </Link>
                    )}
                </li>


            </ul>
            {/* drawer  */}
            <div className='container-fluid'>
                <Drawer
                    open={drawerOpen}
                    onClose={toggleDrawer}
                    anchor="left"
                    sx={{
                        '& .MuiDrawer-paper': {
                            overflowX: 'hidden',
                            backgroundColor: isDrawerDarkMode ? '#181b1e' : 'white',
                            color: isDrawerDarkMode ? 'white' : 'black',
                            boxShadow: '5px 5px 15px rgba(0,0,0,.4)',
                            overflowY: 'auto', // Enable vertical scrolling
                            maxHeight: '100vh', // Set maximum height to viewport height
                            scrollbarWidth: 'thin', // Thin scrollbar
                            scrollbarColor: 'red pink', // Pink scrollbar
                            scrollbarTrackColor: 'transparent', // Hide scrollbar track
                        },
                    }}
                >
                    <div style={{ width: 250, marginTop: 40 }}>
                        <div className={`d-flex mt-3 text-${isDarkMode ? 'light' : 'black'} `}>
                            <IconButton
                                className={`mt-2 text-${isDarkMode ? 'light' : 'black'}`}
                                edge="end"
                                onClick={toggleDrawer}
                                sx={{ position: 'absolute', top: 0, right: 12 }}
                            >
                                <CloseIcon />
                            </IconButton>
                            {/* {This is for small devices} */}
                            {Cookies.get('token') ?
                                (
                                    <div className=" d-md-none " style={{ position: 'absolute', top: 70, right: 220, width: '100%', }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px' }}>
                                            <button
                                                className="border-0 bg-transparent d-flex flex-column"
                                                style={{
                                                    marginRight: '-43px',
                                                    marginBottom: 40,
                                                    position: 'absolute',
                                                    right: 0,
                                                    borderRadius: '50%',
                                                    padding: 0, // Remove default padding
                                                    width: '40px', // Set width to make it round
                                                    height: '40px', // Set height to make it round
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <img src={imageSrc} alt="Footer Logo" style={{ height: '60px', width: '60px', marginRight: '20px', borderRadius: '50%' }} />
                                                <div className={`d-flex mt-2 ms-5  fw-medium text-${isDarkMode ? 'light' : 'dark'} `} style={{ fontSize: '13px', display: 'flex', whiteSpace: 'nowrap' }}>
                                                    Hi! {Object.keys(userDetails).length > 0 && `${userDetails.FirstName}  `}
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                ) : (
                                    <IconButton
                                        className="border-0 rounded-2 bg-danger btn-sm mt-2 text-white ms-1 fs-6 "
                                        edge="start"
                                        sx={{ position: 'absolute', top: 0, left: 10 }}
                                        onClick={() => handleMenuItemClick('Login')}
                                    >
                                        <MenuItem className="fs-6">Login</MenuItem>
                                    </IconButton>
                                )}


                            <IconButton
                                className="border-0 mt-5 mt-md-2 rounded-0 d-flex justify-content-center align-content-center"
                                edge="end"
                                sx={{ position: 'relative', left: 14 }}
                            >
                                <FormControlLabel
                                    className={`text-${isDarkMode ? 'light' : 'black'}`}
                                    control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
                                    label={isChecked ? "Night" : "Day"}
                                />
                            </IconButton>
                        </div>
                        {/* Render menu items */}
                        <hr className="bg-dark" />
                        <MenuItem onClick={toggleMenu} className="d-flex justify-content-between " >Our Menu
                            {menuOpen ? <i className="fa-solid fa-minus"></i> : <i className="fa-solid fa-plus"></i>}
                        </MenuItem>
                        {menuOpen && (
                            <div>
                                {
                                    UniqueCategories && UniqueCategories.filter(category => category !== null).map((category, index) => (
                                        <div key={index} className="mx-2">
                                            <MenuItem className={`text-${isDarkMode ? 'light' : 'dark'}`} onClick={() => handleMenuItemClick('FoodMenu')}>
                                                {category}
                                            </MenuItem>
                                        </div>
                                    ))
                                }
                            </div>
                        )}
                        <MenuItem className="d-flex justify-content-between d-md-none " onClick={() => handleMenuItemClick('My-Home')}>DashBoard <i className="fa-solid fa-gauge text-danger fs-5"></i></MenuItem>
                        <MenuItem onClick={() => handleMenuItemClick('Reservations')}>Reservations</MenuItem>
                        <MenuItem onClick={() => handleMenuItemClick('Complaints')}>Complaints</MenuItem>
                        <hr className="bg-dark" />
                        <MenuItem onClick={() => handleMenuItemClick('Track-Order')}>Track Order</MenuItem>
                        <MenuItem onClick={() => handleMenuItemClick('Store-Locator')}>Store Locator</MenuItem>
                        <MenuItem onClick={() => handleMenuItemClick('Feedbacks')}>Feedbacks</MenuItem>
                        <MenuItem onClick={() => handleMenuItemClick('PrivacyPolicy')}>Privacy Policy</MenuItem>
                        <MenuItem className="d-flex justify-content-between d-md-none">Help Center <i className="fa-solid fa-circle-info text-danger"></i></MenuItem>
                        <MenuItem className="d-flex justify-content-between d-md-none" onClick={() => handleSignOut()}>SignOut <i className="fa fa-sign-out text-danger" aria-hidden="true"></i></MenuItem>
                    </div>


                </Drawer>
            </div>
            <Outlet />

        </>
    )
}

export default Navbar;
