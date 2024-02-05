const express = require('express');
const { mssql, pool, sql } = require('../Connections/db');

const Router = express.Router();

Router.post('/CreateUser', async (req, res) => {
    try {
        const { userID, firstName, lastName, email, password, credits } = req.body;

        // Call the stored procedure to insert a new customer
        const result = await pool.request()
            .input('CustomerID', mssql.Int, userID)  // Correct the usage of mssql here
            .input('FirstName', mssql.VarChar(255), firstName)
            .input('LastName', mssql.VarChar(255), lastName)
            .input('Email', mssql.VarChar(255), email)
            .input('Password', mssql.VarChar(255), password)
            .input('Credits', mssql.Int, credits)
            .execute('InsertCustomer');

        // Respond with the newly created user data
        if (!firstName || !lastName || !email || !password || !credits) {
            return res.status(400).json({ error: 'Invalid request body. Please provide all required fields.' });
        }

        res.status(201).json({
            message: 'User created successfully',
            user: {
                CustomerID: userID,
                FirstName: firstName,
                LastName: lastName,
                Email: email,
                Password: password,
                Credits: credits,
            },
        });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = Router;
