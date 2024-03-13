const express = require('express');
const { mssql, pool, sql } = require('../db/db');
const Router = express.Router();
const fetchCustomer = require('../middlewares/fetchCustomer')


//These all routes are for the admin portal becuase every user need his own specific details not the all and 
//these routes gives all details of all users not specific that's why its for admin purpose 

//admin can only add the foodItems

//inserting foodItems
Router.post('/addFoodItems', (req, res) => {
    const { name, price, category, availableQuantity, foodItemDiscount } = req.body;
  
    // Check for missing fields
    if (!name || !price || !category || !availableQuantity || !foodItemDiscount) {
      return res.status(400).json({ error: "All fields are required." });
    }
  
    // Validate price and available quantity
    if (isNaN(price) || isNaN(availableQuantity) || price <= 0 || availableQuantity <= 0) {
      return res.status(400).json({ error: "Price and available quantity must be valid numbers greater than zero." });
    }
  
    // Insert the food item into the database
    const foodItemQuery = 'INSERT INTO FoodItems (Name, Price, Category, AvailableQuantity, FoodItemDiscount) VALUES (?, ?, ?, ?, ?)';
    pool.query(foodItemQuery, [name, price, category, availableQuantity, foodItemDiscount], (error, results) => {
      if (error) {
        console.error("Error inserting food item:", error);
        return res.status(500).json({ error: "An error occurred while inserting the food item." });
      } else {
        res.status(200).json({
          message: "Successfully Inserted the FoodItem",
          FoodItem: {
            Name: name,
            Price: price,
            Category: category,
            AvailableQuantity: availableQuantity,
            FoodItemDiscount: foodItemDiscount
          }
        });
      }
    });
  });

// Endpoint to fetch all customers



Router.get('/getCustomer', fetchCustomer, async (req, res) => {
    const customerId = req.user;
    try {
        const [rows, fields] = await pool.promise().query('SELECT * FROM Customers WHERE CustomerID = ?', [customerId]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Customer not found." });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error fetching customer:", error);
        res.status(500).json({ error: "An error occurred while fetching customer." });
    }
});

// Endpoint to fetch all admins
Router.get('/getAdmins', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Admins');
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).json({ error: "An error occurred while fetching admins." });
    }
});


// Endpoint to fetch addresses
Router.get('/getAddresses', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Addresses');
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ error: "An error occurred while fetching addresses." });
    }
});

// Endpoint to fetch food items
Router.get('/getFoodItems', (req, res) => {
    try {
        // Query the database to retrieve all food items
        const foodItemQuery = 'SELECT * FROM FoodItems';
        pool.query(foodItemQuery, (error, results) => {
            if (error) {
                console.error("Error fetching food items:", error);
                return res.status(500).json({ error: "An error occurred while fetching food items." });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error("Error fetching food items:", error);
        res.status(500).json({ error: "An error occurred while fetching food items." });
    }
});

// Endpoint to fetch orders
Router.get('/getOrders', async (req, res) => {
    try {
        const result = await pool.promise().query('SELECT * FROM Orders');
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "An error occurred while fetching orders." });
    }
});


// Endpoint to fetch reservations
Router.get('/getReservations', async (req, res) => {
    try {
        const result = await pool.promise().query('SELECT * FROM Reservations');
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ error: "An error occurred while fetching reservations." });
    }
});


// Endpoint to fetch feedback
Router.get('/getFeedback', async (req, res) => {
    try {
        const result = await pool.promise().query('SELECT * FROM Feedback');
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ error: "An error occurred while fetching feedback." });
    }
});

//EndPoint to fetch all Complaints
Router.get('/getComplaints', async (req, res) => {
    try {
        const result = await pool.promise().query('SELECT * FROM Complaints');
        const complaints = result;

        res.status(200).json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ error: 'An error occurred while fetching complaints.' });
    }
});


//EndPoint to fetch all payments

Router.get('/getPayments', async (req, res) => {
    try {
        const query = 'SELECT * FROM Payments';
        const result = await pool.promise().query(query);
        const payments = result;
        res.status(200).json({ payments });
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ error: "An error occurred while fetching payments." });
    }
});

//EndPoint to fetch all reports

Router.get('/reports', async (req, res) => {
    try {
        // Query to fetch data from the Report table
        const query = 'SELECT * FROM Report';

        // Execute the query
        const result = await pool.promise().query(query);

        // Send the fetched data in the response
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching report data:", error);
        res.status(500).json({ error: "An error occurred while fetching report data." });
    }
});


module.exports = Router;