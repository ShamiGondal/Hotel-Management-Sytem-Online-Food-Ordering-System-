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


module.exports = Router;