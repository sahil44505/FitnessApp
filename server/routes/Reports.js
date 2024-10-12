const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectDb = require('../../frontend/src/utils/db');
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
    // Get user's ID and connect to the database
    const userId = new ObjectId(req.userId);
    const db = await connectDb();
    const collection = db.collection('User');

    // Fetch the user data
    const user = await collection.findOne({ _id: userId });

    // Check if user or tracker data exists
    if (!user || !user.tracker || !user.tracker.length) {
        return res.json(createResponse(false, 'User not found or no tracker data available', null));
    }

    const trackerData = user.tracker[0]; // Access the first tracker data
    let today = new Date();
    let oneWeekAgo = new Date(today); // Clone today's date
    oneWeekAgo.setDate(today.getDate() - 7); // Set to one week ago
    let calorieIntakee = 0;

    // Calculate calorie intake for the past 7 days
    if (trackerData.calorieIntake && Array.isArray(trackerData.calorieIntake)) {
        trackerData.calorieIntake.forEach((entry) => {
            const entryDate = new Date(entry.date);
            
            // Ensure the entry date is within the last 7 days
            if (entryDate >= oneWeekAgo && entryDate <= today) {
                calorieIntakee += parseInt(entry.calorieIntake, 10) || 0;  // Fallback to 0 if NaN
            }
        });
    }
    

   
    let steps = 0;
    if (trackerData.steps && Array.isArray(trackerData.steps)) {
        trackerData.steps.forEach((entry) => {
            const entryDate = new Date(entry.date);

            if (entryDate >= oneWeekAgo && entryDate <= today) {
                steps += parseInt(entry.steps, 10) || 0;  
            }
        });
    }
  

   
    let weight = trackerData.weightInKg && Array.isArray(trackerData.weightInKg) 
        ? trackerData.weightInKg[trackerData.weightInKg.length - 1].weight 
        : null;

   
    let height = trackerData.heightInCm && Array.isArray(trackerData.heightInCm) 
        ? trackerData.heightInCm[trackerData.heightInCm.length - 1].height 
        : null;

    
    let workout = 0;
    if (trackerData.workouts && Array.isArray(trackerData.workouts)) {
        trackerData.workouts.forEach((entry) => {
            const entryDate = new Date(entry.date);

            if (entryDate >= oneWeekAgo && entryDate <= today) {
                workout += 1;
            }
        });
    }


   
    let BMR = 0;
    let gender = trackerData.gender;
    let age = 0;

    
    let birthDate = new Date(trackerData.dob);
    if (birthDate > today) {
        console.log('Date of birth is in the future. Age cannot be calculated.');
        age = undefined; 
    } else {
        age = today.getFullYear() - birthDate.getFullYear();
        let monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--; 
        }
    }

   
    let weightInKg = parseFloat(weight);
    let heightInCm = parseFloat(height);
    if (gender === 'male') {
        BMR = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) + 5;
    } else if (gender === 'female') {
        BMR = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) - 161;
    } else {
        BMR = (10 * weightInKg) + (6.25 * heightInCm) - (5 * age) - 161;
    }

   
    let maxCalorieIntake = 0;
    let goal = trackerData.goal;
    if (goal === 'weightLoss') {
        maxCalorieIntake = BMR - 500;  
    } else if (goal === 'weightGain') {
        maxCalorieIntake = BMR + 500;  
    } else {
        maxCalorieIntake = BMR; 
    }

    
    let goalWeight = 22 * ((heightInCm / 100) ** 2);

    
    let goalWorkout = (goal === "weightLoss") ? 7 : (goal === "weightGain") ? 4 : 5;

   
    let goalSteps = (goal === "weightLoss") ? 10000 : (goal === "weightGain") ? 5000 : 7500;

    // Preparing response data
    let tempResponse = [
        {
            name: "Calorie Intake",
            value: calorieIntakee,
            goal: maxCalorieIntake,
            unit: "cal",
        },
        {
            name: "Steps",
            value: steps,
            goal: goalSteps,
            unit: "steps",
        },
        {
            name: "Workout",
            value: workout,
            goal: goalWorkout,
            unit: "days",
        },
        {
            name: "Weight",
            value: weight,
            goal: goalWeight,
            unit: "kg",
        },
    ];

    res.json(createResponse(true, 'Report', tempResponse));
});

module.exports = router;
