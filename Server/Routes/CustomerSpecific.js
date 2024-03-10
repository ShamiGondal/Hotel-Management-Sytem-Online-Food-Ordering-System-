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

    let transaction;

    try {
        // Begin transaction
        transaction = new mssql.Transaction(pool);
        await transaction.begin();

        // Insert image data using the stored procedure
        const request = new mssql.Request(transaction);
        request.input('CustomerID', mssql.Int, customerID);
        request.input('ImageData', mssql.VarBinary, imageData);
        request.input('UploadDate', mssql.DateTime, uploadDate); // Add the datetime parameter
        await request.execute('InsertCustomerImage');

        // Commit transaction
        await transaction.commit();

        res.status(200).send('Image uploaded successfully');
    } catch (err) {
        console.error(err);
        if (transaction) {
            // Rollback transaction on error
            await transaction.rollback();
        }
        res.status(500).send('Failed to upload image');
    }
});





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

function generateOrderItemId() {
    return Math.floor(1000 + Math.random() * 9000); // Generate a four-digit random number
}

Router.post('/placeOrder', fetchUser, async (req, res) => {
    const { orderId, orderItems, paymentStatus, status } = req.body;
    const customerID = req.user;
    console.log(orderId, orderItems, paymentStatus, status);
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

        try {
            // Begin the transaction
            await transaction.begin();

            // Insert order into Orders table
            const orderDate = new Date().toISOString().slice(0, 10);
            const orderInsertQuery = `
                INSERT INTO Orders (OrderID, CustomerID, OrderDate, PaymentStatus, TotalAmount, Status)
                VALUES (${orderId}, ${customerID}, '${orderDate}', '${paymentStatus}', ${calculateTotalAmount(orderItems)}, '${status}');
            `;
            await transaction.request().query(orderInsertQuery);

            // Insert order items into OrderItems table
            for (const item of orderItems) {
                const { foodItemID, quantity, subtotal } = item;

                // Check if all required fields for order item are provided
                if (!foodItemID || !quantity || !subtotal) {
                    throw new Error("Missing required fields for order item.");
                }

                // Generate a unique four-digit order item ID
                const orderItemID = generateOrderItemId();

                const orderItemInsertQuery = `
                    INSERT INTO OrderItems (OrderItemID, OrderID, FoodItemID, Quantity, Subtotal)
                    VALUES (${orderItemID}, ${orderId}, ${foodItemID}, ${quantity}, ${subtotal});
                `;
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
            // Rollback the transaction if an error occurs
            await transaction.rollback();
            throw error; // Re-throw the error to be caught by the outer catch block
        }
    } catch (error) {
        console.error("Error placing order:", error);
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

Router.post('/addPayment',fetchUser, async (req, res) => {
    const { orderId, amount } = req.body;
    const userID = req.user; // Assuming req.user contains the user ID
    const PaymentDate = new Date().toISOString(); // Assuming you want to set the payment date as the current date
    CustomerID = req.user

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
            VALUES (@orderId, @CustomerID, @Amount, @PaymentDate)
        `;
        const values = { orderId, CustomerID: userID, Amount: amount, PaymentDate };

        await pool.request()
            .input('orderId', mssql.Int, values.orderId)
            .input('CustomerID', mssql.Int, values.CustomerID)
            .input('Amount', mssql.Decimal, values.Amount)
            .input('PaymentDate', mssql.DateTime, values.PaymentDate)
            .query(query);

        // Respond with success message
        res.status(200).json({ message: 'Payment added successfully' });
    } catch (error) {
        console.error('Error adding payment:', error);
        res.status(500).json({ error: 'An error occurred while adding payment' });
    }
});


// Endpoint to get the image
Router.get('/my-Image', fetchUser, async (req, res) => {
    const customerId = req.user;

    try {
        // Fetch the most recent image data from the database
        const result = await pool.request()
            .input('customerId', mssql.Int, customerId)
            .query('SELECT TOP 1 ImageData FROM CustomerImages WHERE CustomerID = @customerId ORDER BY UploadDate DESC');

        if (result.recordset.length === 0) {
            res.status(404).send('Image not found');
            return;
        }

        const imageData = result.recordset[0].ImageData;
        res.setHeader('Content-Type', 'image/jpeg');
        res.send(imageData);
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Failed to fetch image');
    }
});

// Endpoint to fetch food items
Router.get('/getFoodItems/:id', async (req, res) => {
    const ItemID = req.params.id || null;

    if (!ItemID) {
        return res.status(400).json({ error: "FoodItemID is missing in the request parameters." });
    }

    try {
        const result = await pool.request()
            .input('ItemID', mssql.Int, ItemID) // Assuming ItemID is an integer
            .query('SELECT * FROM FoodItems WHERE FoodItemID = @ItemID');

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Food item not found." });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching food items:", error);
        res.status(500).json({ error: "An error occurred while fetching food items." });
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
    console.log("UserID:", userID); // Log the user ID

    try {
        const result = await pool.request()
            .input('userID', mssql.Int, userID)
            .query('SELECT * FROM Orders WHERE CustomerID = @userID');

        console.log("Result from Database:", result.recordset); // Log the result

        // Check if there are any orders found
        if (result.recordset.length > 0) {
            res.status(200).json(result.recordset);
        } else {
            res.status(404).json({ error: "No orders found for the user." });
        }
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
    const CustomerID = req.user;
    console.log("customer id")

    console.log(CustomerID)
    // Check if customerID is valid
    if (!CustomerID || isNaN(CustomerID)) {
        return res.status(400).json({ error: "Invalid customerID provided." });
    }

    try {
        const query = `SELECT * FROM Payments WHERE CustomerID = ${CustomerID }`;
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