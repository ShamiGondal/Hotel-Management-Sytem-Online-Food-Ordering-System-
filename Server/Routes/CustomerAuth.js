const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');
const { mssql, pool, sql } = require('../db/db');


const Router = express.Router();
const saltRounds = 10; // Number of salt rounds for bcrypt

// Function to generate JWT token
const generateToken = (userID) => {
    const secretKey = 'yourSecretKey'; // Replace with a strong secret key
    const expiresIn = '1h'; // Token expiration time

    return jwt.sign({ userID }, secretKey, { expiresIn });
};

Router.post('/CreateUser', [
    //added validation using the validator
    body("firstName", "Name should be at least 3 Characters").isLength({ min: 3 }),
    body("password", "Password must be at least 5 Characters").isLength({ min: 5 }),
    body("email", "Enter the correct Email").isEmail(),
  
  ], async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { firstName, lastName, email, password, credits } = req.body;
  
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10); // Using 10 rounds of salt
  
      // Insert a new customer into the database
      pool.query('INSERT INTO Customers (FirstName, LastName, Email, Password, Credits) VALUES (?, ?, ?, ?, ?)', 
        [firstName, lastName, email, hashedPassword, credits], 
        (error, results, fields) => {
          if (error) {
            console.error('Error creating user:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
  
          // Generate JWT token and include it in the response
          const token = generateToken(results.insertId); // Assuming CustomerID is auto-incremented
  
          res.status(200).json({
            message: 'User created successfully',
            user: {
              CustomerID: results.insertId,
              FirstName: firstName,
              LastName: lastName,
              Email: email,
              Credits: credits,
            },
            token,
          });
      });
    } catch (err) {
      console.error('Error creating user:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Login endpoint

Router.post('/Login', [
    //added validation using the validator
    body("email", "Enter the correct Email").isEmail(),
    body("password", "Password can not be blank").exists(),
  
  ], async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { email, password } = req.body;
  
      // Query to retrieve user data based on email
      const query = `
          SELECT * FROM Customers
          WHERE Email = ?;
      `;
  
      pool.query(query, [email], async (error, results) => {
        if (error) {
          console.error('Error during login:', error);
          return res.status(500).json({ error: 'Internal Server Error' });
        }
  
        const user = results[0];
  
        if (!user) {
          return res.status(401).json({ error: 'Invalid email or password.' });
        }
  
        // Compare hashed password with the provided password
        const passwordMatch = await bcrypt.compare(password, user.Password);
  
        if (!passwordMatch) {
          return res.status(401).json({ error: 'Invalid email or password.' });
        }
  
        // Generate JWT token
        const token = generateToken(user.CustomerID);
  
        // Set the token in cookies
        res.cookie('token', token, {
          httpOnly: true,
          maxAge: 3600000,
          sameSite: 'strict',
        });
  
        res.status(200).json({
          message: 'Login successful',
          user: {
            CustomerID: user.CustomerID,
            FirstName: user.FirstName,
            LastName: user.LastName,
            Email: user.Email,
            Credits: user.Credits,
          },
          token,
        });
      });
    } catch (err) {
      console.error('Error during login:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = Router;


