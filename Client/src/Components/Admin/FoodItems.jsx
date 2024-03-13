import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';

function Fooditems() {
  const [foodItems, setFoodItems] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [formData, setFormData] = useState({});
  const [showForm, setShowForm] = useState(false); // State to control the visibility of the form

  useEffect(() => {
    fetch('http://localhost:4000/api/getFoodItems')
      .then(response => response.json())
      .then(data => setFoodItems(data))
      .catch(error => console.error('Error fetching food items:', error));
  }, []);

  const handleEdit = (index, item) => {
    setEditIndex(index);
    setFormData(item);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    fetch(`http://localhost:4000/api/updateFoodItem/${formData.FoodItemID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        // Update the food item in the local state
        const updatedFoodItems = [...foodItems];
        updatedFoodItems[editIndex] = formData;
        setFoodItems(updatedFoodItems);
        // Reset edit index and form data
        setEditIndex(-1);
        setFormData({});
      })
      .catch(error => console.error('Error updating food item:', error));
  };

  const handleAddFoodItem = () => {
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
  };

  const handleaddFoodItemSubmit = () => {
    // Extract form data
    const { Name, Price, Category, AvailableQuantity, FoodItemDiscount } = formData;

    // Prepare request body
    const requestBody = {
      name: Name,
      price: parseFloat(Price), // Convert price to float
      category: Category,
      availableQuantity: parseInt(AvailableQuantity), // Convert available quantity to integer
      foodItemDiscount: parseFloat(FoodItemDiscount) // Convert food item discount to float
    };

    // Make POST request to API
    fetch('http://localhost:4000/api/addFoodItems', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add food item');
        }
        return response.json();
      })
      .then(data => {
        console.log('Food item added successfully:', data);
        // Refresh the list of food items
        fetch('http://localhost:4000/api/getFoodItems')
          .then(response => response.json())
          .then(data => setFoodItems(data))
          .catch(error => console.error('Error fetching food items:', error));
        // Close the form
        setShowForm(false);
      })
      .catch(error => {
        console.error('Error adding food item:', error);
        // Handle error
      });

    // Reset form data
    setFormData({
      Name: '',
      Price: '',
      Category: '',
      AvailableQuantity: '',
      FoodItemDiscount: ''
    });
  };


  return (
    <Container>
      <Row xs={1} md={2} lg={3} className="g-4">
        { foodItems.length>0 && foodItems.map((foodItem, index) => (
          <Col key={foodItem.FoodItemID}>
            <Card style={{ width: '100%', height: '100%' }}>
              <Card.Body>
                {editIndex === index ? (
                  <Form>
                    {Object.entries(foodItem).map(([key, value]) => (
                      <Form.Group controlId={key} key={key}>
                        <Form.Control
                          type="text"
                          name={key}
                          value={formData[key] || ''}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    ))}
                    <Button variant="primary" onClick={handleSubmit}>Save</Button>
                  </Form>
                ) : (
                  <>
                    {Object.entries(foodItem).map(([key, value]) => (
                      <p key={key}>
                        <strong>{key}:</strong> {value}
                      </p>
                    ))}
                    <Button variant="primary" onClick={() => handleEdit(index, foodItem)}>Edit</Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Button
        variant="success"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '24px'
        }}
        onClick={handleAddFoodItem}
      >
        +
      </Button>
      <Modal show={showForm} onHide={handleFormClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Food Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="Name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="Name" onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="Price">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="Price" onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="Category">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" name="Category" onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="AvailableQuantity">
              <Form.Label>Available Quantity</Form.Label>
              <Form.Control type="number" name="AvailableQuantity" onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="FoodItemDiscount">
              <Form.Label>Food Item Discount</Form.Label>
              <Form.Control type="number" name="FoodItemDiscount" onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleaddFoodItemSubmit}>
            Add Food Item
          </Button>
          <Button variant="secondary" onClick={handleFormClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Fooditems;