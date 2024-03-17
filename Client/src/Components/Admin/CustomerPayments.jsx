import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function CustomerPayments() {
 const [payments, setPayments] = useState([]);

 useEffect(() => {
    // Fetch payments from the API
    fetch('http://localhost:4000/api/getpayments')
      .then(response => response.json())
      .then(data => {
        // Directly set the payments state with the fetched data
        setPayments(data);
        console.log(data);
      })
      .catch(error => console.error('Error fetching payments:', error));
 }, []);

 return (
    <Container>
      <h1 className="my-4">Payments</h1>
      <Row>
        {payments.map(payment => (
          <Col key={payment.PaymentID} xs={12} lg={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Payment ID: {payment.PaymentID}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Order ID: {payment.OrderID}</Card.Subtitle>
                <Card.Text>
                 Customer ID: {payment.CustomerID}<br />
                 Amount: {payment.Amount}<br />
                 Payment Date: {payment.PaymentDate}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
 );
}

export default CustomerPayments;
