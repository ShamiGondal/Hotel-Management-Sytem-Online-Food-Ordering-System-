import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'resolved', 'unresolved'
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch complaints from the API
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('/api/getComplaints');
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
        setFilteredComplaints(data); // Initially, show all complaints
        // Update selected filter based on currently filtered complaints
        const currentFilter = filteredComplaints.length === data.length ? 'all' : filter;
        setFilter(currentFilter);
      } else {
        console.error('Error fetching complaints:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    }
  };

  // Function to filter complaints based on resolution status
  const filterComplaints = (status) => {
    let filtered;
    if (status === 'all') {
      filtered = complaints;
    } else {
      const resolved = status === 'resolved' ? true : false;
      filtered = complaints.filter(complaint => complaint.IsResolved === resolved);
    }
    setFilteredComplaints(filtered);
    setFilter(status);
  };

  // Function to handle click on complaint
  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setShowConfirmation(true);
  };

  // Function to resolve complaint
  const handleResolveComplaint = async (complaintId) => {
    try {
      const response = await fetch(`/api/updateComplaintStatus/${complaintId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isResolved: true
        })
      });
      if (response.ok) {
        setMessage('Complaint resolved successfully.');
        setShowConfirmation(false);
        fetchComplaints(); // Refresh complaints after successful resolution
      } else {
        console.error('Failed to resolve complaint:', response.statusText);
      }
    } catch (error) {
      console.error('Error resolving complaint:', error);
    }
  };

  // Function to cancel resolution confirmation
  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <Container>
      <h1 className="my-4">Complaints</h1>
      {message && <Alert variant="success">{message}</Alert>}
      <div className="category-buttons mb-4">
        <Button variant={filter === 'all' ? 'primary' : 'outline-primary'} onClick={() => filterComplaints('all')}>All</Button>{' '}
        <Button variant={filter === 'resolved' ? 'primary' : 'outline-primary'} onClick={() => filterComplaints('resolved')}>Resolved</Button>{' '}
        <Button variant={filter === 'unresolved' ? 'primary' : 'outline-primary'} onClick={() => filterComplaints('unresolved')}>Unresolved</Button>
      </div>
      <Row>
        {filteredComplaints.map(complaint => (
          <Col key={complaint.ComplaintID} xs={12} lg={4}>
            <Card className={`mb-4 ${complaint.IsResolved ? 'border-success' : 'border-danger'}`}>
              <Card.Body>
                <Card.Title>Complaint ID: {complaint.ComplaintID}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">Customer ID: {complaint.CustomerID}</Card.Subtitle>
                <Card.Text>
                  Type: {complaint.ComplaintType}<br />
                  Date: {complaint.ComplaintDate}<br />
                  Text: {complaint.ComplaintText}<br />
                </Card.Text>
                {!complaint.IsResolved &&
                  <div className="text-center">
                    <Button variant="success" onClick={() => handleResolveComplaint(complaint.ComplaintID)}>Resolve</Button>
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
          Are you sure you want to resolve this complaint?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => handleResolveComplaint(selectedComplaint.ComplaintID)}>Resolve</Button>
          <Button variant="secondary" onClick={handleCancelConfirmation}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Complaints;
