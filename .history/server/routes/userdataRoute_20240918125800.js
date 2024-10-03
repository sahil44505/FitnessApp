const express = require('express')
const connectDb =  require('../..//frontend/src/utils/db')
const router = express.Router()
const authenticateUser = require('../middleware/authenticateUser')
const { ObjectId } = require('mongodb');
router.post("/data",authenticateUser,async (req, res) => {
   const userId = req.userId; 
   
   const { name,
    age,
    weightInKg,
    heightInCm,
    goal,
    gender,
    dob}=req.body
    const db = await connectDb(); 
   
    const collection = db.collection('User');
    Record= 0
    if(db){
         Record = await collection.updateOne({_id: new ObjectId(userId)}, 
         { $set: { 
          tracker:[{age},
               {weightInKg},
               heightInCm,
               goal,
               gender,
               dob}]}}
               ,{ upsert: true});
    }
    console.log(Record)
       
   
    res.json({status:true , msg:"Data received" , name})
});
module.exports=router;