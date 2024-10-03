const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { Cashfree } = require('cashfree-pg');
const { getUserFromToken } = require('../middleware/authmiddleware'); // Adjust the import based on your file structure

// Function to generate a unique Order ID
function generateOrderId() {
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256');
    hash.update(uniqueId);
    const orderId = hash.digest('hex');
    return orderId.substr(0, 12);
}

// Route to create a payment order
router.post('/payment', getUserFromToken,async (req, res) => {
    try {
        const { cartItems } = req.body; // Expecting cartItems to be sent in the request body
        

        if (!cartItems || !cartItems.length) {
            return res.status(400).json({ error: 'Cart is empty' });
        }


         // Extract token from Authorization header

        // Fetch user details based on the token
        const user = req.user // Replace with your method to fetch user from token

        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Calculate total amount based on cart items
        const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        let request = {
            "order_amount": totalAmount,
            "order_currency": "INR",
            "order_id": generateOrderId(),
            "customer_details": {
                "customer_id": user._id.toString(), // User ID or another identifier
                "customer_phone": user.phone || '23232424',
                "customer_name": user.name || "sddad",
                "customer_email": user.email || "dsdad@gmail.com"
            },
        };
        Cashfree.XEnvironment=Cashfree.Environment.SANDBOX
        // Create payment order
        Cashfree.PGCreateOrder({headers: {'x_api_version': '2023-08-01' }})
            .then(response => {
                res.json({ msg: 'Order created', data: response.data });
            })
            .catch(error => {
                console.error('Order creation error:', error.response ? error.response.data.message : error.message);
                res.status(500).json({ error: error.response ? error.response.data.message : 'Order creation failed' });
            });

    } catch (error) {
        console.error('Internal error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to verify payment
router.post('/verify', async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ error: 'Order ID is required' });
        }

        // Verify payment
        Cashfree.PGOrderFetchPayments( {headers: {'x_api_version': '2023-08-01'},orderId})
            .then(response => {
                res.json(response.data);
            })
            .catch(error => {
                console.error('Payment verification error:', error.response ? error.response.data.message : error.message);
                res.status(500).json({ error: error.response ? error.response.data.message : 'Payment verification failed' });
            });

    } catch (error) {
        console.error('Internal error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
