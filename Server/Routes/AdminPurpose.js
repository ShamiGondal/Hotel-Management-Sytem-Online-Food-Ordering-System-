const express = require('express');
const { mssql, pool, sql } = require('../db/db');
const Router = express.Router();
const fetchCustomer = require('../middlewares/fetchCustomer')
const multer = require('multer');
// const { cloudinary } = require('../db/ColudinaryConfig.jsx')
const cloudinary = require('cloudinary').v2;
const upload = multer({ dest: 'uploads/' });

//These all routes are for the admin portal becuase every user need his own specific details not the all and 
//these routes gives all details of all users not specific that's why its for admin purpose 

//admin can only add the foodItems

//inserting foodItems

     
cloudinary.config({ 
  cloud_name: 'applyace-storage', 
  api_key: '357132674117494', 
  api_secret: 'D4AZuelvk2GvDpgJ_U6bKkAbhl4' 
});


Router.post('/addFoodItems', upload.single('image'), async (req, res) => {
    const { title, subtitle, description, price, sizes, specialSelection, isAvailable, foodItemDiscount, category } = req.body;
  
    // Check for missing fields
    if (!title || !subtitle || !description || !price || !sizes || !specialSelection || isAvailable === undefined || isAvailable === null || !foodItemDiscount || !category) {
      return res.status(400).json({ error: "All fields are required." });
    }
  
    // Validate price
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ error: "Price must be a valid number greater than zero." });
    }
  
    //uploading image  to cloudinary
    try {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'FoodItems' }); // Specify the folder name here
        const imageUrl = result.secure_url;
  
      // Serialize arrays into strings
      const sizesString = JSON.stringify(sizes);
      const specialSelectionString = JSON.stringify(specialSelection);
      const imageURLString = JSON.stringify(imageUrl)
      const isAvailableValue = req.body.isAvailable === 'on' ? 1 : 0;

      // Insert the food item into the database
      const foodItemQuery = 'INSERT INTO FoodItems (Title, Subtitle, Description, Price, Sizes, SpecialSelection, IsAvailable, FoodItemDiscount, Category, ImageURL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)';
      pool.query(foodItemQuery, [title, subtitle, description, price, sizesString, specialSelectionString, isAvailableValue, foodItemDiscount, category, imageURLString], (error, results) => {
        if (error) {
          console.error("Error inserting food item:", error);
          return res.status(500).json({ error: "An error occurred while inserting the food item." });
        } else {
          res.status(200).json({
            message: "Successfully Inserted the FoodItem",
            FoodItem: {
              Title: title,
              Subtitle: subtitle,
              Description: description,
              Price: price,
              Sizes: sizes,
              SpecialSelection: specialSelection,
              IsAvailable: isAvailableValue,
              FoodItemDiscount: foodItemDiscount,
              Category: category,
              ImageURL: imageURLString
            }
          });
        }
      });
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return res.status(500).json({ error: "An error occurred while uploading image to Cloudinary." });
    }
  });

Router.post('/addAddon', upload.single('image'), async (req, res) => {
    const { title, subtitle, size, description, price } = req.body;

    // Check for missing fields
    if (!title || !subtitle || !size || !description || !price) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'Add-ons' }); // Specify the folder name here
    const imageUrl = result.secure_url;
    // Insert the addon into the database
    const addonQuery = 'INSERT INTO Addons (Title, Subtitle, Size, Description, Price, ImageURL) VALUES (?, ?, ?, ?, ?, ?)';
    pool.query(addonQuery, [title, subtitle, JSON.stringify(size), description, price, imageUrl], (error, results) => {
        if (error) {
            console.error("Error inserting addon:", error);
            return res.status(500).json({ error: "An error occurred while inserting the addon." });
        } else {
            res.status(200).json({
                message: "Successfully Inserted the Addon",
                Addon: {
                    Title: title,
                    Subtitle: subtitle,
                    Size: size,
                    Description: description,
                    Price: price,
                    ImageURL: imageUrl
                }
            });
        }
    });
});

Router.get('/getAddons', (req, res) => {
    // Fetch addons from the database
    const addonsQuery = 'SELECT * FROM Addons';
    pool.query(addonsQuery, (error, results) => {
        if (error) {
            console.error("Error fetching addons:", error);
            return res.status(500).json({ error: "An error occurred while fetching addons." });
        } else {
            res.status(200).json(results);
        }
    });
});



// Endpoint to fetch all customers

// Endpoint to fetch all customers
Router.get('/getCustomers', async (req, res) => {
    try {
        const customerQuery = 'SELECT * FROM Customers';
        pool.query(customerQuery, (error, results) => {
            if (error) {
                console.error("Error fetching customer:", error);
                return res.status(500).json({ error: "An error occurred while fetching customers." });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ error: "An error occurred while fetching customers." });
    }
});

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
        const orderquery = 'SELECT * FROM Orders';
        pool.query(orderquery, (error, results) => {
            if (error) {
                console.error("Error fetching food items:", error);
                return res.status(500).json({ error: "An error occurred while fetching food items." });
            }
            res.status(200).json(results);
        });


    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "An error occurred while fetching orders." });
    }
});


// Endpoint to fetch reservations
Router.get('/getReservations', async (req, res) => {
    try {
        reservationQuery = 'SELECT * FROM Reservations';
        pool.query(reservationQuery, (error, results) => {
            if (error) {
                console.error("Error fetching food items:", error);
                return res.status(500).json({ error: "An error occurred while fetching food items." });
            }
            res.status(200).json(results);
        });

    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ error: "An error occurred while fetching reservations." });
    }
});


// Endpoint to fetch feedback
Router.get('/getFeedback', async (req, res) => {
    try {

        const getFeedBackQuery = 'SELECT * FROM Feedback';
        pool.query(getFeedBackQuery, (error, results) => {
            if (error) {
                console.error("Error fetching food items:", error);
                return res.status(500).json({ error: "An error occurred while fetching food items." });
            }
            res.status(200).json(results);
        });


    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ error: "An error occurred while fetching feedback." });
    }
});

//EndPoint to fetch all Complaints
Router.get('/getComplaints', async (req, res) => {
    try {

        const getComplaintsQuery = 'SELECT * FROM Complaints';
        pool.query(getComplaintsQuery, (error, results) => {
            if (error) {
                console.error("Error fetching food items:", error);
                return res.status(500).json({ error: "An error occurred while fetching food items." });
            }
            res.status(200).json(results);
        });
        res.status(200).json(complaints);
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ error: 'An error occurred while fetching complaints.' });
    }
});


//EndPoint to fetch all payments

Router.get('/getPayments', async (req, res) => {
    try {
        const getPaymentsQuery = 'SELECT * FROM Payments';
        pool.query(getPaymentsQuery, (error, results) => {
            if (error) {
                console.error("Error fetching food items:", error);
                return res.status(500).json({ error: "An error occurred while fetching food items." });
            }
            res.status(200).json(results);
        });

    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ error: "An error occurred while fetching payments." });
    }
});

//EndPoint to fetch all reports

Router.get('/reports', async (req, res) => {
    try {
        const getReportsQuery = 'SELECT * FROM Report';
        pool.query(getReportsQuery, (error, results) => {
            if (error) {
                console.error("Error fetching food items:", error);
                return res.status(500).json({ error: "An error occurred while fetching food items." });
            }
            res.status(200).json(results);
        });

    } catch (error) {
        console.error("Error fetching report data:", error);
        res.status(500).json({ error: "An error occurred while fetching report data." });
    }
});


module.exports = Router;