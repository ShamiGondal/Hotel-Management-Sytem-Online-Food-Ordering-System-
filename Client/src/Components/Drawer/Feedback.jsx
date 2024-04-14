import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import Cookies from 'js-cookie';
import { useDarkMode } from '../Hooks/DarkModeContext';
import StarRatings from 'react-star-ratings'; // Import StarRatings component
import { toast } from 'react-toastify';

function Feedback() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [serviceRating, setServiceRating] = useState(0);
    const [foodRating, setFoodRating] = useState(0);
    const [comment, setComment] = useState('');
    const { isDarkMode } = useDarkMode();
    const apiUri = import.meta.env.VITE_REACT_APP_API_URL;

    useEffect(() => {
        // Check if user is logged in
        const token = Cookies.get('token');
        console.log(token)
        if (token) {
            setLoggedIn(true);
        } else {
            window.location.href = '/login';
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!loggedIn) {
            return;
        }
    
        const token = Cookies.get('token');
    
        // Send feedback data to server with token included in headers
        fetch(`${apiUri}api/submitFeedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${token}` // Include token in headers
            },
            body: JSON.stringify({ serviceRating, foodRating, comment }),
            credentials: 'same-origin' // Include cookies in the request
        })
            .then(response => {
                if (response.ok) {
                    // Feedback submitted successfully
                    console.log('Feedback submitted successfully');
                    // Clear the form after submission
                    setServiceRating(0);
                    setFoodRating(0);
                    setComment('');
                    toast.success("Thanks for giving feedback")
                } else {
                    // Error submitting feedback
                    console.error('Error submitting feedback');
                }
            })
            .catch(error => {
                console.error('Error submitting feedback:', error);
            });
    };

    if (isDarkMode) {
        document.body.style.backgroundColor = 'black';
    } else {
        document.body.style.backgroundColor = 'white';
    }

    return (
        <div className={`pt-5`}>
            <div className={`container mt-5`}>
                <Form onSubmit={handleSubmit} className={`bg-${isDarkMode ? 'dark' : 'light'} food-items-container ${isDarkMode ? 'dark-mode' : ''} mt-5 p-5 rounded-5 bg-${isDarkMode ? 'dark' : 'light'}`}>
                    <Form.Group controlId="serviceRating  " className='d-flex flex-column'>
                        <Form.Label>Service Rating</Form.Label>
                        {/* Use StarRatings component for service rating */}
                        <StarRatings
                            rating={serviceRating}
                            starRatedColor="gold"
                            changeRating={(rating) => setServiceRating(rating)}
                            numberOfStars={5}
                            name='serviceRating'
                        />
                    </Form.Group>

                    <Form.Group controlId="foodRating" className='d-flex flex-column'>
                        <Form.Label>Food Rating</Form.Label>
                        {/* Use StarRatings component for food rating */}
                        <StarRatings
                            rating={foodRating}
                            starRatedColor="gold"
                            changeRating={(rating) => setFoodRating(rating)}
                            numberOfStars={5}
                            name='foodRating'
                        />
                    </Form.Group>

                    <Form.Group controlId="comment">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" disabled={!loggedIn} className='mt-5'>
                        Submit Feedback
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default Feedback;
