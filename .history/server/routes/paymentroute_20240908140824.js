const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { Cashfree } = require('cashfree-pg');

// Function to generate a unique Order ID
function generateOrderId() {
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256');
    hash.update(uniqueId);
    const orderId = hash.digest('hex');
    return orderId.substr(0, 12);
}

// Route to create a payment order
router.post('/payment', async (req, res) => {
    try {
        const { cartItems } = req.body; // Expecting cartItems to be sent in the request body

        if (!cartItems || !cartItems.length) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Calculate total amount based on cart items
        const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

        let request = {
            "order_amount": totalAmount,
            "order_currency": "INR",
            "order_id": generateOrderId(),
            "customer_details": {
                "customer_id": "webcodder01",
                "customer_phone": "9999999999",
                "customer_name": "Web Codder",
                "customer_email": "webcodder@example.com"
            },
        };

        // Create payment order
        Cashfree.PGCreateOrder(process.env.CASHFREE_ENV, request) // Ensure CASHFREE_ENV is defined
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
        Cashfree.PGOrderFetchPayments(process.env.CASHFREE_ENV, orderId) // Ensure CASHFREE_ENV is defined
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