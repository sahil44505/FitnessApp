const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const { Cashfree}= require('cashfree-pg');
function generateOrderId() {
    const uniqueId = crypto.randomBytes(16).toString('hex');
    const hash = crypto.createHash('sha256');
    hash.update(uniqueId);
    const orderId = hash.digest('hex');
    return orderId.substr(0, 12);
}

// Example route using the generateOrderId function
router.get('/payment', async(req, res) => {
    try {

        let request = {
            "order_amount": 1.00,
            "order_currency": "INR",
            "order_id": await generateOrderId(),
            "customer_details": {
                "customer_id": "webcodder01",
                "customer_phone": "9999999999",
                "customer_name": "Web Codder",
                "customer_email": "webcodder@example.com"
            },
        }
    
    try{
        
        Cashfree.PGCreateOrder("2023-08-01",request).then(response => {
            console.log(response.data);
            res.json({msg:'data sent',data:response.data})

        }).catch(error =>{
            console.error(error.response.data.message)
        })
        
        } catch (error) {
            
            if (error.response && error.response.data && error.response.data.message) {
                console.error("Error message:", error.response.data.message);
                res.status(500).json({ error: error.response.data.message });
            } else {
                console.error("Unknown error:", error);
                res.status(500).json({ error: "Order creation failed" });
            }
        }



    } catch (error) {
        console.log("Try error")
        console.log(error);
    }


})

router.post('/verify', async (req, res) => {

    try {

        let {
            orderId
        } = req.body;

        Cashfree.PGOrderFetchPayments("2023-08-01", orderId).then((response) => {

            res.json(response.data);
        }).catch(error => {
            console.error(error.response.data.message);
        })


    } catch (error) {
        console.log(error);
    }
})


module.exports = router;