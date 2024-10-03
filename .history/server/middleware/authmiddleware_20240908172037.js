// authMiddleware.js
const jwt = require('jsonwebtoken'); // Assuming you're using JWT for authentication

// Function to get user from token
const getUserFromToken = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_KEY); // Verify the token and get decoded data
        // Fetch user details from database using decoded data (e.g., user ID)
        const user = await User.findById(decoded.userId); // Replace with your method to get user
        return user;
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
};

module.exports = { getUserFromToken };
