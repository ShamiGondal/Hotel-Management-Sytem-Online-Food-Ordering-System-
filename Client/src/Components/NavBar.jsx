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

const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!Cookies.get('token'));
    const navigate = useNavigate();



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

    const handleMenuOpen = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };


    const handleSignOut = () => {
        Cookies.remove('token'); // Remove token from cookies
        setIsLoggedIn(false); // Update login status
        navigate('/'); // Redirect to home page
    };

    const [isChecked, setIsChecked] = useState(false);
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
        toggleDarkMode();

    }

    return (
        <>
            <nav className={`navbar navbar-expand-lg  fixed-top bg-${isDarkMode ? 'dark' : 'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''} `}>
                <div className={`container-fluid `}>
                    <div className="navbar-brand d-flex gap-4">
                        <Button onClick={toggleDrawer}>
                            <i className="fa-solid fa-bars fw-bolder text-danger fs-4 "></i>
                        </Button>
                        <Link to="/"><i className="fa-solid fa-utensils fw-3 text-danger"></i></Link>
                        <Link to="/" className="btn btn-danger d-none d-md-inline">Delivery</Link>
                        <Link to="/" className="btn btn-danger d-none d-md-inline">Pickup</Link>
                    </div>
                    <div className="d-flex gap-3 me-md-5 " role="search">
                        <button onClick={() => navigate('/cart')} className="btn btn-outline-warning me-5  "><i className="fa-solid fa-cart-shopping "></i></button>
                        {Cookies.get('token') ? (
                            <div style={{ position: 'absolute', bottom: 55, left: 0, width: '100%',  }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px' }}>
                                    <Button onClick={handleMenuOpen} style={{ cursor: 'pointer', marginRight: '8px', marginBottom: -60, position: 'absolute', right: 10, borderRadius: 50, border: `1px solid #e0e0e0` }}>
                                        <img src={robotPng} alt="Footer Logo" style={{ height: '39px', width: '30px' }} />
                                    </Button>
                                    {/* Dropdown menu */}
                                    <Menu
                                        anchorEl={menuAnchorEl}
                                        open={Boolean(menuAnchorEl)}
                                        onClose={handleMenuClose}
                                        PaperProps={{
                                            style: {
                                                width: '200px', // Adjust the width as needed
                                                marginTop: '-10px', // Move the menu up
                                            },
                                        }}
                                    >
                                        <MenuItem onClick={() => handleMenuItemClick('My-Home')}>DashBoard</MenuItem>
                                        <hr className='bg-dark' />
                                        <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                                    </Menu>

                                </div>
                            </div>
                        ) : (
                            <button className="btn btn-danger rounded-2 d-none d-md-inline ">
                                <Link to='/Login' className="  text-decoration-none text-white " >Login</Link>
                            </button>
                        )}
                    </div>
                </div>
            </nav>
            <ul className={`nav justify-content-center d-md-none mt-5 bg-${isDarkMode ? 'dark' : 'light'}  food-items-container ${isDarkMode ? 'dark-mode' : ''} `}>
                <li className="nav-item mt-3 mb-2">
                    <button className=" btn btn-danger btn-sm rounded-2 " aria-current="page">Delivery</button>
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
                        },
                    }}
                >
                    <div style={{ width: 250, marginTop: 40 }}>
                        <div className="d-flex mt-3">
                            <IconButton
                                className="mt-2"
                                edge="end"
                                onClick={toggleDrawer}
                                sx={{ position: 'absolute', top: 0, right: 12 }}
                            >
                                <CloseIcon />
                            </IconButton>
                            {Cookies.get('token') ? (
                                <IconButton
                                    className="border-0 rounded-2 bg-danger btn-sm mt-2 text-white ms-1 fs-6 "
                                    edge="start"
                                    sx={{ position: 'absolute', top: 0, left: 10 }}
                                    onClick={handleSignOut}
                                >
                                    <MenuItem className="fs-6">Logout</MenuItem>
                                </IconButton>
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
