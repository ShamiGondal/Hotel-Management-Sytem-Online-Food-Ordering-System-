import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs'; // Import star icons from react-icons

function CustomerFeedbacks() {
  // Sample feedback data
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    // Fetch feedback data from the API
    fetch('http://localhost:4000/api/getFeedback')
      .then(response => response.json())
      .then(data => setFeedbacks(data))
      .catch(error => console.error('Error fetching feedback:', error));
  }, []);

  // Helper function to generate star icons based on rating
  const generateStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<BsStarFill key={i} color="blue" />);
    }

    if (halfStar) {
      stars.push(<BsStarHalf key={stars.length} color="blue" />);
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<BsStar key={stars.length} color="blue" />);
    }

    return stars;
  };

  return (
    <Container>
      <h1 className="text-center my-4">Feedbacks</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {feedbacks.map(feedback => (
          <Col key={feedback.FeedbackID}>
            <Card>
              <Card.Body>
                <Card.Title>Feedback ID: {feedback.FeedbackID}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Customer ID: {feedback.CustomerID}</Card.Subtitle>
                <Card.Text>
                  Service Rating: {generateStars(feedback.ServiceRating)}<br />
                  Food Rating: {generateStars(feedback.FoodRating)}<br />
                  {feedback.Comment}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CustomerFeedbacks;