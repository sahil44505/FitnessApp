const express = require('express');

const router = express.Router();
const { Cashfree } = require('cashfree-pg');
const { getUserFromToken } = require('../middleware/authmiddleware');
const { ObjectId } = require('mongodb'); 
const connectDb = require("../db")

// Function to generate a unique Order ID
const { randomBytes } = require('crypto');

// Asynchronous function to generate a unique Order ID
async function generateOrderId() {
    return new Promise((resolve, reject) => {
        try {
            const timestamp = Date.now().toString();
            const randomPart = randomBytes(6).toString('hex'); // Generates a 12-character hex string
            const orderId = `${timestamp}-${randomPart}`;
            resolve(orderId);
        } catch (error) {
            reject(error);
        }
    });
}

// Route to create a payment order
router.post('/payment', getUserFromToken, async (req, res) => {
    try {
        const { cartItems } = req.body;

        if (!cartItems || !cartItems.length) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Fetch user details based on the token
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        // Calculate total amount based on cart items
        const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const orderId = await generateOrderId();
      
        let request = {
            "order_amount": totalAmount,
            "order_currency": "INR",
            "order_id": orderId,
            "customer_details": {
                "customer_id": user._id.toString(),
                "customer_phone": "9986545646",
                "customer_name": user.name || "Anonymous",
                "customer_email": user.email || "example@gmail.com"
            },
        };

        Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

        // Create payment order
        Cashfree.PGCreateOrder("2023-08-01", request)
            .then(response => {
                res.json({ msg: 'Payment session created', data: response.data });
            })
            .catch(error => {
                console.error(error.response?.data?.message || 'Payment creation failed');
                res.status(500).json({ error: error.response?.data?.message || 'Payment creation failed' });
            });

    } catch (error) {
        console.error("Internal error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to verify payment
router.post('/verify', getUserFromToken, async (req, res) => {
    try {
        const { orderId } = req.body;
        

        const user = req.user;

        if (!orderId) {
            return res.status(400).json({ error: 'Order ID is required' });
        }

        await Cashfree.PGOrderFetchPayments("2023-08-01", orderId)
            .then(async (response) => {
                
                if (response.data) {
                    const db = await connectDb();
                    const collection = db.collection('User');
                    const userId = new ObjectId(user._id);

                    // Clear user's cart in MongoDB
                    await collection.updateOne({ _id: userId }, { $set: { cart: [] } });
                    res.status(200).json({ success: true, message: "Payment successful", data: response.data });
                } else {
                    res.status(400).json({ success: false, message: "Payment failed", data: response.data });
                }
            })
            .catch(error => {
                console.error("Verification Error:", error.response?.data?.message || error);
                res.status(500).json({ error: "Payment verification failed" });
            });

    } catch (error) {
        console.error("Internal Verification Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;
