const express = require('express');
const { mssql, pool, sql } = require('../db/db');
const fetchUser = require('../middlewares/fetchCustomer');
const multer = require('multer');
const Router = express.Router();


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

Router.post('/uploadImage', upload.single('image'), fetchUser, async (req, res) => {
    const customerID = req.user; // Assuming userId is sent in the request body
    const imageData = req.file.buffer;
    const uploadDate = new Date(); // Get the current datetime

    try {
        // Check if userId is provided
        if (!customerID) {
            return res.status(400).json({ error: 'Missing customerID in request body' });
        }

        // Check if image file is provided
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        // Insert image data using a direct query
        const query = 'INSERT INTO CustomerImages (CustomerID, ImageData, UploadDate) VALUES (?, ?, ?)';
        await pool.query(query, [customerID, imageData, uploadDate]);

        res.status(200).send('Image uploaded successfully');
    } catch (err) {
        console.error('Error uploading image:', err);
        res.status(500).send('Failed to upload image');
    }
});






// Endpoint for inserting addresses
Router.post('/addAddress', fetchUser, async (req, res) => {
    const { addressID, address, phoneNumber } = req.body;
    const customerID = req.user;

    try {
        if (!addressID || !address || !phoneNumber) {
            return res.status(400).json({ error: "Missing required fields in the request body." });
        }

        const query = `INSERT INTO Addresses (AddressID, CustomerID, Address, PhoneNumber) VALUES (?, ?, ?, ?)`;
        await pool.promise().query(query, [addressID, customerID, address, phoneNumber]);

        res.status(200).json({ message: "Address inserted successfully." });
    } catch (error) {
        console.error("Error inserting address:", error);
        res.status(500).json({ error: "An error occurred while inserting the address." });
    }
});



// Define the calculateTotalAmount function
const calculateTotalAmount = (orderItems) => {
    let totalAmount = 0;
    orderItems.forEach((item) => {
        console.log("Item:", item);
        totalAmount += item.quantity * item.subtotal;
    });
    return totalAmount;
};


// Endpoint for placing orders

function generateOrderItemId() {
    return Math.floor(1000 + Math.random() * 9000); // Generate a four-digit random number
}

Router.post('/placeOrder', fetchUser, async (req, res) => {
    const { orderId, orderItems, paymentStatus, status } = req.body;
    const customerID = req.user;

    try {
        // Check if all required fields are provided
        if (!orderId || !orderItems || !paymentStatus || !status) {
            return res.status(400).json({ error: "Missing required fields in the request body." });
        }

        // Check if orderItems is an array and is not empty
        if (!Array.isArray(orderItems) || orderItems.length === 0) {
            return res.status(400).json({ error: "Invalid orderItems data." });
        }

        // Insert order into Orders table
        const orderDate = new Date().toISOString().slice(0, 10);
        const orderInsertQuery = `
            INSERT INTO Orders (OrderID, CustomerID, OrderDate, PaymentStatus, TotalAmount, Status)
            VALUES (?, ?, ?, ?, ?, ?);
        `;
        await pool.promise().query(orderInsertQuery, [orderId, customerID, orderDate, paymentStatus, calculateTotalAmount(orderItems), status]);

        // Insert order items into OrderItems table
        for (const item of orderItems) {
            const { foodItemID, quantity, subtotal } = item;

            // Check if all required fields for order item are provided
            if (!foodItemID || !quantity || !subtotal) {
                return res.status(400).json({ error: "Missing required fields for order item." });
            }

            // Generate a unique four-digit order item ID
            const orderItemID = generateOrderItemId();

            const orderItemInsertQuery = `
                INSERT INTO OrderItems (OrderItemID, OrderID, FoodItemID, Quantity, Subtotal)
                VALUES (?, ?, ?, ?, ?);
            `;
            await pool.promise().query(orderItemInsertQuery, [orderItemID, orderId, foodItemID, quantity, subtotal]);
        }

        // Fetch the inserted order details
        const getOrderQuery = `
            SELECT * FROM Orders WHERE OrderID = ?;
        `;
        const [orderDetails] = await pool.promise().query(getOrderQuery, [orderId]);

        res.status(200).json({ message: "Order placed successfully.", orderDetails });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ error: "An error occurred while placing the order." });
    }
});


//get my orders

// Router.get('/my-orders', fetchUser, async (req, res) => {
//     const customerID = req.user;

//     try {
//         // Fetch orders for the customer
//         const getOrdersQuery = `
//             SELECT * FROM OrderItems WHERE CustomerID = ?;
//         `;
//         const [orders] = await pool.query(getOrdersQuery, [customerID]);

//         res.status(200).json({ orders });
//     } catch (error) {
//         console.error("Error fetching orders:", error);
//         res.status(500).json({ error: "An error occurred while fetching orders." });
//     }
// });



//getting customer reservations
Router.post('/createReservation', fetchUser, async (req, res) => {
    const { reservationID, reservationDate, noOfTables, status } = req.body;
    const customerID = req.user;
    try {
        // Check if all required fields are provided
        if (!reservationID || !customerID || !reservationDate || !noOfTables || !status) {
            return res.status(400).json({ error: "Missing required fields in the request body." });
        }

        // Check if status is valid
        const validStatusValues = ['Pending', 'Confirmed', 'Rejected'];
        if (!validStatusValues.includes(status)) {
            return res.status(400).json({ error: "Invalid status value." });
        }

        // Insert reservation using a query
        const query = `INSERT INTO Reservations (ReservationID, CustomerID, ReservationDate, NoOfTables, Status) VALUES (?, ?, ?, ?, ?)`;
        await pool.promise().query(query, [reservationID, customerID, reservationDate, noOfTables, status]);

        res.status(200).json({ message: "Reservation created successfully." });
    } catch (error) {
        // If an error occurs, rollback the transaction
        console.error("Error creating reservation:", error);
        res.status(500).json({ error: "An error occurred while creating the reservation." });
    } 
});



//getting customer feedback
Router.post('/submitFeedback', fetchUser, async (req, res) => {
    const { serviceRating, foodRating, comment } = req.body;
    const customerID = req.user;
    try {
        // Check if all required fields are provided
        if (!customerID || !serviceRating || !foodRating || !comment) {
            return res.status(400).json({ error: "Missing required fields in the request body." });
        }

    
        const feedbackInsertQuery = `INSERT INTO Feedback (CustomerID, ServiceRating, FoodRating, Comment) VALUES (?, ?, ?, ?)`;
        await pool.promise().query(feedbackInsertQuery, [customerID, serviceRating, foodRating, comment]);

        res.status(200).json({ message: "Feedback submitted successfully." });
    } catch (error) {
        // If an error occurs, rollback the transaction
        console.error("Error submitting feedback:", error);
        res.status(500).json({ error: "An error occurred while submitting the feedback." });
    } 
});


Router.post('/addComplaints', fetchUser, async (req, res) => {
    try {
        const { ComplaintType, ComplaintText } = req.body;
        const CustomerID = req.user;

        // Check if required fields are provided
        if (!CustomerID || !ComplaintType || !ComplaintText) {
            return res.status(400).json({ error: 'CustomerID, ComplaintType, and ComplaintText are required.' });
        }

        // Check if ComplaintType is valid
        const validComplaintTypes = ['Food', 'Website', 'Hotel']; // Add more complaint types as needed
        if (!validComplaintTypes.includes(ComplaintType)) {
            return res.status(400).json({ error: 'Invalid ComplaintType.' });
        }

        // Insert the complaint into the database
        const query = 'INSERT INTO Complaints (CustomerID, ComplaintType, ComplaintText) VALUES (?, ?, ?)';
        await pool.promise().query(query, [CustomerID, ComplaintType, ComplaintText]);

        res.status(201).json({ message: 'Complaint posted successfully.' });
    } catch (error) {
        console.error('Error posting complaint:', error);
        res.status(500).json({ error: 'An error occurred while posting complaint.' });
    }
});


Router.post('/addPayment', fetchUser, async (req, res) => {
    const { orderId, amount } = req.body;
    const userID = req.user; // Assuming req.user contains the user ID
    const PaymentDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Assuming you want to set the payment date as the current date
    const CustomerID = req.user;

    try {
        // Check if orderId and amount are provided
        if (!orderId || !amount) {
            return res.status(400).json({ error: 'orderId and amount are required' });
        }

        // Validate orderId format (you can add your own validation logic)
        if (typeof orderId !== 'number' || orderId <= 0) {
            return res.status(400).json({ error: 'Invalid orderId' });
        }

        // Validate amount format (you can add your own validation logic)
        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: 'Invalid amount' });
        }

        // Check if the user is authorized to perform this action (optional)
        // Example: if (req.user.role !== 'admin') { return res.status(401).json({ error: 'Unauthorized' }); }

        // Insert payment into the database
        const query = `
            INSERT INTO Payments (OrderID, CustomerID, Amount, PaymentDate)
            VALUES (?, ?, ?, ?)
        `;
        await pool.query(query, [orderId, CustomerID, amount, PaymentDate]);

        // Respond with success message
        res.status(200).json({ message: 'Payment added successfully' });
    } catch (error) {
        console.error('Error adding payment:', error);
        res.status(500).json({ error: 'An error occurred while adding payment' });
    }
});



// Endpoint to get the image
Router.get('/my-image', fetchUser, (req, res) => {
    const customerId = req.user;

    // Fetch the most recent image data from the database
    const imageQuery = 'SELECT ImageData FROM CustomerImages WHERE CustomerID = ? ORDER BY UploadDate DESC LIMIT 1';
    pool.query(imageQuery, [customerId], (error, results) => {
        if (error) {
            console.error('Error fetching image:', error);
            return res.status(500).send('Failed to fetch image');
        }

        if (results.length === 0) {
            return res.status(404).send('Image not found');
        }

        const imageData = results[0].ImageData;
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(imageData);
    });
});

// Endpoint to fetch food items
Router.get('/getFoodItems/:id', (req, res) => {
    const ItemID = req.params.id || null;

    if (!ItemID || isNaN(ItemID)) {
        return res.status(400).json({ error: "Invalid FoodItemID provided." });
    }

    const query = 'SELECT * FROM FoodItems WHERE FoodItemID = ?';
    pool.query(query, [ItemID], (error, results) => {
        if (error) {
            console.error("Error fetching food items:", error);
            return res.status(500).json({ error: "An error occurred while fetching food items." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Food item not found." });
        }

        res.status(200).json(results);
    });
});

// Endpoint to fetch customer's addresses
Router.get('/my-addresses', fetchUser, (req, res) => {
    const userID = req.user;

    if (!userID || isNaN(userID)) {
        return res.status(400).json({ error: "Invalid userID provided." });
    }

    const query = 'SELECT * FROM Addresses WHERE CustomerID = ?';
    pool.query(query, [userID], (error, results) => {
        if (error) {
            console.error("Error fetching addresses:", error);
            return res.status(500).json({ error: "An error occurred while fetching addresses." });
        }

        res.status(200).json(results);
    });
});

// Endpoint to fetch customer's orders
Router.get('/my-orders', fetchUser, (req, res) => {
    const userID = req.user;

    if (!userID || isNaN(userID)) {
        return res.status(400).json({ error: "Invalid userID provided." });
    }

    const query = 'SELECT * FROM Orders WHERE CustomerID = ?';
    pool.query(query, [userID], (error, results) => {
        if (error) {
            console.error("Error fetching orders:", error);
            return res.status(500).json({ error: "An error occurred while fetching orders." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "No orders found for the user." });
        }

        res.status(200).json(results);
    });
});

// Endpoint to fetch customer's reservations
Router.get('/my-reservations', fetchUser, (req, res) => {
    const userID = req.user;

    if (!userID || isNaN(userID)) {
        return res.status(400).json({ error: "Invalid userID provided." });
    }

    const query = 'SELECT * FROM Reservations WHERE CustomerID = ?';
    pool.query(query, [userID], (error, results) => {
        if (error) {
            console.error("Error fetching reservations:", error);
            return res.status(500).json({ error: "An error occurred while fetching reservations." });
        }

        res.status(200).json(results);
    });
});

// Endpoint to fetch customer's feedback
Router.get('/my-feedback', fetchUser, (req, res) => {
    const userID = req.user;

    if (!userID || isNaN(userID)) {
        return res.status(400).json({ error: "Invalid userID provided." });
    }

    const query = 'SELECT * FROM Feedback WHERE CustomerID = ?';
    pool.query(query, [userID], (error, results) => {
        if (error) {
            console.error("Error fetching feedback:", error);
            return res.status(500).json({ error: "An error occurred while fetching feedback." });
        }

        res.status(200).json(results);
    });
});

// Endpoint to fetch customer's complaints
Router.get('/my-complaints', fetchUser, (req, res) => {
    const userID = req.user;

    if (!userID || isNaN(userID)) {
        return res.status(400).json({ error: "Invalid userID provided." });
    }

    const query = 'SELECT * FROM Complaints WHERE CustomerID = ?';
    pool.query(query, [userID], (error, results) => {
        if (error) {
            console.error("Error fetching complaints:", error);
            return res.status(500).json({ error: "An error occurred while fetching complaints." });
        }

        res.status(200).json(results);
    });
});

// Endpoint to fetch customer's payments
Router.get('/my-payments', fetchUser, (req, res) => {
    const CustomerID = req.user;

    if (!CustomerID || isNaN(CustomerID)) {
        return res.status(400).json({ error: "Invalid customerID provided." });
    }

    const query = 'SELECT * FROM Payments WHERE CustomerID = ?';
    pool.query(query, [CustomerID], (error, results) => {
        if (error) {
            console.error("Error fetching payments:", error);
            return res.status(500).json({ error: "An error occurred while fetching payments." });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({ error: "No payments found for the customer." });
        }

        res.status(200).json({ payments: results });
    });
});


const stripe = require('stripe')('sk_test_51OINxgHgDxyW6XeqXdvsjgWOyp1oKvTDcbcliYmQFFhOxq1UGqePKlnzHKcG6vT0XWzzU6S6Q9rKORczTys6WbFw00OsaMM5I7');

// Route for creating a session
Router.post('/payment-session', async (req, res) => {
    const { items } = req.body;
    console.log(items)


    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name
                    },
                    unit_amount: Number.isNaN(item.price) ? 0 : item.price * 100, // Convert price to cents, handle NaN
                },

                quantity: 1,
            })),
            mode: 'payment',
            success_url: 'http://localhost:5173/',
            cancel_url: 'http://localhost:5173/Cart',
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




module.exports = Router;