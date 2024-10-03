const jwt = require('jsonwebtoken');
require('dotenv').config(); // To access secret key from environment variables

const authenticateUser = (req, res, next) => {
    // Get the token from the request header
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
    }

    try {
        // Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_KEY);

        // Attach the user ID from the token payload to the request object
        req.userId = decoded.userId;
        console.log(req.userId)
        // Proceed to the next middleware or route handler
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authenticateUser;
