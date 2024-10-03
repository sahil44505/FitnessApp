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
    user.calorieIntake = user.calorieIntake.filter((item) => {
        return item.item != item && item.date != date;
    })
    await user.save();
    res.json(createResponse(true, 'Calorie intake deleted successfully'));

})
router.get('/getgoalcalorieintake', authTokenHandler, async (req, res) => {
    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
  
    const user = await collection.findOne({ _id: userId });
    let maxCalorieIntake = 0;
    let height = parseFloat(user.tracker.heightInCm[user.tracker.heightInCm.length - 1].heightInCm);
    console.log(height)
    let weightInKg = parseFloat(user.tracker.weightInKg[user.tracker.weightInKg.length - 1].weightInKg);
    let age = new Date().getFullYear() - new Date(user.tracker.dob).getFullYear();
    let BMR = 0;
    let gender = user.tracker.gender;
    if (gender == 'male') {
        BMR = 88.362 + (13.397 * weightInKg) + (4.799 * height) - (5.677 * age)

    }
    else if (gender == 'female') {
        BMR = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * age)

    }
    else {
        BMR = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * age)
    }
    if (user.tracker.goal == 'weightLoss') {
        maxCalorieIntake = BMR - 500;
    }
    else if (user.tracker.goal == 'weightGain') {
        maxCalorieIntake = BMR + 500;
    }
    else {
        maxCalorieIntake = BMR;
    }

    res.json(createResponse(true, 'max calorie intake', { maxCalorieIntake }));

})


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