import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

function CustomerReservations() {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'confirmed', 'rejected', 'pending'
  const [confirmationMsg, setConfirmationMsg] = useState('');

  useEffect(() => {
    // Fetch reservations from the API
    fetch('http://localhost:4000/api/getReservations')
      .then(response => response.json())
      .then(data => {
        setReservations(data);
        setFilteredReservations(data); // Initially, show all reservations
      })
      .catch(error => console.error('Error fetching reservations:', error));
  }, []);

  // Function to filter reservations based on status
  const filterReservations = (status) => {
    let filtered;
    if (status === 'all') {
      filtered = reservations;
    } else {
      filtered = reservations.filter(reservation => reservation.Status.toLowerCase() === status);
    }
    setFilteredReservations(filtered);
    setFilter(status);
  };

  // Handle button click to confirm or reject reservation
  const handleConfirmReject = (reservationID, status) => {
    // Perform API call to update reservation status
    fetch(`http://localhost:4000/api/updateReservationStatus/${reservationID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update reservation status');
      }
      // Update the reservation status locally
      const updatedReservations = reservations.map(reservation => {
        if (reservation.ReservationID === reservationID) {
          return { ...reservation, Status: status };
        }
        return reservation;
      });
      setReservations(updatedReservations);
      setFilteredReservations(updatedReservations);
      setConfirmationMsg(`Reservation ${status === 'Confirmed' ? 'confirmed' : 'rejected'} successfully.`);
      // Clear confirmation message after 3 seconds
      setTimeout(() => {
        setConfirmationMsg('');
      }, 3000);
    })
    .catch(error => console.error('Error updating reservation status:', error));
  };

  // Calculate the number of columns for the grid
  const numColumns = Math.max(Math.floor(12 / Math.min(filteredReservations.length, 3)), 1);

  return (
    <Container>
      <h1 className="my-4">Reservations</h1>
      {confirmationMsg && <Alert variant="success">{confirmationMsg}</Alert>}
      <div className="category-buttons mb-4">
        <Button variant={filter === 'all' ? 'primary' : 'outline-primary'} onClick={() => filterReservations('all')}>All</Button>{' '}
        <Button variant={filter === 'confirmed' ? 'primary' : 'outline-primary'} onClick={() => filterReservations('confirmed')}>Confirmed</Button>{' '}
        <Button variant={filter === 'rejected' ? 'primary' : 'outline-primary'} onClick={() => filterReservations('rejected')}>Rejected</Button>{' '}
        <Button variant={filter === 'pending' ? 'primary' : 'outline-primary'} onClick={() => filterReservations('pending')}>Pending</Button>
      </div>
      <Row>
        {filteredReservations.map(reservation => (
          <Col key={reservation.ReservationID} xs={12} lg={numColumns}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Reservation ID: {reservation.ReservationID}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Customer ID: {reservation.CustomerID}</Card.Subtitle>
                <Card.Text>
                  Reservation Date: {reservation.ReservationDate}<br />
                  No. of Tables: {reservation.NoOfTables}<br />
                  Status: {reservation.Status}
                </Card.Text>
                {(() => {
                  if (reservation.Status === 'Pending') {
                    return (
                      <>
                        <Button variant="success" onClick={() => handleConfirmReject(reservation.ReservationID, 'Confirmed')}>Confirm</Button>{' '}
                        <Button variant="danger" onClick={() => handleConfirmReject(reservation.ReservationID, 'Rejected')}>Reject</Button>
                      </>
                    );
                  } else if (reservation.Status === 'Confirmed') {
                    return (
                      <Button variant="danger" onClick={() => handleConfirmReject(reservation.ReservationID, 'Rejected')}>Reject</Button>
                    );
                  } else if (reservation.Status === 'Rejected') {
                    return (
                      <Button variant="success" onClick={() => handleConfirmReject(reservation.ReservationID, 'Confirmed')}>Confirm</Button>
                    );
                  }
                })()}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default CustomerReservations;
