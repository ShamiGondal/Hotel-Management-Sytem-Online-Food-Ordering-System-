import { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import robotPng from "../../assets/robot.png"
import Cookies from 'js-cookie';
import { Outlet, useNavigate } from 'react-router-dom';
import Settings from '../Admin/AdminSettings';
import Orders from '../Admin/CustomerOrders';
import Reservations from '../Reservations';
import Complaints from '../Admin/CustomerOrders';
import Feedback from '../Admin/CustomerFeedbacks';
import CustomerDetails from '../Admin/CustomerDetails';
import Payments from '../Admin/CustomerPayments';
import Fooditems from '../Admin/FoodItems';
import Feedbacks from '../Admin/CustomerFeedbacks';



function AdminPortal() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState(null);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
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

    // const [isChecked, setIsChecked] = useState(false);

    // const handleCheckboxChange = (event) => {
    //     setIsChecked(event.target.checked);
    //     // You can perform additional actions based on the checkbox state here
    // }
    const handleSignOut = () => {
        Cookies.remove("token");
        navigate('/adminLogin')
    }

    return (
        <>
            <div>
                <nav className="navbar navbar-expand-lg bg-body-tertiary">
                    <div className="container-fluid">
                        <a className="navbar-brand"><Button onClick={toggleDrawer} >
                            <i className="fa-solid fa-bars fw-bolder text-dark fs-4 "></i>
                        </Button></a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon" />
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            </ul>
                            <div className="d-flex" role="search">
                                {/* <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" /> */}
                                <button className="btn btn-outline-success" >Search</button>
                            </div>
                        </div>
                    </div>
                </nav>
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
                            <IconButton
                                edge="end"
                                onClick={toggleDrawer}
                                sx={{ position: 'absolute', top: 0, right: 10 }}
                            >
                                <CloseIcon />
                            </IconButton>
                            {/* Render menu items */}
                            <MenuItem onClick={() => handleMenuItemClick('Customer-Orders')}>Orders</MenuItem>
                            <MenuItem onClick={() => handleMenuItemClick('Customer-Reservations')}>Reservations</MenuItem>
                            <MenuItem onClick={() => handleMenuItemClick('Customer-Details')}>Customers</MenuItem>
                            <MenuItem onClick={() => handleMenuItemClick('Customer-Payments')}>Payments</MenuItem>
                            <MenuItem onClick={() => handleMenuItemClick('Customer-Feedbacks')}>FeedBacks</MenuItem>
                            <MenuItem onClick={() => handleMenuItemClick('FoodItems')}>FoodItem</MenuItem>
                            <MenuItem onClick={() => handleMenuItemClick('Customer-Complaints')}>Complaints</MenuItem>
                            <MenuItem onClick={() => handleMenuItemClick('Customer-Feedbacks')}>Feedbacks</MenuItem>
                        </div>

                        <footer style={{ position: 'absolute', bottom: 70, left: 0, width: '100%', borderTop: '1px solid #e0e0e0' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 16px' }}>
                                <Button onClick={handleMenuOpen} style={{ cursor: 'pointer', marginRight: '8px', marginBottom: -60, position: 'absolute', right: 0, borderRadius: 50, border: `1px solid #e0e0e0` }}>
                                    <img src={robotPng} alt="Footer Logo" style={{ height: '50px', width: '50px' }} />
                                </Button>
                                {/* Dropdown menu */}
                                <Menu
                                    anchorEl={menuAnchorEl}
                                    open={Boolean(menuAnchorEl)}
                                    onClose={handleMenuClose}
                                    PaperProps={{
                                        style: {
                                            width: '200px',
                                            marginTop: '-80px',
                                        },
                                    }}
                                >
                                    <MenuItem onClick={() => handleMenuItemClick('Admin-Settings')}>Settings</MenuItem>
                                    <hr className='bg-dark' />
                                    <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                                </Menu>

                            </div>
                        </footer>
                    </Drawer>

                    {selectedMenuItem === 'Customer-Orders' && <Orders />}
                    {selectedMenuItem === 'Customer-Reservations' && <Reservations />}
                    {selectedMenuItem === 'Customer-Details' && <CustomerDetails />}
                    {selectedMenuItem === 'Customer-Payments' && <Payments />}
                    {selectedMenuItem === 'Customer-Feedbacks' && <Feedbacks />}
                    {selectedMenuItem === 'Customer-Complaints' && <Complaints />}
                    {selectedMenuItem === 'Admin-Settings' && <Settings />}
                    {selectedMenuItem === 'FoodItems' && <Fooditems />}
                </div>
                <Outlet />
            </div>
            <Outlet />
        </>
    );
}

export default AdminPortal;
