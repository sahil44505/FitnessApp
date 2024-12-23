const express = require('express');
const router = express.Router();
const authTokenHandler = require('../middleware/authenticateUser');

const request = require('request')
const connectDb = require('../db')

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
            const user = await collection.findOne({ _id: userId });
            
           
            const newCalorieEntry = {
                item,
                date: new Date(date),
                quantity,
                quantitytype,
                calorieIntake: parseInt(calorieIntake),
            };
            if (!user.tracker[0].calorieIntake) {
                user.tracker[0].calorieIntake = []; // Initialize the array if it doesn't exist
            }
            
            // Use $push to add the new entry to the calorieIntake array, even if it doesn't exist yet
            const result = await collection.updateOne(
             
              { _id: userId },
                { $push: { 'tracker.0.calorieIntake': newCalorieEntry }}
               
            );
            if (result.modifiedCount === 0) {
                return res.status(404).json(createResponse(false, 'No tracker entry found to update.',result));
            }
   
            
            res.json(createResponse(true, 'Calorie intake added successfully',newCalorieEntry,result));
        }
    });

})
router.post('/getcalorieintakebydate', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
  
    const user = await collection.findOne({ _id: userId });
    const inputDate = date ? new Date(date) : new Date(); ; 
   
    
    if (!date) {
          
        user.tracker.calorieIntake = filterEntriesByDate(user.tracker[0].calorieIntake, inputDate);

        return res.json(createResponse(true, 'Calorie intake for today', user.tracker.calorieIntake));
    }
    const inputDateStr = inputDate.toISOString().split('T')[0]; // Get date in 'YYYY-MM-DD' format
    if (!user.tracker[0].calorieIntake) {
        user.tracker[0].calorieIntake = []; 
    }
    // Filter entries by checking if they match the input date (ignoring time)
    const filteredEntries = user.tracker[0].calorieIntake.filter(entry => {
        const entryDateStr = new Date(entry.date).toISOString().split('T')[0]; 
        return entryDateStr === inputDateStr; 
    });

    
    
    res.json(createResponse(true, 'Calorie intake for the date', filteredEntries));
    

})
router.post('/getcalorieintakebylimit', authTokenHandler, async (req, res) => {
    const { limit } = req.body;
    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    // Find the user based on the userId
    const user = await collection.findOne({ _id: userId });
    if (!user) {
        return res.status(404).json(createResponse(false, 'User not found'));
    }

    // Check if limit is provided in the request body
    if (!limit) {
        return res.status(400).json(createResponse(false, 'Please provide limit'));
    } else if (limit === 'all') {
        return res.json(createResponse(true, 'All calorieIntake entries', user.tracker[0].calorieIntake));
    } else {
        let date = new Date();
        let currentDate = new Date(date.setDate(date.getDate() - parseInt(limit))).getTime();



        user.tracker.calorieIntake = user.tracker[0].calorieIntake.filter((item) => {
            return new Date(item.date).getTime() >= currentDate;
        })

        return res.json(createResponse(true, `Steps entries for the last ${limit} days`, user.tracker.calorieIntake));
    }
});

router.delete('/deletecalorieintake', authTokenHandler, async (req, res) => {
    const { item, date } = req.body;

    if (!item || !date) {
        return res.status(400).json(createResponse(false, 'Please provide all the details'));
    }

    const userId = new ObjectId(req.userId);
    const db = await connectDb();
    const collection = db.collection('User');
    
    const inputDate = date ? new Date(date) : new Date(); 
    
    
    const inputDateStr = inputDate.toISOString().split('T')[0]; // full ISO string for date and time comparison
    
    
    const user = await collection.findOne({ _id: userId });
    
    
    user.tracker[0].calorieIntake = user.tracker[0].calorieIntake.filter((entry) => {
        const entryDateStr = new Date(entry.date).toISOString().split('T')[0];
       
        return !(entry.item === item && entryDateStr === inputDateStr);
    });

    // Update the user's document in the database
    const result = await collection.updateOne(
        { _id: userId },
        { $set: { 'tracker.0.calorieIntake': user.tracker[0].calorieIntake } }
    );

    // Check if the update was successful
    if (result.modifiedCount === 0) {
        return res.status(404).json(createResponse(false, 'No matching calorie intake found to delete.'));
    }

    res.json(createResponse(true, 'Calorie intake deleted successfully', result));
});
router.get('/getgoalcalorieintake', authTokenHandler, async (req, res) => {
    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });
    let maxCalorieIntake = 0;
    const trackerData = user.tracker[user.tracker.length - 1];
    
    let heightInCm = parseFloat(trackerData.heightInCm[0].height); 
   // Accessing heightInCm from tracker object
    let weightInKg = parseFloat(trackerData.weightInKg[0].weight);  // Accessing weightInKg from tracker object
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