const express = require('express');
const jwt = require('jsonwebtoken'); // Token generation
const router = express.Router();
const connectDb = require('../../frontend/src/utils/db');

const JWT_SECRET = process.env.JWT_KEY|| "your_jwt_secret"; // Use an environment variable for the secret

// Helper function to sanitize nickname
const sanitizeNickname = (nickname) => {
    return nickname.replace(/[^a-zA-Z]/g, ''); // Remove all special characters and numbers
};

router.post("/Login", async (req, res) => {
    const { nickname, name, email } = req.body;

    try {
        const db = await connectDb(); // Connect to the database
        const collection = db.collection('usersss'); // Access the 'users' collection

        // Check if user already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            // User exists, generate token and return login successful
            const token = jwt.sign({ id: existingUser._id }, JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ status: true, msg: 'Login successful', token });
        }

        // If user doesn't exist, create a new user
        let newUser;
        if (name === nickname) {
            const sanitizedNickname = sanitizeNickname(nickname);
            newUser = {
                nickname: sanitizedNickname,
                name: sanitizedNickname,
                email,
                cart: []
            };
        } else {
            newUser = {
                nickname,
                name,
                email,
                cart: []
            };
        }

        // Insert new user into the database
        const result = await collection.insertOne(newUser);

        if (result.insertedCount === 1) {
            // Generate token for the new user
            const token = jwt.sign({ id: result.insertedId }, JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ status: true, msg: 'User created successfully', token });
        } else {
            return res.status(500).json({ msg: 'Failed to create user' });
        }
    } catch (err) {
        console.error('Error processing request:', err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;
