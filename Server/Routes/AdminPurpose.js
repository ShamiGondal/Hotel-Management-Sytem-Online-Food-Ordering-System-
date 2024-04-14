const express = require('express');
const { mssql, pool, sql } = require('../db/db');
const Router = express.Router();
const fetchCustomer = require('../middlewares/fetchCustomer')
const multer = require('multer');
const { json } = require('stream/consumers');
const fetchUser = require('../middlewares/fetchCustomer');
// const { cloudinary } = require('../db/ColudinaryConfig.jsx')
const cloudinary = require('cloudinary').v2;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Specify your upload directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });


//inserting foodItems


cloudinary.config({
    cloud_name: 'applyace-storage',
    api_key: '357132674117494',
    api_secret: 'D4AZuelvk2GvDpgJ_U6bKkAbhl4'
});


Router.post('/addFoodItems', upload.array('images'), async (req, res) => {
    try {
        // Extract fields from the request body
        const { title, subtitle, description, price, sizesAndPrices, selectionsAndPrices, isAvailable, foodItemDiscount, category } = req.body;

        // Check for missing fields
        if (!title || !subtitle || !description || !price || !sizesAndPrices || !selectionsAndPrices || isAvailable === undefined || isAvailable === null || !foodItemDiscount || !category) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Validate price
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ error: "Price must be a valid number greater than zero." });
        }

        // Upload images to Cloudinary
        const imageUrls = [];
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, { folder: 'FoodItems' });
            imageUrls.push(result.secure_url);
        }

        // Convert array of image URLs to JSON string
        const imageURLString = JSON.stringify(imageUrls);

        // Convert sizes and specialSelections to JSON strings
        const sizesString = JSON.stringify(sizesAndPrices);
        const specialSelectionString = JSON.stringify(selectionsAndPrices);

        const isAvailableValue = isAvailable === 'on' ? 1 : 0;

        // Insert the food item into the database
        const foodItemQuery = 'INSERT INTO FoodItems (Title, Subtitle, Description, Price, Sizes, SpecialSelection, IsAvailable, FoodItemDiscount, Category, ImageURL) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
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
                        Sizes: sizesString,
                        SpecialSelection: specialSelectionString,
                        IsAvailable: isAvailableValue,
                        FoodItemDiscount: foodItemDiscount,
                        Category: category,
                        ImageURL: imageURLString
                    }
                });
            }
        });
    } catch (error) {
        console.error("Error uploading images to Cloudinary:", error);
        return res.status(500).json({ error: "An error occurred while uploading images to Cloudinary." });
    }
});

Router.post('/editFoodItem/:foodItemId', upload.array('images'), async (req, res) => {
    try {
        const foodItemId = req.params.foodItemId;

        // Extract fields from the request body
        const { title, subtitle, description, price, sizesAndPrices, selectionsAndPrices, isAvailable, foodItemDiscount, category } = req.body;

        // Check for missing fields
        if (!title || !subtitle || !description || !price || !sizesAndPrices || !selectionsAndPrices || isAvailable === undefined || isAvailable === null || !foodItemDiscount || !category) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Validate price
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ error: "Price must be a valid number greater than zero." });
        }

        // Upload images to Cloudinary
        const imageUrls = [];
        for (const file of req.files) {
            const result = await cloudinary.uploader.upload(file.path, { folder: 'FoodItems' });
            imageUrls.push(result.secure_url);
        }

        // Convert array of image URLs to JSON string
        const imageURLString = JSON.stringify(imageUrls);

        // Convert sizes and specialSelections to JSON strings
        const sizesString = JSON.stringify(sizesAndPrices);
        const specialSelectionString = JSON.stringify(selectionsAndPrices);

        const isAvailableValue = isAvailable === 'on' ? 1 : 0;

        // Update the food item in the database
        const foodItemQuery = 'UPDATE FoodItems SET Title = ?, Subtitle = ?, Description = ?, Price = ?, Sizes = ?, SpecialSelection = ?, IsAvailable = ?, FoodItemDiscount = ?, Category = ?, ImageURL = ? WHERE id = ?';
        pool.query(foodItemQuery, [title, subtitle, description, price, sizesString, specialSelectionString, isAvailableValue, foodItemDiscount, category, imageURLString, foodItemId], (error, results) => {
            if (error) {
                console.error("Error updating food item:", error);
                return res.status(500).json({ error: "An error occurred while updating the food item." });
            } else {
                res.status(200).json({
                    message: "Successfully Updated the FoodItem",
                    FoodItem: {
                        Title: title,
                        Subtitle: subtitle,
                        Description: description,
                        Price: price,
                        Sizes: sizesString,
                        SpecialSelection: specialSelectionString,
                        IsAvailable: isAvailableValue,
                        FoodItemDiscount: foodItemDiscount,
                        Category: category,
                        ImageURL: imageURLString
                    }
                });
            }
        });
    } catch (error) {
        console.error("Error updating food item:", error);
        return res.status(500).json({ error: "An error occurred while updating the food item." });
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

Router.post('/addCoupons', async (req, res) => {
    const { couponCode, status ,CopounDiscountAmount} = req.body;

    try {
        // const connection = await pool.getConnection();
        await pool.promise().query('INSERT INTO coupons (couponCode, status,CopounDiscountAmount) VALUES (?, ?,?)', [couponCode, status,CopounDiscountAmount]);
        // connection.release();
        res.status(201).json({ message: 'Coupon created successfully' });
    } catch (error) {
        console.error('Error creating coupon:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

Router.get('/getCoupons', async (req, res) => {
    try {
        // Fetch coupons from the database
        const coupons = await pool.promise().query('SELECT * FROM coupons');
        
        // Return the coupons in the response
        res.status(200).json(coupons);
    } catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
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
// Endpoint to fetch orders
Router.get('/getOrders', async (req, res) => {
    try {
        const orderQuery = `
            SELECT 
                o.*,
                oi.OrderItemID,
                f.Title AS FoodItemTitle,
                a.Title AS AddonTitle
            FROM 
                Orders o
            JOIN 
                OrderItems oi ON o.OrderID = oi.OrderID
            LEFT JOIN 
                FoodItems f ON oi.FoodItemID = f.FoodItemID
            LEFT JOIN 
                Addons a ON oi.AddonID = a.AddonID
        `;
        
        pool.query(orderQuery, (error, results) => {
            if (error) {
                console.error("Error fetching orders:", error);
                return res.status(500).json({ error: "An error occurred while fetching orders." });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "An error occurred while fetching orders." });
    }
});

// Endpoint to get number of pending orders, pending reservations, and unresolved complaints
Router.get('/pendingReservation', (req, res) => {
    try {
        // Count pending orders
        const pendingReservationsQuery = 'SELECT COUNT(*) AS PendingReservations FROM Reservations WHERE Status = \'Pending\'';
        pool.query(pendingReservationsQuery, (error, pendingReservationsQuery) => {
            if (error) {
                console.error("Error fetching pending orders count:", error);
                return res.status(500).json({ error: "An error occurred while fetching pending orders count." });
            }
            
            

            // Return pending orders count as JSON response
            res.status(200).json({ pendingReservationsQuery });
        });
    } catch (error) {
        console.error("Error fetching pending orders count:", error);
        res.status(500).json({ error: "An error occurred while fetching pending orders count." });
    }
});


// Endpoint to fetch number of pending reservations
Router.get('/pendingOrders', (req, res) => {
    try {
        // Count pending reservations
        const pendingReservationsQuery = 'SELECT COUNT(*) AS PendingOrders FROM Orders WHERE Status = \'Pending\'';
;


        pool.query(pendingReservationsQuery, (error, pendingReservationsResult) => {
            if (error) {
                console.error("Error fetching pending reservations count:", error);
                return res.status(500).json({ error: "An error occurred while fetching pending reservations count." });
            }
            
            

            // Return pending reservations count as JSON response
            res.status(200).json({ pendingReservationsResult });
        });
    } catch (error) {
        console.error("Error fetching pending reservations count:", error);
        res.status(500).json({ error: "An error occurred while fetching pending reservations count." });
    }
});

// Endpoint to fetch number of unresolved complaints
Router.get('/unresolvedComplaints', (req, res) => {
    try {
        // Count unresolved complaints
        const unresolvedComplaintsQuery = 'SELECT COUNT(*) AS UnresolvedComplaints FROM Complaints WHERE IsResolved = 0';
        pool.query(unresolvedComplaintsQuery, (error, unresolvedComplaintsResult) => {
            if (error) {
                console.error("Error fetching unresolved complaints count:", error);
                return res.status(500).json({ error: "An error occurred while fetching unresolved complaints count." });
            }
            
           

            // Return unresolved complaints count as JSON response
            res.status(200).json({ unresolvedComplaintsResult });
        });
    } catch (error) {
        console.error("Error fetching unresolved complaints count:", error);
        res.status(500).json({ error: "An error occurred while fetching unresolved complaints count." });
    }
});



Router.get('/getOrderItems', async (req, res) => {
    try {
        const query = `
            SELECT
                oi.OrderItemID,
                oi.OrderID,
                oi.Quantity,
                oi.Subtotal,
                f.Title AS FoodItemTitle,
                a.Title AS AddonTitle
            FROM
                OrderItems oi
            JOIN
                FoodItems f ON oi.FoodItemID = f.FoodItemID
            LEFT JOIN
                Addons a ON oi.AddonID = a.AddonID
        `;
        
        pool.query(query, (error, results) => {
            if (error) {
                console.error("Error fetching order items:", error);
                return res.status(500).json({ error: "An error occurred while fetching order items." });
            }
            res.status(200).json(results);
        });
    } catch (error) {
        console.error("Error fetching order items:", error);
        res.status(500).json({ error: "An error occurred while fetching order items." });
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
       
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({ error: 'An error occurred while fetching complaints.' });
    }
});

// update complaint status
Router.put('/updateComplaintStatus/:complaintId', async (req, res) => {
    try {
        const { complaintId } = req.params;
        const { isResolved } = req.body;

        // Update the complaint status in the database
        const query = 'UPDATE Complaints SET IsResolved = ? WHERE ComplaintID = ?';
        pool.query(query, [isResolved, complaintId], (error, results) => {
            if (error) {
                console.error('Error updating complaint status:', error);
                return res.status(500).json({ error: 'An error occurred while updating complaint status.' });
            }
            res.status(200).json({ message: 'Complaint status updated successfully.' });
        });
    } catch (error) {
        console.error('Error updating complaint status:', error);
        return res.status(500).json({ error: 'An error occurred while updating complaint status.' });
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


// Endpoint to add a notification to both tables
Router.post('/notifications', async (req, res) => {
    try {
        const { type, message, customer_id } = req.body;
        
        // Insert into notifications table
        const [notificationResult] = await pool.promise().query('INSERT INTO notifications (type, message, CustomerID) VALUES (?, ?, ?)', [type, message, customer_id]);
        const notificationId = notificationResult.insertId;

        // Insert into promotion_notifications table if type is 'promotion' or 'generic'
        if (type === 'promotion' || type === 'generic') {
            await pool.promise().query('INSERT INTO promotion_notifications (notification_id, type, message) VALUES (?, ?, ?)', [notificationId, type, message]);
        }

        res.status(201).json({ message: 'Notification added successfully' });
    } catch (error) {
        console.error("Error adding notification:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Endpoint to fetch all notifications from the notifications table
Router.get('/notifications', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM notifications');
        res.json(rows);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Endpoint to fetch customer-related notifications using customer_id
Router.get('/notifications/customer', fetchUser, async (req, res) => {
    try {
        const customerId = req.user;
        const [rows] = await pool.promise().query('SELECT * FROM notifications WHERE CustomerID = ?', customerId);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching customer notifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Endpoint to fetch all notifications from the promotion_notifications table
Router.get('/notifications/promotions', async (req, res) => {
    try {
        const [rows] = await pool.promise().query('SELECT * FROM promotion_notifications');
        res.json(rows);
    } catch (error) {
        console.error("Error fetching promotion notifications:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

Router.post('/notifications/promotions', async (req, res) => {
    try {
        const { type, message } = req.body;
        const [result] = await pool.promise().query('INSERT INTO promotion_notifications (type, message) VALUES (?, ?)', [type, message]);
        const newNotification = { notification_id: result.insertId, type, message };
        res.status(201).json(newNotification);
    } catch (error) {
        console.error("Error creating promotion notification:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = Router;