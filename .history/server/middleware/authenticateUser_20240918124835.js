const jwt = require('jsonwebtoken');
require('dotenv').config();
// Middleware to authenticate user
const authenticateUser = (req, res, next) => {
    // Extract token from Authorization header
    
  
    const authHeader = req.headers['authorization'];
    console.log(authHeader)
   
    if (!authHeader) {
        console.error('No authorization header');
        return res.status(401).send('Unauthorized ,getting token');
    }

    // Extract token from 'Bearer <token>' format
    const token = authHeader.split(' ')[1];
   
    if(!token){
        console.error('No token found in authorization header');
    }
    // Verify the token
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send('Unauthorized , making token');
        }
     
        // Attach user ID to request object
        req.userId = decoded.userId;
    
        
        next();
    });
};

module.exports = authenticateUser;
