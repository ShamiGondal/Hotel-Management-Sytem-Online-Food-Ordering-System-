const express = require('express');
const { mssql, pool, sql } = require('../db/db');
const fetchUser = require('../middlewares/fetchCustomer');
const Router = express.Router();


// Endpoint for inserting addresses
Router.post('/addAddress', fetchUser, async (req, res) => {
    const { addressID, address, phoneNumber } = req.body;
    const customerID = req.user; // Retrieve authenticated user's CustomerID from the middleware

    try {
        // Check if all required fields are provided
        if (!addressID || !address || !phoneNumber) {
            return res.status(400).json({ error: "Missing required fields in the request body." });
        }

        // Start a transaction
        const transaction = await pool.transaction();

        // Begin the transaction
        await transaction.begin();

        // Insert address using the stored procedure
        const addressInsertQuery = `
            EXEC InsertAddress @AddressID = ${addressID}, @CustomerID = ${customerID}, @Address = '${address}', @PhoneNumber = '${phoneNumber}';
        `;
        await transaction.request().query(addressInsertQuery);

        // Commit the transaction
        await transaction.commit();

        res.status(200).json({ message: "Address inserted successfully." });
    } catch (error) {
        // If an error occurs, rollback the transaction
        console.error("Error inserting address:", error);
        if (error && error.transaction) {
            await error.transaction.rollback();
        }
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

        // Start a transaction
        const transaction = await pool.transaction();

        // Begin the transaction
        await transaction.begin();

        // Insert order into Orders table
        const orderDate = new Date().toISOString().slice(0, 10);
        const orderInsertQuery = `
        INSERT INTO Orders (OrderID, CustomerID, OrderDate, PaymentStatus, TotalAmount, Status)
        VALUES (${orderId}, ${customerID}, '${orderDate}', '${paymentStatus}', ${calculateTotalAmount(orderItems)}, '${status}');
    `;


        // Execute the order insert query
        await transaction.request().query(orderInsertQuery);

        // Insert order items into OrderItems table
        for (const item of orderItems) {
            const { orderItemID, foodItemID, quantity, subtotal } = item;

            // Check if all required fields for order item are provided
            if (!orderItemID || !foodItemID || !quantity || !subtotal) {
                await transaction.rollback();
                return res.status(400).json({ error: "Missing required fields for order item." });
            }

            const orderItemInsertQuery = `
                INSERT INTO OrderItems (OrderItemID, OrderID, FoodItemID, Quantity, Subtotal)
                VALUES (${orderItemID}, ${orderId}, ${foodItemID}, ${quantity}, ${subtotal});
            `;

            // Execute the order item insert query
            await transaction.request().query(orderItemInsertQuery);
        }

        // Commit the transaction
        await transaction.commit();

        // Fetch the inserted order details
        const getOrderQuery = `
            SELECT * FROM Orders WHERE OrderID = ${orderId};
        `;
        const result = await pool.request().query(getOrderQuery);
        const orderDetails = result.recordset[0];

        res.status(200).json({ message: "Order placed successfully.", orderDetails });
    } catch (error) {
        // If an error occurs, rollback the transaction
        console.error("Error placing order:", error);
        if (error && error.transaction) {
            await error.transaction.rollback();
        }
        res.status(500).json({ error: "An error occurred while placing the order." });
    }
});


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

        // Start a transaction
        const transaction = await pool.transaction();

        // Begin the transaction
        await transaction.begin();

        // Insert reservation using the stored procedure
        const reservationInsertQuery = `
            EXEC InsertReservation @ReservationID = ${reservationID}, @CustomerID = ${customerID}, @ReservationDate = '${reservationDate}', @NoOfTables = ${noOfTables}, @Status = '${status}';
        `;
        await transaction.request().query(reservationInsertQuery);

        // Commit the transaction
        await transaction.commit();

        res.status(200).json({ message: "Reservation created successfully." });
    } catch (error) {
        // If an error occurs, rollback the transaction
        console.error("Error creating reservation:", error);
        if (error && error.transaction) {
            await error.transaction.rollback();
        }
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

        // Start a transaction
        const transaction = await pool.transaction();

        // Begin the transaction
        await transaction.begin();

        // Insert feedback using the stored procedure
        const feedbackInsertQuery = `
            EXEC InsertFeedback @CustomerID = ${customerID}, @ServiceRating = ${serviceRating}, @FoodRating = ${foodRating}, @Comment = '${comment}';
        `;
        await transaction.request().query(feedbackInsertQuery);

        // Commit the transaction
        await transaction.commit();

        res.status(200).json({ message: "Feedback submitted successfully." });
    } catch (error) {
        // If an error occurs, rollback the transaction
        console.error("Error submitting feedback:", error);
        if (error && error.transaction) {
            await error.transaction.rollback();
        }
        res.status(500).json({ error: "An error occurred while submitting the feedback." });
    }
});

Router.post('/addcomplaints', fetchUser, async (req, res) => {
    try {
        const {ComplaintType, ComplaintText } = req.body;
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
        const result = await pool.request()
            .input('CustomerID', mssql.Int, CustomerID)
            .input('ComplaintType', mssql.VarChar(50), ComplaintType)
            .input('ComplaintText', mssql.NVarChar(mssql.MAX), ComplaintText)
            .query('EXEC InsertComplaint @CustomerID, @ComplaintType, @ComplaintText');

        res.status(201).json({ message: 'Complaint posted successfully.' });
    } catch (error) {
        console.error('Error posting complaint:', error);
        res.status(500).json({ error: 'An error occurred while posting complaint.' });
    }
});


// Endpoint to fetch customer's addresses
Router.get('/my-addresses', fetchUser, async (req, res) => {
    const userID = req.user;
    try {
        const result = await pool.request()
            .input('userID', mssql.Int, userID)
            .query('SELECT * FROM Addresses WHERE CustomerID = @userID');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ error: "An error occurred while fetching addresses." });
    }
});

// Endpoint to fetch customer's orders
Router.get('/my-orders', fetchUser, async (req, res) => {
    const userID = req.user;
    try {
        const result = await pool.request()
            .input('userID', mssql.Int, userID)
            .query('SELECT * FROM Orders WHERE CustomerID = @userID');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ error: "An error occurred while fetching orders." });
    }
});


// Endpoint to fetch customer's reservations
Router.get('/my-reservations', fetchUser, async (req, res) => {
    const userID = req.user;
    try {
        const result = await pool.request()
            .input('userID', mssql.Int, userID)
            .query('SELECT * FROM Reservations WHERE CustomerID = @userID');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching reservations:", error);
        res.status(500).json({ error: "An error occurred while fetching reservations." });
    }
});

// Endpoint to fetch customer's feedback
Router.get('/my-feedback', fetchUser, async (req, res) => {
    const userID = req.user;
    try {
        const result = await pool.request()
            .input('userID', mssql.Int, userID)
            .query('SELECT * FROM Feedback WHERE CustomerID = @userID');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ error: "An error occurred while fetching feedback." });
    }
});

// Endpoint to fetch customer's complaints
Router.get('/my-complaints', fetchUser, async (req, res) => {
    try {
        // Check if the user is authenticated
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized access.' });
        }

        const CustomerID = req.user;

        // Check if CustomerID is valid (numeric)
        if (isNaN(CustomerID)) {
            return res.status(400).json({ error: 'Invalid CustomerID.' });
        }

        const result = await pool.request()
            .input('CustomerID', mssql.Int, CustomerID)
            .query('SELECT * FROM Complaints WHERE CustomerID = @CustomerID');
        const customerComplaints = result.recordset;

        res.status(200).json(customerComplaints);
    } catch (error) {
        console.error('Error fetching customer complaints:', error);
        res.status(500).json({ error: 'An error occurred while fetching customer complaints.' });
    }
});

// Endpoint to fetch customer's payments
Router.get('/my-payments', fetchUser, async (req, res) => {
    const customerID = req.user;

    // Check if customerID is valid
    if (!customerID || isNaN(customerID)) {
        return res.status(400).json({ error: "Invalid customerID provided." });
    }

    try {
        const query = `SELECT * FROM Payments WHERE CustomerID = ${customerID}`;
        const result = await pool.request().query(query);
        const payments = result.recordset;
        
        // Check if payments exist
        if (!payments || payments.length === 0) {
            return res.status(404).json({ error: "No payments found for the customer." });
        }
        
        res.status(200).json({ payments });
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ error: "An error occurred while fetching payments." });
    }
});


module.exports = Router;