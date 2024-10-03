const express = require('express');
const connectDb = require('../..//frontend/src/utils/db');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const { ObjectId } = require('mongodb');

router.post("/data", authenticateUser, async (req, res) => {
    const userId = req.userId; 

    const {
        name,
        age,
        weightInKg,
        heightInCm,
        goal,
        gender,
        dob
    } = req.body;

    const db = await connectDb(); 
    const collection = db.collection('User');

    if (db) {
        // Create a new tracker entry
        const newTrackerEntry = {
            age,
            // weightInKg,
            // heightInCm,
            weightInKg: weightInKg.map(weight => ({
                date: new Date(), // Assuming you want to set the current date
                weight: weight.weight // Assuming weight is an object with a weight property
            })),
            heightInCm: heightInCm.map(height => ({
                date: new Date(), // Assuming you want to set the current date
                height: height.height // Assuming height is an object with a height property
            })),
            goal,
            gender,
            dob
        };
        console.log(newTrackerEntry)

        // Update the user's tracker
        const record = await collection.updateOne(
            { _id: new ObjectId(userId) },
            { 
                $push: { 
                    'tracker.$': newTrackerEntry 
                } 
            },
            { upsert: false } // This will create the document if it doesn't exist
        );

        
    }

    res.json({ status: true, msg: "Data received", name });
});

module.exports = router;
