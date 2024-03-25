const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { mssql, pool, sql } = require('../db/db');
const Router = express.Router();



const saltRounds = 10;
const generateToken = (AdminID) => {
    const secretKey = process.env.SECRET_KEY;
    const expiresIn = '1h'; // Token expiration time
    return jwt.sign({ AdminID, }, secretKey, { expiresIn })
}

// Endpoint for inserting admins


Router.post('/addAdmin', [
    //added validation using the validator
    body("userName", "Enter the correct userName").isLength({ min: 3 }),
    body("password", "Password must be at least 5 Characters").isLength({ min: 5 }),

], async (req, res) => {
    const { userName, password } = req.body;
    let success = false;
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ success, result: result.array() });
    }

    try {
        // Check if all required fields are provided
        if (!userName || !password) {
            return res.status(400).json({ error: "Missing required fields in the request body." });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10); // Using 10 rounds of salt

        // Insert admin into the database
        pool.query('INSERT INTO Admins (UserName, Password) VALUES (?, ?)',
            [userName, hashedPassword],
            async (error, results) => {
                if (error) {
                    console.error('Error inserting admin:', error);
                    return res.status(500).json({ error: 'An error occurred while inserting the admin.' });
                }

                const adminID = results.insertId;

                const token = generateToken(adminID);

                res.status(200).json({
                    message: "Admin inserted successfully.",
                    user: {
                        AdminID: adminID,
                        UserName: userName,
                        Password: hashedPassword
                    },
                    token
                });
            });
    } catch (error) {
        console.error("Error inserting admin:", error);
        res.status(500).json({ error: "An error occurred while inserting the admin." });
    }
});


// Endpoint for admin login
Router.post('/adminLogin', async (req, res) => {
    const { userName, password } = req.body;

    try {
        // Check if all required fields are provided
        if (!userName || !password) {
            return res.status(400).json({ error: "Missing required fields in the request body." });
        }

        // Query the database to retrieve admin details based on username
        const adminQuery = 'SELECT * FROM Admins WHERE UserName = ?';
        pool.query(adminQuery, [userName], async (error, results) => {
            if (error) {
                console.error("Error logging in admin:", error);
                return res.status(500).json({ error: "An error occurred while logging in." });
            }

            // Check if admin with the provided username exists
            if (results.length === 0) {
                return res.status(404).json({ error: "Admin not found." });
            }

            // Retrieve the hashed password from the database
            const hashedPassword = results[0].Password;

            // Compare the provided password with the hashed password
            const match = await bcrypt.compare(password, hashedPassword);
            if (!match) {
                return res.status(401).json({ error: "Incorrect password." });
            }

            // Generate a JWT token
            const token = generateToken(results[0].AdminID);

            // Set the token into cookies
            res.cookie('token', token, { httpOnly: true });

            // Send the token back to the client
            res.status(200).json({ token });
        });

    } catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).json({ error: "An error occurred while logging in." });
    }
});

module.exports = Router;