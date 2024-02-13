const express = require('express');
const { mssql, pool, sql } = require('../db/db');
const Router = express.Router();

// Endpoint to update reservation status
Router.put('/updateReservationStatus/:reservationID', async (req, res) => {
    const { reservationID } = req.params;
    const { newStatus } = req.body;

    // Check if reservationID is provided
    if (!reservationID) {
        return res.status(400).json({ error: "Reservation ID is required." });
    }

    // Check if newStatus is provided
    if (!newStatus) {
        return res.status(400).json({ error: "New status is required." });
    }

    try {
        // Call the UpdateReservationStatus stored procedure
        const procedure = await pool.request()
            .input('ReservationID', mssql.Int, reservationID)
            .input('NewStatus', mssql.VarChar(50), newStatus)
            .execute('UpdateReservationStatus');

        res.status(200).json({ message: "Reservation status updated successfully." });
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

        // Call the UpdateOrderStatus stored procedure
        const procedure = await pool.request()
            .input('OrderID', mssql.Int, orderID)
            .input('NewStatus', mssql.VarChar(50), newStatus)
            .execute('UpdateOrderStatus');

        res.status(200).json({ message: "Order status updated successfully." });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ error: "An error occurred while updating order status." });
    }
});


// Endpoint to update complaint status
Router.put('/updateComplaintStatus/:complaintID', async (req, res) => {
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

        // Call the UpdateComplaintStatus stored procedure
        const procedure = await pool.request()
            .input('ComplaintID', mssql.Int, complaintID)
            .input('IsResolved', mssql.Bit, isResolved)
            .execute('UpdateComplaintStatus');

        res.status(200).json({ message: "Complaint status updated successfully." });
    } catch (error) {
        console.error("Error updating complaint status:", error);
        res.status(500).json({ error: "An error occurred while updating complaint status." });
    }
});

//Endpoint to update PaymentStatus in Order

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

        // Call the UpdatePaymentStatus stored procedure
        const result = await pool.request()
            .input('OrderID', mssql.Int, orderID)
            .input('NewPaymentStatus', mssql.VarChar(50), newPaymentStatus)
            .execute('UpdatePaymentStatus');

        res.status(200).json({ message: "Payment status updated successfully." });
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
            SET PaymentStatus = 'Received'
            WHERE OrderID = ${orderId};
        `;
        await pool.request().query(query);
        res.status(200).json({ message:` Payment status updated for order ${orderId}` });
    }catch (error) {
        console.error("Error updating payment status in order:", error);
        res.status(500).json({ error: "An error occurred while updating payment status in order." });
    }
});

// Endpoint to fetch payment details by order ID
Router.get('/getPaymentByOrderId/:orderId', async (req, res) => {
    try {
        const { orderId } = req.params;
        const query = `SELECT * FROM Payments WHERE OrderID = ${orderId};`
        const result = await pool.request().query(query);
        const payments = result.recordset;
        res.status(200).json({ payments });
    } catch (error) {
        console.error("Error fetching payments by order ID:", error);
        res.status(500).json({ error: "An error occurred while fetching payments by order ID." });
    }
});

// Endpoint to insert a new payment record
Router.post('/insertPayment', async (req, res) => {
    try {
        const { OrderID, CustomerID, Amount, PaymentDate } = req.body;

        // Validate input data
        if (!OrderID || !CustomerID || !Amount || !PaymentDate) {
            return res.status(400).json({ error: "Missing required fields." });
        }

        // Perform the insertion into the database
        const query = `
            INSERT INTO Payments (OrderID, CustomerID, Amount, PaymentDate)
            VALUES (@OrderID, @CustomerID, @Amount, @PaymentDate);
        `;
        await pool.request()
            .input('OrderID', mssql.Int, OrderID)
            .input('CustomerID', mssql.Int, CustomerID)
            .input('Amount', mssql.Decimal(10, 2), Amount)
            .input('PaymentDate', mssql.DateTime, PaymentDate)
            .query(query);

        res.status(201).json({ message: "Payment record inserted successfully." });
    } catch (error) {
        console.error("Error inserting payment record:", error);
        res.status(500).json({ error: "An error occurred while inserting payment record." });
    }
});

// Endpoint to confirm or reject an order
Router.put('/updateOrderStatus/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { action } = req.body;
        
        // Update the order status based on the action
        let status;
        if (action === 'confirm') {
            status = 'Confirmed';
        } else if (action === 'reject') {
            status = 'Rejected';
        } else {
            return res.status(400).json({ error: "Invalid action. Please provide 'confirm' or 'reject'." });
        }

        const query = `
            UPDATE Orders
            SET Status = @status
            WHERE OrderID = @id;
        `;
        await pool.request()
            .input('id', mssql.Int, id)
            .input('status', mssql.NVarChar(50), status)
            .query(query);

        res.status(200).json({ message:` Order ${action}ed successfully.` });
    } catch (error) {
        console.error(`Error ${action}ing order:, error`);
        res.status(500).json({ error: `An error occurred while ${action}ing order.` });
    }
});


// Endpoint to update food items
Router.put('/updateFoodItem/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, Price, Category, AvailableQuantity, FoodItemDiscount } = req.body;
        
        // Check if all required fields are present
        if (!Name || !Price || !Category || !AvailableQuantity || !FoodItemDiscount) {
            return res.status(400).json({ error: "All fields are required." });
        }

        

        const query = `
            UPDATE FoodItems 
            SET 
                Name = @Name,
                Price = @Price,
                Category = @Category,
                AvailableQuantity = @AvailableQuantity,
                FoodItemDiscount = @FoodItemDiscount
            WHERE 
                FoodItemID = @id;
        `;
        await pool.request()
            .input('Name', mssql.NVarChar(100), Name)
            .input('Price', mssql.Decimal(10, 2), Price)
            .input('Category', mssql.NVarChar(50), Category)
            .input('AvailableQuantity', mssql.Int, AvailableQuantity)
            .input('FoodItemDiscount', mssql.Decimal(5, 2), FoodItemDiscount)
            .input('id', mssql.Int, id)
            .query(query);

        res.status(200).json({ message: "Food item updated successfully." });
    } catch (error) {
        console.error("Error updating food item:", error);
        res.status(500).json({ error: "An error occurred while updating food item." });
    }
});

// Endpoint to update reservation status by ID
Router.put('/updateReservationStatus/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        // Update the status of the reservation with the specified ID
        await pool.request()
            .input('id', mssql.Int, id)
            .input('status', mssql.VarChar(50), status)
            .query('UPDATE Reservations SET Status = @status WHERE ReservationID = @id');

        // Send a success response
        res.status(200).json({ message: "Reservation status updated successfully." });
    } catch (error) {
        console.error("Error updating reservation status:", error);
        res.status(500).json({ error: "An error occurred while updating reservation status." });
    }
});

//for specific customer feedback
Router.get('/getFeedback/:customerID', async (req, res) => {
    const { customerID } = req.params;

    try {
        // Fetch feedback for the specified customer
        const result = await pool.request()
            .input('CustomerID', customerID)
            .query('SELECT * FROM Feedback WHERE CustomerID = @CustomerID');

        // Return the feedback data
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Error fetching feedback:", error);
        res.status(500).json({ error: "An error occurred while fetching feedback." });
    }
});

module.exports = Router;