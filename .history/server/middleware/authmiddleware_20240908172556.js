const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb'); // Import MongoClient

const uri = process.env.MONGO_URI; // MongoDB URI from environment variables
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const getUserFromToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header is missing or invalid' });
        }

        const token = authHeader.split(' ')[1];
        if (typeof token !== 'string') {
            return res.status(401).json({ error: 'Invalid token format' });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const userId = decoded.userId;

        await client.connect(); // Ensure the client is connected
        const database = client.db('your-database-name'); // Replace with your database name
        const usersCollection = database.collection('users'); // Replace with your users collection name

        const user = await usersCollection.findOne({ _id: userId });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

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
