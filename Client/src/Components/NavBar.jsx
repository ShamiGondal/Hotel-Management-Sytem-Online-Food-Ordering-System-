import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import robotPng from "../assets/robot.png"
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import CustomerLogin from "./CustomerLogin";
import Reservations from '../Components/Reservations';
import Complaints from '../Components/Complaints';
import Feedbacks from '../Components/Feedback';
import { Button } from "@mui/material";
import { useDarkMode } from "./Hooks/DarkModeContext";
import Cookies from "js-cookie";
import PrivacyPolicy from "./PrivacyPolicy";
import { useCartContext } from "./Hooks/useCart";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';

const Navbar = () => {

    //TODO : HAVE TO UPDATE THE DELIVERY BUTOON FUNCTIONALITY FOR NOW EVERYTIME IT TAKES ADDRESS BUT NEED TO UPDATE IT
    
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('token'));
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();
    const [Room, setRoom] = useState('');
    const [Street, setStreet] = useState('');
    const [PhoneNumber, setPhoneNumber] = useState('');
    const [userDetails, setUserDetails] = useState({});
    const [position, setPosition] = useState(null);
    const localhost = `http://localhost:4000`
    const { cartItems } = useCartContext();
    const [imageSrc, setImageSrc] = useState('');
    const { isDarkMode, toggleDarkMode, isDrawerDarkMode, setIsDrawerDarkMode } = useDarkMode();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
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

    const token = Cookies.get('token');
    useEffect(() => {
        if (token) {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `${token}`
            };

            fetch(`${localhost}/api/getCustomer`, { headers })
                .then(response => response.json())
                .then(data => setUserDetails(data))
                .catch(error => console.error('Error fetching Customer:', error));

        }
    }, [token, setUserDetails]);




    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setPosition([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.error('Error getting geolocation:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }

        // Check login status
        const token = Cookies.get('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, []);

    //EXTRACTING ADDRESS
    useEffect(() => {
        if (position) {
            const map = L.map('map').setView(position, 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            L.marker(position).addTo(map)
                .bindPopup('You are here')
                .openPopup();

            // Resize the map to fit the modal
            setTimeout(() => map.invalidateSize(), 100);
        }
    }, [position]);


    function generateRandomId() {
        return Math.floor(1000 + Math.random() * 9000);
    }

    const handleConfirmAddress = async () => {
        if (Cookies.get('token') && position) {
            try {
                const [latitude, longitude] = position;
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                const data = await response.json();

                let formattedAddress = '';

                if (data.address) {
                    const { city, state, postcode, country } = data.address;
                    const street = Street
                    const road = Room
                    if (road) {
                        formattedAddress += road + ', ';
                    }
                    if (road) {
                        formattedAddress += street + ', ';
                    }
                    if (city) {
                        formattedAddress += city + ', ';
                    }
                    if (state) {
                        formattedAddress += state + ', ';
                    }
                    if (postcode) {
                        formattedAddress += postcode + ', ';
                    }
                    if (country) {
                        formattedAddress += country;
                    }
                }

                if (!formattedAddress) {
                    throw new Error('Failed to get address details');
                }

                const token = Cookies.get('token');
                const addAddressResponse = await fetch(`${localhost}/api/addAddress`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`
                    },
                    body: JSON.stringify({
                        addressID: generateRandomId(),
                        address: formattedAddress,
                        phoneNumber: PhoneNumber,

                    })
                });

                if (addAddressResponse.ok) {
                    toast.success('Address confirmed successfully!');
                    navigate('/FoodMenu')
                } else {
                    throw new Error('Failed to confirm address');
                }
            } catch (error) {
                console.error('Error confirming address:', error);
                toast.error('Failed to confirm address. Please try again.');
            }
        } else {
            toast.error('Please login to confirm address.');
            navigate('/Login')
        }
    };


    return (
        <>
            <ToastContainer />
            <nav className={`navbar navbar-expand-lg  fixed-top bg-${isDarkMode ? 'dark' : 'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''} `}>
                <div className={`container-fluid `}>
                    <div className="navbar-brand d-flex gap-4">
                        <Button onClick={toggleDrawer}>
                            <i className="fa-solid fa-bars fw-bolder text-danger fs-4 "></i>
                        </Button>
                        <Link to="/"><i className="fa-solid fa-utensils fw-3 text-danger"></i></Link>
                        <Link to="/" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-danger d-none d-md-inline"  >Delivery</Link>
                        <Link to="/" className="btn btn-danger d-none d-md-inline">Pickup</Link>
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
                                            marginRight: "180px",
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
                                            className="custom-menu"
                                            style={{
                                                position: 'absolute',
                                                top: '100%',
                                                left: 'calc(100% - 100px - 70px)', // Adjust the left position to create space from the right side
                                                zIndex: 999,
                                                width: '250px', // Set the width to your desired value
                                                display: isMenuOpen ? 'block' : 'none',
                                                flexDirection: 'column',
                                                padding: '0',
                                                margin: '0',
                                                marginTop: '-9px',
                                                listStyleType: 'none',
                                                backgroundColor: '#fff',
                                                boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
                                                transition: 'all 0.3s ease-in-out',
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
                            <span className={`badge food-items-container ${isDarkMode ? 'dark-mode' : 'light-mode'}`} style={{ position: 'absolute', top: -5, right: -10, marginRight: '0px' }}>
                                {cartItems.length}
                            </span>
                        </div>
                    </div>
                </div>
            </nav>
            {/* modal for the delivery*/}
             <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className={`modal-content bg-${isDarkMode ? 'dark' : 'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''} `}>
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div id="map" style={{ height: '400px', width: '100%' }}></div>
                            <div className="d-flex flex-column">
                                <label htmlFor="room">Room/Floor:</label>
                                <input type="text" value={Room} onChange={(e) => setRoom(e.target.value)} />
                                <label htmlFor="road">Street:</label>
                                <input type="text" value={Street} onChange={(e) => setStreet(e.target.value)} />
                                <label htmlFor="number">Phone Number:</label>
                                <input type="tel" value={PhoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleConfirmAddress}>Confirm Address</button>
                        </div>
                    </div>
                </div>
            </div>
            <ul className={`nav justify-content-center d-md-none mt-5 bg-${isDarkMode ? 'dark' : 'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''} `}>
                <li className="nav-item mt-3 mb-2">
                    <button className=" btn btn-danger btn-sm rounded-2 " type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" aria-current="page">Delivery</button>
                </li>
                <li className="nav-item mt-3 mb-2 ms-3">
                    <button className="btn btn-danger btn-sm rounded-2">Pickup</button>
                </li>

            </ul>

            <div className='container-fluid'>
                <Drawer
                    open={drawerOpen}
                    onClose={toggleDrawer}
                    anchor="left"
                    sx={{
                        '& .MuiDrawer-paper': {
                            overflowX: 'hidden',
                            overflowY: 'hidden',
                            backgroundColor: isDrawerDarkMode ? '#181b1e' : 'white',
                            color: isDrawerDarkMode ? 'white' : 'black',
                            boxShadow: '5px 5px 15px rgba(0,0,0,.4)',
                        },
                    }}
                >
                    <div style={{ width: 250, marginTop: 40 }}>
                        <div className={`d-flex mt-3 text-${isDarkMode ? 'light' : 'black'} `}>
                            <IconButton
                                className="mt-2"
                                edge="end"
                                onClick={toggleDrawer}
                                sx={{ position: 'absolute', top: 0, right: 12, color: isDarkMode ? 'light' : 'black' }}
                            >
                                <CloseIcon />
                            </IconButton>
                            {/* {This is for small devices} */}
                            {Cookies.get('token') ?
                                (
                                    <div className=" d-md-none " style={{ position: 'absolute', bottom: 55, right: 160, width: '100%', }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px' }}>
                                            <button
                                                onMouseEnter={handleMenuOpens}
                                                onMouseLeave={handleMenuCloses}
                                                className="border-0 bg-transparent"
                                                style={{
                                                    cursor: 'pointer',
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
                                                <div className={`d-flex  fw-medium text-${isDarkMode ? 'light': 'dark'} `} style={{ fontSize: '13px', display: 'flex', whiteSpace: 'nowrap' }}>
                                                    Hi! {Object.keys(userDetails).length > 0 && `${userDetails.FirstName}  `}
                                                    <i className="fa-solid fa-caret-up text-danger ms-2 fs-6 "></i>
                                                </div>
                                            </button>

                                            <ul
                                                className={`custom-menu  ` }
                                                style={{
                                                    position: 'absolute',
                                                    top: 'calc(50% - 200px)', // Adjust the calculation based on the desired distance from the top
                                                    right: 'calc(50% - 400px)',
                                                    zIndex: 999,
                                                    width: '250px', // Set the width to your desired value
                                                    display: isMenuOpen ? 'block' : 'none',
                                                    flexDirection: 'column',
                                                    padding: '0',
                                                    margin: '0',
                                                    listStyleType: 'none',
                                                    backgroundColor: '#fff',
                                                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
                                                    transition: 'all 0.3s ease-in-out',
                                                }}
                                            >
                                                <li style={{ padding: '8px 16px', cursor: 'pointer' }} onClick={() => handleMenuItemClick('My-Home')}><i className="fa-solid fa-gauge text-danger fs-5"></i> Dashboard</li>
                                                <li style={{ padding: '8px 16px', cursor: 'pointer', borderTop: '1px solid #ccc' }} onClick={handleSignOut}><i className="fa fa-sign-out text-danger" aria-hidden="true"></i> Sign Out</li>
                                                <li style={{ padding: '8px 16px', cursor: 'pointer', borderTop: '1px solid #ccc' }}><i className="fa-solid fa-circle-info text-danger"></i> Help Center</li>
                                            </ul>


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
                                className="border-0 mt-3 rounded-0 d-flex justify-content-center align-content-center"
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
                        <MenuItem onClick={() => handleMenuItemClick('Store-Locator')}>Store Locator</MenuItem>
                        <MenuItem onClick={() => handleMenuItemClick('Track-Order')}>Track Order</MenuItem>
                        <hr className="bg-dark" />
                        <MenuItem onClick={() => handleMenuItemClick('Feedbacks')}>Feedbacks</MenuItem>
                        <MenuItem onClick={() => handleMenuItemClick('Complaints')}>Complaints</MenuItem>
                        <MenuItem onClick={() => handleMenuItemClick('Reservations')}>Reservations</MenuItem>
                        <MenuItem onClick={() => handleMenuItemClick('PrivacyPolicy')}>Privacy Policy</MenuItem>
                    </div>


                </Drawer>

                {selectedMenuItem === 'Login' && <CustomerLogin />}
                {selectedMenuItem === 'Reservations' && <Reservations />}
                {selectedMenuItem === 'Complaints' && <Complaints />}
                {selectedMenuItem === 'Feedbacks' && <Feedbacks />}
                {selectedMenuItem === 'PrivacyPolicy' && <PrivacyPolicy />}

            </div>
            <Outlet />

        </>
    )
}

export default Navbar;
