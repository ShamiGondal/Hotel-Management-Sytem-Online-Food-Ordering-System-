import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { getOrderDetails } from 'http:localhost:4000/api/getOrders'; // Assuming you have an API function to fetch order details
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useDarkMode } from './Hooks/DarkModeContext';
import Cookies from 'js-cookie';

const TrackOrder = () => {
    const { orderId } = useParams();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);


    const { isDarkMode } = useDarkMode();

    useEffect(() => {
        // Check if user is logged in
        const token = Cookies.get('token');
        console.log(token)
        if (token) {
            setLoggedIn(true);
        } else {
            // Redirect to login page if token is not present
            window.location.href = '/login';
        }
    }, []);


    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const data = await getOrderDetails(orderId);
                setOrderDetails(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order details:', error);
                setError('Failed to fetch order details. Please try again later.');
                setLoading(false);
            }
        };

        fetchOrderDetails();

        return () => {
            // Clean-up function if needed
        };
    }, [orderId]);

    if (isDarkMode) {
        document.body.style.backgroundColor = 'black'
    } else {
        document.body.style.backgroundColor = 'white'

    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom>Order Tracker</Typography>
            {loading && <CircularProgress />}
            {error && <Alert severity="error">{error}</Alert>}
            {orderDetails && (
                <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
                    <Typography variant="h6">Order Details</Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">Order ID:</Typography>
                            <Typography variant="body1">{orderDetails.orderId}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1">Status:</Typography>
                            <Typography variant="body1">{orderDetails.status}</Typography>
                        </Grid>
                        {/* Add more details as needed */}
                    </Grid>
                    <Box mt={3}>
                        <Typography variant="h6">Delivery Information</Typography>
                        <Divider sx={{ my: 2 }} />
                        {/* Add delivery information */}
                    </Box>
                    <Box mt={3}>
                        <Typography variant="h6">Order Items</Typography>
                        <Divider sx={{ my: 2 }} />
                        {/* Display order items */}
                    </Box>
                    {/* Add more sections for additional details */}
                </Paper>
            )}
        </Box>
    );
};

export default TrackOrder;

