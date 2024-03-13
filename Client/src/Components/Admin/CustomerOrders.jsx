import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FaInfoCircle } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

function Order() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'confirmed', 'rejected'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch orders from the API
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/getOrders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data); // Initially, show all orders
        // Update selected filter based on currently filtered orders
        const currentFilter = filteredOrders.length === data.length ? 'all' : filter;
        setFilter(currentFilter);
      } else {
        console.error('Error fetching orders:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Function to filter orders based on status
  const filterOrders = (status) => {
    let filtered;
    if (status === 'all') {
      filtered = orders;
    } else {
      filtered = orders.filter(order => order.Status.toLowerCase() === status);
    }
    setFilteredOrders(filtered);
    setFilter(status);
  };

  // Function to handle click on info icon
  const handleInfoClick = (order) => {
    setSelectedOrder(order);
    setShowConfirmation(true);
  };

  // Function to reject order
  const handleRejectOrder = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/updateOrderStatus/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newStatus: 'Rejected'
        })
      });
      if (response.ok) {
        setMessage('Order rejected successfully.');
        setShowConfirmation(false);
        fetchOrders(); // Refresh orders after successful rejection
      } else {
        console.error('Failed to reject order:', response.statusText);
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
    }
  };

  // Function to confirm payment receipt
  const handleConfirmPayment = async () => {
    try {
      if (!selectedOrder) {
        console.error('No order selected for payment confirmation');
        return;
      }

      const response = await fetch('http://localhost:4000/api/insertPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          OrderID: selectedOrder.OrderID,
          CustomerID: selectedOrder.CustomerID,
          Amount: selectedOrder.TotalAmount,
          PaymentDate: new Date().toISOString() // Use current date as payment date
        })
      });

      if (response.ok) {
        await handleConfirmOrderStatus(selectedOrder.OrderID); // Update order status after payment confirmation
        setMessage('Payment confirmed and order status updated successfully.');
      } else {
        console.error('Failed to insert payment record:', response.statusText);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  };

  // Function to cancel confirmation
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <Container>
      <h1 className="my-4">Orders</h1>
      {message && <Alert variant="success">{message}</Alert>}
      <div className="category-buttons mb-4">
        <Button variant={filter === 'all' ? 'primary' : 'outline-primary'} onClick={() => filterOrders('all')}>All</Button>{' '}
        <Button variant={filter === 'pending' ? 'primary' : 'outline-primary'} onClick={() => filterOrders('pending')}>Pending</Button>{' '}
        <Button variant={filter === 'confirmed' ? 'primary' : 'outline-primary'} onClick={() => filterOrders('confirmed')}>Confirmed</Button>{' '}
        <Button variant={filter === 'rejected' ? 'primary' : 'outline-primary'} onClick={() => filterOrders('rejected')}>Rejected</Button>
      </div>
      <Row>
        {filteredOrders.map(order => (
          <Col key={order.OrderID} xs={12} lg={4}>
            <Card className={`mb-4 ${order.Status === 'Confirmed' ? 'border-success' : (order.Status === 'Rejected' ? 'border-danger' : '')}`}>
              <Card.Body>
                <Card.Title>Order ID: {order.OrderID}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Customer ID: {order.CustomerID}</Card.Subtitle>
                <Card.Text>
                  Order Date: {order.OrderDate}<br />
                  Total Amount: {order.TotalAmount}<br />
                  <span className={order.PaymentStatus === 'Pending' ? 'text-danger' : ''}>
                    Payment Status: {order.PaymentStatus}
                    {order.PaymentStatus === 'Pending' && <FaInfoCircle className="ml-2 text-primary" onClick={() => handleInfoClick(order)} />}
                  </span>
                </Card.Text>
                {order.Status === 'Pending' &&
                  <div className="text-center">
                    <Button variant="success" disabled={order.PaymentStatus === 'Pending'} onClick={handleConfirmPayment}>Confirm order</Button>
                    {' '}
                    <Button variant="danger" onClick={() => handleRejectOrder(order.OrderID)}>Reject order</Button>
                  </div>
                }
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal show={showConfirmation} onHide={handleCancelConfirmation} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure that payment is received?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleConfirmPayment}>Confirm</Button>
          <Button variant="secondary" onClick={handleCancelConfirmation}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Order;
