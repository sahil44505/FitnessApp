const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectDb = require('../../frontend/src/utils/db')
const authTokenHandler = require('../middleware/authenticateUser');

require('dotenv').config();


function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}


router.get('/test', authTokenHandler, async (req, res) => {
    res.json(createResponse(true, 'Test API works for report'));
});

router.get('/getreport', authTokenHandler, async (req, res) => {
    // get today's calorieIntake
    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });
    let today = new Date();

    let calorieIntake = 0;
    user.tracker[0].calorieIntake.forEach((entry) => {
        if (entry.date.getDate() === today.getDate() && entry.date.getMonth() === today.getMonth() && entry.date.getFullYear() === today.getFullYear()) {
            calorieIntake += entry.calorieIntake;
        }
    });

   

    // get today's steps
    let steps = 0;
    user.tracker[0].steps.forEach((entry) => {
        if (entry.date.getDate() === today.getDate() && entry.date.getMonth() === today.getMonth() && entry.date.getFullYear() === today.getFullYear()) {
            steps += entry.steps;
        }
    });

    // get today's weight
    let weight = user.tracker[0].weightInKg[user.tracker[0].weightInKg.length - 1].weight;
    // get today's height
    let height = user.tracker[0].heightInCm[user.tracker[0].heightInCm.length - 1].height;

    // get this week's workout
    let workout = 0;
    user.tracker[0].workouts.forEach((entry) => {
        if (entry.date.getDate() >= today.getDate() - 7 && entry.date.getMonth() === today.getMonth() && entry.date.getFullYear() === today.getFullYear()) {
            workout += 1;
        }
    });



    // get goal calorieIntake

    let maxCalorieIntake = 0;
    const trackerData = user.tracker[user.tracker.length - 1];
    
    let heightInCm = parseFloat(trackerData.heightInCm[0].height); 
   t
    let weightInKg = parseFloat(trackerData.weightInKg[0].weight);
    let age = new Date().getFullYear() - new Date(user.dob).getFullYear();
    let BMR = 0;
    let gender = user.tracker[0].gender;
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



    // get goal weight
    const goalWeight = 22 * ((user.tracker[0].heightInCm[user.tracker[0].heightInCm.length - 1].height / 100) ** 2);

    // get goal workout
    let goalWorkout = 0;
    if (user.tracker[0].goal == "weightLoss") {
   
        goalWorkout = 7;
    }
    else if (user.tracker[0].goal == "weightGain") {
    
        goalWorkout = 4;
    }
    else {
    
        goalWorkout = 5;
    }


    // get goal steps
    let goalSteps = 0;
    if (user.tracker[0].goal == "weightLoss") {
        goalSteps = 10000;
    }
    else if (user.taracker[0].goal == "weightGain") {
        goalSteps = 5000;
    }
    else {
        goalSteps = 7500;
    }

   
    

    let tempResponse = [
        {
            name : "Calorie Intake",
            value : calorieIntake,
            goal : maxCalorieIntake,
            unit : "cal",
        },
       
        {
            name: "Steps",
            value : steps,
            goal : goalSteps,
            unit : "steps",
        },
       
        {
            name : "Workout",
            value : workout,
            goal : goalWorkout,
            unit : "days",
        },
        {
            name : "Weight",
            value : weight,
            goal : goalWeight,
            unit : "kg",
        },
        {
            name : "Height",
            value : height,
            goal : "",
            unit : "cm",
        },
    ]

    res.json(createResponse(true, 'Report', tempResponse));
})



module.exports = router;