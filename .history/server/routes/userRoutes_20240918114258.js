const express = require('express')

const router = express.Router()
const jwt = require('jsonwebtoken')
require('dotenv').config();

const connectDb = require('../../frontend/src/utils/db')

router.post("/Login", async (req, res) => {
   
    let cart=[]
    const { nickname,  email } = req.body;
    let{name} =req.body
    try {
        const db = await connectDb(); 
        const collection = db.collection('User');
       
        const userExist = await collection.findOne({ email });
        if (userExist) {
           
            const token = jwt.sign({ userId: userExist._id }, process.env.JWT_KEY, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, maxAge: 360000 });
            return res.json({ status:true, msg: "User Logged in" ,token});
        }
        else if (!userExist){
            
            if(name === email){
                let new_name = name.str.replace(/@[\w.]+/g, '').replace(/[^a-zA-Z\s]/g, '');
                let temp = name;
                name = new_name;
                new_name = temp;
                await collection.insertOne({ nickname, name, email ,cart});
    
            }else{
                await collection.insertOne({ nickname, name, email ,cart});

        }  
            const newUser = await collection.findOne({ email: email });
            const token = jwt.sign({ userId: newUser._id }, process.env.JWT_KEY, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, maxAge: 360000 });
           
              
            return res.status(200).json({ status: true, msg: 'User created successfully' ,token})

        } 
    }catch (err) {
    console.error('Error creating user:', err);
}
    
});

module.exports = router;