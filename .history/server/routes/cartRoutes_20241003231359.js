const express = require('express')
const connectDb = require('../../frontend/src/utils/db')
const authenticateUser = require('../middleware/authenticateUser')
const router = express.Router();
const { ObjectId } = require('mongodb');
router.post('/cartSave',authenticateUser, async (req, res) => {
   
    const { items } = req.body;
    const userId = req.userId; // Ensure authenticateUser sets this correctly
    console.log(items)
   
    
    


    const db = await connectDb();

    await db.collection('User').updateOne(
        { _id: new ObjectId(userId) },
          
        { $set: { cart:items } },
        { upsert: false }
    );
  

    res.status(201).json({ message: 'Cart saved' ,});
});

// Load cart
router.get('/cart', authenticateUser, async (req, res) => {
    const userId = req.userId; // Assuming userId is a string
  
    const db = await connectDb();
    

    const userCart = await db.collection('User').findOne({  _id: new ObjectId(userId)  });
    res.status(200).json(userCart ? userCart.cart : items);
});

module.exports = router;