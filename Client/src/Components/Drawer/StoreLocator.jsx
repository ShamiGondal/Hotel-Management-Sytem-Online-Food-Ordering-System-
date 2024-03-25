import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PublicIcon from '@mui/icons-material/Public';
import { Button } from 'react-bootstrap';
import RobotPng from '../../assets/carsouleImge_1.png'
import { useDarkMode } from '../Hooks/DarkModeContext';

const StoreLocator = () => {
    // Array of store data
    const storeData = [
        {
            name: 'Branch 1',
            address: '123 Main St, City, Country',
            email: 'branch1@example.com',
            website: 'www.branch1.com',
            imageUrl: RobotPng,
        },
        {
            name: 'Branch 2',
            address: '456 Park Ave, City, Country',
            email: 'branch2@example.com',
            website: 'www.branch2.com',
            imageUrl: RobotPng,
        },
        // Add more store data objects as needed
    ];

    const { isDarkMode } = useDarkMode();

    if (isDarkMode) {
        document.body.style.backgroundColor = 'black';
    } else {
        document.body.style.backgroundColor = 'white';
    }

    return (
        <div className="container-fluid p-4 mt-5 pt-5   ">
            <Grid container spacing={3}  >
                {storeData.map((store, index) => (
                    <Grid item xs={12} md={12} lg={12} key={index}>
                        <Card className={` bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}  `} sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '12px' }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={store.imageUrl}
                                alt={store.name}
                                sx={{ objectFit: 'cover', borderTopLeftRadius: '12px', borderTopRightRadius: '12px' }}
                            />
                            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div >
                                    <Typography className={` bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}  `} variant="h5" component="h2" gutterBottom>
                                        {store.name}
                                    </Typography>
                                    <Typography className={` bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}  `} variant="body1" color="text.secondary" gutterBottom>
                                        <LocationOnIcon fontSize="small" /> {store.address}
                                    </Typography>
                                    <Typography className={` bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}  `} variant="body1" color="text.secondary" gutterBottom>
                                        <EmailIcon fontSize="small" /> {store.email}
                                    </Typography>
                                    <Typography className={` bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}  `} variant="body1" color="text.secondary" gutterBottom>
                                        <PublicIcon fontSize="small" /> {store.website}
                                    </Typography>
                                </div>
                                <Button
                                    className={`bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''}`}
                                    variant="contained"
                                    sx={{ backgroundColor: isDarkMode ? 'darkblue' : 'blue', color: 'white' }} // Set the background color and text color
                                    fullWidth
                                >
                                    Visit Now
                                </Button>

                            </CardContent>

                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default StoreLocator;
