import  { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { BsStarFill, BsStarHalf, BsStar } from 'react-icons/bs';

function CustomerDetails() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [feedback, setFeedback] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/api/getCustomers')
      .then(response => response.json())
      .then(data => setCustomers(data))
      .catch(error => console.error('Error fetching customers:', error));
  }, []);

  const handleFeedbackButtonClick = async (customerId) => {
    setSelectedCustomer(customerId);
    try {
      const response = await fetch(`http://localhost:4000/api/getFeedback/${customerId}`);
      const data = await response.json();
      setFeedback(data);
      setShowFeedbackModal(true);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const RatingStars = ({ rating }) => {
    const maxStars = 5;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = maxStars - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div>
        {[...Array(fullStars)].map((_, index) => (
          <BsStarFill key={index} color="blue" />
        ))}
        {hasHalfStar && <BsStarHalf color="blue" />}
        {[...Array(emptyStars)].map((_, index) => (
          <BsStar key={index} color="blue" />
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1>Customers</h1>
      <Row xs={1} md={2} lg={3} className="g-4">
        {customers.map(customer => (
          <Col key={customer.CustomerID}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{`${customer.FirstName} ${customer.LastName}`}</Card.Title>
                <Card.Text>Email: {customer.Email}</Card.Text>
                <Card.Text>Password: {customer.Password}</Card.Text>
                <Card.Text>Credits: {customer.Credits}</Card.Text>
                <Button variant="primary" onClick={() => handleFeedbackButtonClick(customer.CustomerID)}>Feedback</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Feedback</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {feedback.length === 0 ? (
            <p>No feedback available for this customer.</p>
          ) : (
            feedback.map((fb, index) => (
              <div key={index}>
                <p>Service Rating: <RatingStars rating={fb.ServiceRating} /></p>
                <p>Food Rating: <RatingStars rating={fb.FoodRating} /></p>
                <p>Comment: {fb.Comment}</p>
                {index < feedback.length - 1 && <hr />}
              </div>
            ))
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default CustomerDetails;