const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Adjust based on your file structure

// Function to get user from token
const getUserFromToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Authorization header is missing or invalid' });
        }

        const token = authHeader.split(' ')[1]; // Extract token from Authorization header
        if (typeof token !== 'string') {
            return res.status(401).json({ error: 'Invalid token format' });
        }

        const decoded = jwt.verify(token, process.env.JWT_KEY); // Verify the token and get decoded data
        const user = await User.findById(decoded.userId); // Replace with your method to get user
        req.user = user; // Add user to request object
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = { getUserFromToken };
