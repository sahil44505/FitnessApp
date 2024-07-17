const express = require('express')

const router = express.Router()
const User = require('../models/User')


const connectDb = require('../../frontend/src/utils/db')

router.post("/", async (req, res) => {
    const { nickname, name, email } = req.body;

    try {
        const db = await connectDb(); // Connect to the database
        const collection = db.collection('users'); // Access the 'users' collection

        // Insert a new user
        const result = await collection.insertOne({ nickname, name, email });

        if (result.insertedCount === 1) {
            return res.status(200).json({ status: true, msg: 'User created successfully' });
        } else {
            return res.status(500).json({ msg: 'Failed to create user' });
        }
    } catch (err) {
        console.error('Error creating user:', err);
        return res.status(500).json({ msg: 'Internal server error' });
    }
});

module.exports = router;