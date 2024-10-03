const express = require('express');
const router = express.Router();
const authTokenHandler = require('../middleware/authenticateUser');

const request = require('request')
const connectDb = require('../../frontend/src/utils/db')
const User = require('../models/UserSchema');
const { ObjectId } = require('mongodb');
require('dotenv').config();


function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}


router.get('/test', authTokenHandler, async (req, res) => {
    res.json(createResponse(true, 'Test API works for calorie intake report'));
});

router.post('/addcalorieintake', authTokenHandler, async (req, res) => {
    const { item, date, quantity, quantitytype } = req.body;
    if (!item || !date || !quantity || !quantitytype) {
        return res.status(400).json(createResponse(false, 'Please provide all the details'));
    }
    let qtyingrams = 0;
    if (quantitytype === 'g') {
        qtyingrams = quantity;
    }
    else if (quantitytype === 'kg') {
        qtyingrams = quantity * 1000;
    }
    else if (quantitytype === 'ml') {
        qtyingrams = quantity;
    }
    else if (quantitytype === 'l') {
        qtyingrams = quantity * 1000;
    }
    else {
        return res.status(400).json(createResponse(false, 'Invalid quantity type'));
    }

    var query = item;
    request.get({
        url: 'https://api.calorieninjas.com/v1/nutrition?query=' + query,
        headers: {
            'X-Api-Key':process.env.NUTRITION_API_KEY,
        },
    }, async function (error, response, body) {
        if (error) return console.error('Request failed:', error);
        else if (response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
        else {
           
            body = JSON.parse(body);
           
           
            if (!Array.isArray(body.items) || body.items.length === 0 || !body.items[0].calories || !body.items[0].serving_size_g) {
                return res.status(400).json(createResponse(false, 'Invalid response from nutrition API'));
            }
            let calorieIntake = (body.items[0].calories / body.items[0].serving_size_g) * parseInt(qtyingrams);
            const db = await connectDb(); 
            const collection = db.collection('User');
            
            const userId = new ObjectId(req.userId); 
            
           
            const newCalorieEntry = {
                item,
                date: new Date(date),
                quantity,
                quantitytype,
                calorieIntake: parseInt(calorieIntake),
            };
            
            // Use $push to add the new entry to the calorieIntake array, even if it doesn't exist yet
            const data = await collection.updateOne(
             
              { _id: userId },
                { $push: { calorieIntake: newCalorieEntry }}
               
            );
           

            
           
            
            
            res.json(createResponse(true, 'Calorie intake added successfully',newCalorieEntry));
        }
    });

})
router.post('/getcalorieintakebydate', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
  
    const user = await collection.findOne({ _id: userId });
    
    if (!date) {
        let date = new Date();   // sept 1 2021 12:00:00
        user.calorieIntake = filterEntriesByDate(user.calorieIntake, date);

        return res.json(createResponse(true, 'Calorie intake for today', user.calorieIntake));
    }
    user.calorieIntake = filterEntriesByDate(user.calorieIntake, new Date(date));
    res.json(createResponse(true, 'Calorie intake for the date', user.calorieIntake));

})
router.post('/getcalorieintakebylimit', authTokenHandler, async (req, res) => {
    const { limit } = req.body;
    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
  
    const user = await collection.findOne({ _id: userId });
    
    if (!limit) {
        return res.status(400).json(createResponse(false, 'Please provide limit'));
    } else if (limit === 'all') {
        return res.json(createResponse(true, 'Calorie intake', user.calorieIntake));
    }
    else {


        let date = new Date();
        let currentDate = new Date(date.setDate(date.getDate() - parseInt(limit))).getTime();
        console.log(currentDate)
        // 1678910

        user.calorieIntake = user.calorieIntake.filter((item) => {
            return new Date(item.date).getTime() >= currentDate;
        })


        return res.json(createResponse(true, `Calorie intake for the last ${limit} days`, user.calorieIntake));


    }
})
router.delete('/deletecalorieintake', authTokenHandler, async (req, res) => {
    const { item, date } = req.body;
    if (!item || !date) {
        return res.status(400).json(createResponse(false, 'Please provide all the details'));
    }

    const userId = new ObjectId(req.userId);
    const db = await connectDb();
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });
    if (!user) {
        return res.status(404).json(createResponse(false, 'User not found.'));
    }

    // Convert the provided date to a Date object
    const targetDate = new Date(date).toDateString();

    // Filter out the matching calorie intake entry by both item and date (date format normalized)
    user.calorieIntake = user.calorieIntake.filter((entry) => {
        return !(entry.item === item && new Date(entry.date).toDateString() === targetDate);
    });

    // Update the user document with the modified calorieIntake array
    const result = await collection.updateOne(
        { _id: userId },
        { $set: { calorieIntake: user.calorieIntake } }
    );

    // Check if any document was modified
    if (result.modifiedCount === 0) {
        return res.status(404).json(createResponse(false, 'No matching calorie intake found to delete.'));
    }

    res.json(createResponse(true, 'Calorie intake deleted successfully'));
});

router.get('/getgoalcalorieintake', authTokenHandler, async (req, res) => {
    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });
    let maxCalorieIntake = 0;
    const trackerData = user.tracker[user.tracker.length - 1];

    let heightInCm = parseFloat(trackerData.heightInCm);  // Accessing heightInCm from tracker object
    let weightInKg = parseFloat(trackerData.weightInKg);  // Accessing weightInKg from tracker object
    let age = parseInt(trackerData.age);  // Accessing age directly
    let gender = trackerData.gender;  // Accessing gender
    let goal = trackerData.goal;  // Accessing goal

    // BMR Calculation using Mifflin-St Jeor Equation
    let BMR = 0;
    if (gender == 'male') {
        BMR = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + 5;
    }
    else if (gender == 'female') {
        BMR = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) - 161;
    }
    else {
        BMR = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) - 161;
    }

    // Adjusting BMR based on goal
    if (goal == 'weightLoss') {
        maxCalorieIntake = BMR ;  // Calorie deficit for weight loss
    } 
    else if (goal == 'weightGain') {
        maxCalorieIntake = BMR ;  // Calorie surplus for weight gain
    } 
    else {
        maxCalorieIntake = BMR;  // Maintain weight
    }

    // Returning response with maxCalorieIntake
    res.json(createResponse(true, 'max calorie intake', { maxCalorieIntake }));
});


function filterEntriesByDate(entries, targetDate) {
    return entries.filter(entry => {
        const entryDate = new Date(entry.date);
        return (
            entryDate.getDate() === targetDate.getDate() &&
            entryDate.getMonth() === targetDate.getMonth() &&
            entryDate.getFullYear() === targetDate.getFullYear()
        );
    });
}
module.exports = router;