const express = require('express');
const { mssql, pool, sql } = require('../db/db');
const fetchUser = require('../middlewares/fetchCustomer');
const Router = express.Router();

Router.put('/updateReservationStatus/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    try {
      // Perform the update in the database
      const query = 'UPDATE Reservations SET Status = ? WHERE ReservationID = ?';
      pool.query(query, [status, id], (error, results) => {
        if (error) {
          console.error("Error updating reservation status:", error);
          res.status(500).json({ error: "An error occurred while updating reservation status." });
        } else {
          res.status(200).json({ message: "Reservation status updated successfully." });
        }
      });
    } catch (error) {
      console.error("Error updating reservation status:", error);
      res.status(500).json({ error: "An error occurred while updating reservation status." });
    }
  });


// Endpoint to update order status
Router.put('/updateOrderStatus/:orderID', async (req, res) => {
    const { orderID } = req.params;
    const { newStatus } = req.body;
  
    try {
      // Check if orderID is a valid integer
      if (!Number.isInteger(parseInt(orderID))) {
        return res.status(400).json({ error: "Invalid orderID format." });
      }
  
      // Check if newStatus is provided and is a valid string
      if (!newStatus || typeof newStatus !== 'string') {
        return res.status(400).json({ error: "Invalid newStatus value." });
      }
  
      // Perform the update in the database
      const query = `
        UPDATE Orders
        SET Status = ?
        WHERE OrderID = ?;
      `;
      pool.query(query, [newStatus, orderID], (error, results) => {
        if (error) {
          console.error("Error updating order status:", error);
          res.status(500).json({ error: "An error occurred while updating order status." });
        } else {
          res.status(200).json({ message: "Order status updated successfully." });
        }
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      res.status(500).json({ error: "An error occurred while updating order status." });
    }
  });

  Router.get('/api/getComplaints', (req, res) => {
    const query = 'SELECT * FROM Complaints';
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching complaints:', err);
        res.status(500).json({ error: 'Error fetching complaints' });
        return;
      }
      res.json(results); // This line sends a response to the client
    });
  });
  
  
  // Update complaint status
  Router.put('/api/updateComplaintStatus/:complaintID', (req, res) => {
    const { complaintID } = req.params;
    const { isResolved } = req.body;
  
    try {
      // Check if complaintID is a valid integer
      if (!Number.isInteger(parseInt(complaintID))) {
        return res.status(400).json({ error: "Invalid complaintID format." });
      }
  
      // Check if isResolved is provided and is a valid boolean
      if (typeof isResolved !== 'boolean') {
        return res.status(400).json({ error: "Invalid isResolved value." });
      }
  
      // Perform the update in the database
      const query = `
        UPDATE Complaints
        SET IsResolved = ?
        WHERE ComplaintID = ?;
      `;
      connection.query(query, [isResolved, complaintID], (error, results) => {
        if (error) {
          console.error("Error updating complaint status:", error);
          res.status(500).json({ error: "An error occurred while updating complaint status." });
        } else {
          res.status(200).json({ message: "Complaint status updated successfully." });
        }
      });
    } catch (error) {
      console.error("Error updating complaint status:", error);
      res.status(500).json({ error: "An error occurred while updating complaint status." });
    }
  });


Router.put('/updatePaymentStatus/:orderID', async (req, res) => {
    const { orderID } = req.params;
    const { newPaymentStatus } = req.body;
  
    try {
      // Check if orderID is a valid integer
      if (!Number.isInteger(parseInt(orderID))) {
        return res.status(400).json({ error: "Invalid orderID format." });
      }
  
      // Check if newPaymentStatus is provided and is valid
      const validPaymentStatusValues = ['Pending', 'Confirmed', 'Rejected'];
      if (!validPaymentStatusValues.includes(newPaymentStatus)) {
        return res.status(400).json({ error: "Invalid newPaymentStatus value." });
      }
  
      // Perform the update in the database
      const query = `
        UPDATE Payments
        SET PaymentStatus = ?
        WHERE OrderID = ?;
      `;
      pool.query(query, [newPaymentStatus, orderID], (error, results) => {
        if (error) {
          console.error("Error updating payment status:", error);
          res.status(500).json({ error: "An error occurred while updating payment status." });
        } else {
          res.status(200).json({ message: "Payment status updated successfully." });
        }
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
      res.status(500).json({ error: "An error occurred while updating payment status." });
    }
  });
  

// Endpoint to update payment status in the order
Router.put('/updateOrderPaymentStatus/:orderId', async (req, res) => {
    try {
      const { orderId } = req.params;
      const query = `
        UPDATE Orders
        SET PaymentStatus = 'Confirmed'
        WHERE OrderID = ?;
      `;
      pool.query(query, [orderId], (error, results) => {
        if (error) {
          console.error("Error updating payment status in order:", error);
          res.status(500).json({ error: "An error occurred while updating payment status in order." });
        } else {
          res.status(200).json({ message: `Payment status updated for order ${orderId}` });
        }
      });
    } catch (error) {
      console.error("Error updating payment status in order:", error);
      res.status(500).json({ error: "An error occurred while updating payment status in order." });
    }
  });

Router.get('/getPaymentByOrderId/:orderId', (req, res) => {
    try {
      const { orderId } = req.params;
      const query = `SELECT * FROM Payments WHERE OrderID = ?`;
      
      pool.query(query, [orderId], (error, results) => {
        if (error) {
          console.error("Error fetching payments by order ID:", error);
          res.status(500).json({ error: "An error occurred while fetching payments by order ID." });
        } else {
          const payments = results;
          res.status(200).json({ payments });
        }
      });
    } catch (error) {
      console.error("Error fetching payments by order ID:", error);
      res.status(500).json({ error: "An error occurred while fetching payments by order ID." });
    }
  });

// Endpoint to insert a new payment record
// Route for inserting payment
Router.post('/insertPayment', (req, res) => {
    try {
      const { OrderID, CustomerID, Amount, PaymentDate } = req.body;
  
      // Validate input data
      if (!OrderID || !CustomerID || !Amount || !PaymentDate) {
        return res.status(400).json({ error: "Missing required fields." });
      }
  
      // Convert PaymentDate to the appropriate MySQL format
      const formattedPaymentDate = new Date(PaymentDate).toISOString().slice(0, 19).replace('T', ' ');
  
      // Perform the insertion into the database
      const query = `
        INSERT INTO Payments (OrderID, CustomerID, Amount, PaymentDate)
        VALUES (?, ?, ?, ?);
      `;
  
      pool.query(query, [OrderID, CustomerID, Amount, formattedPaymentDate], (error, results) => {
        if (error) {
          console.error("Error inserting payment record:", error);
          res.status(500).json({ error: "An error occurred while inserting payment record." });
        } else {
          res.status(201).json({ message: "Payment record inserted successfully." });
        }
      });
    } catch (error) {
      console.error("Error inserting payment record:", error);
      res.status(500).json({ error: "An error occurred while inserting payment record." });
    }
  });




// Endpoint to update food items
Router.put('/updateFoodItem/:id', (req, res) => {
  try {
      const { id } = req.params;
      const { title, subtitle, description, price, sizes, specialSelection, isAvailable, foodItemDiscount, category } = req.body;

      // Check if all required fields are present
      if (!title || !subtitle || !description || !price || !sizes || !specialSelection || isAvailable === undefined || isAvailable === null || !foodItemDiscount || !category) {
          return res.status(400).json({ error: "All fields are required." });
      }

      // Validate price
      if (isNaN(price) || price <= 0) {
          return res.status(400).json({ error: "Price must be a valid number greater than zero." });
      }

      // Serialize arrays into strings
      const sizesString = JSON.stringify(sizes);
      const specialSelectionString = JSON.stringify(specialSelection);

      // Update the food item in the database
      const query = `
          UPDATE FoodItems 
          SET 
              Title = ?,
              Subtitle = ?,
              Description = ?,
              Price = ?,
              Sizes = ?,
              SpecialSelection = ?,
              IsAvailable = ?,
              FoodItemDiscount = ?,
              Category = ?
          WHERE 
              FoodItemID = ?;
      `;

      pool.query(query, [title, subtitle, description, price, sizesString, specialSelectionString, isAvailable, foodItemDiscount, category, id], (error, results) => {
          if (error) {
              console.error("Error updating food item:", error);
              res.status(500).json({ error: "An error occurred while updating food item." });
          } else {
              res.status(200).json({ message: "Food item updated successfully." });
          }
      });
  } catch (error) {
      console.error("Error updating food item:", error);
      res.status(500).json({ error: "An error occurred while updating food item." });
  }
});


// Endpoint to update reservation status by ID
Router.put('/updateReservationStatus/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    const query = 'UPDATE Reservations SET Status = ? WHERE ReservationID = ?';
  
    pool.query(query, [status, id], (error, results) => {
      if (error) {
        console.error("Error updating reservation status:", error);
        res.status(500).json({ error: "An error occurred while updating reservation status." });
      } else {
        res.status(200).json({ message: "Reservation status updated successfully." });
      }
    });
  });

// Route for fetching specific customer feedback
Router.get('/getFeedback/:customerID', (req, res) => {
    const { customerID } = req.params;
  
    const query = 'SELECT * FROM Feedback WHERE CustomerID = ?';
  
    pool.query(query, [customerID], (error, results) => {
      if (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ error: "An error occurred while fetching feedback." });
      } else {
        res.status(200).json(results);
      }
    });
  });



// Update an address
Router.put('/updateAddress/:addressID', fetchUser, async (req, res) => {
  const { streetAddress, city, state, postalCode, country } = req.body;
  const customerID = req.user;
  const addressID = req.params.addressID;

  try {
      // Check for missing fields
      if (!streetAddress || !city || !state || !postalCode || !country) {
          return res.status(400).json({ error: "Missing required fields in the request body." });
      }

      const query = `UPDATE Addresses 
                     SET StreetAddress=?, City=?, State=?, PostalCode=?, Country=?
                     WHERE AddressID=? AND CustomerID=?`;
      await pool.promise().query(query, [streetAddress, city, state, postalCode, country, addressID, customerID]);

      res.status(200).json({ message: "Address updated successfully." });
  } catch (error) {
      console.error("Error updating address:", error);
      res.status(500).json({ error: "An error occurred while updating the address." });
  }
});

// Remove an address
Router.delete('/removeAddress/:addressID', fetchUser, async (req, res) => {
  const customerID = req.user;
  const addressID = req.params.addressID;

  try {
      const query = `DELETE FROM Addresses 
                     WHERE AddressID=? AND CustomerID=?`;
      await pool.promise().query(query, [addressID, customerID]);

      res.status(200).json({ message: "Address removed successfully." });
  } catch (error) {
      console.error("Error removing address:", error);
      res.status(500).json({ error: "An error occurred while removing the address." });
  }
});


module.exports = Router;