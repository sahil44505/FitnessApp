const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // MongoDB URI from environment variables
const client = new MongoClient(uri);

const getUserFromToken = async (req, res, next) => {
    try {
        // Extract token from Authorization header
        console.log('Request Headers:', req.headers);
        const authHeader = req.headers['authorization'];
     
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header is missing or invalid' });
        }

        const token = authHeader.split(' ')[1]; // Extract token from Authorization header
        if (typeof token !== 'string') {
            return res.status(401).json({ error: 'Invalid token format' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_KEY); // Verify the token and get decoded data

        // Connect to MongoDB and fetch user
        await client.connect();
        const database = client.db('yourDatabaseNa'); // Replace with your database name
        const usersCollection = database.collection('User'); // Replace with your users collection name

        const user = await usersCollection.findOne({ _id: decoded.userId });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Invalid token' });
    } finally {
        await client.close(); // Close the client connection
    }
};

module.exports = { getUserFromToken };
