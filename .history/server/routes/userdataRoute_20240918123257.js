const express = require('express')
const connectDb =  require('../..//frontend/src/utils/db')
const router = express.Router()

router.post("/data", async (req, res) => {
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
         Record = await collection.updateOne({_id: ObjectId(userId)}, 
         { $set: { 
          tracker:age,
               weightInKg,
               heightInCm,
               goal,
               gender,
               dob } }
               ,{ upsert: false });
    }
    console.log(Record)
       
   
    res.json({status:true , msg:"Data received" , name})
});
module.exports=router;