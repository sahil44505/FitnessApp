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
        
        let todayISO = today.toISOString().split('T')[0];
        
        let calorieIntakee = 0;
        if (user.tracker && user.tracker.length > 0 && user.tracker[0].calorieIntake) {
        user.tracker[0].calorieIntake.forEach((entry) => {
        // let entryDateISO = new Date(entry.date).toISOString().split('T')[0];
       
        if (entry.date.getDate() >= today.getDate() - 7 && entry.date.getMonth() === today.getMonth() && entry.date.getFullYear() === today.getFullYear()) {
                calorieIntakee += parseInt(entry.calorieIntake,10);
            }
            
    });
    } else {
    // Set calorieIntakee as undefined if there's an error or it's not an array
    calorieIntakee = undefined; // Change to NaN or another value as per your requirements
    }
    
   

   

    // get today's steps
    let steps = 0;
    if (user.tracker && user.tracker.length > 0 && user.tracker[0].steps) {
    user.tracker[0].steps.forEach((entry) => {
        // let entryDateISO = new Date(entry.date).toISOString().split('T')[0];
       
        if (entry.date.getDate() >= today.getDate() - 7 && entry.date.getMonth() === today.getMonth() && entry.date.getFullYear() === today.getFullYear()) {
                steps += parseInt(entry.steps, 10);
            }
    });
} else {
    steps = undefined; // Change to another value as per your requirements
}

    // get today's weight
    let weight = user.tracker && user.tracker.length > 0 && user.tracker[0].weightInKg && user.tracker[0].weightInKg.length > 0 
        ? user.tracker[0].weightInKg[user.tracker[0].weightInKg.length - 1].weight 
        : undefined; // Set to undefined if there's no weight data

    // Get today's height
    let height = user.tracker && user.tracker.length > 0 && user.tracker[0].heightInCm && user.tracker[0].heightInCm.length > 0 
        ? user.tracker[0].heightInCm[user.tracker[0].heightInCm.length - 1].height 
        : undefined; // Set to undefined if there's no height data

    // get this week's workout
    let workout = 0;
    if (user.tracker && user.tracker.length > 0 && user.tracker[0].workouts) {
    user.tracker[0].workouts.forEach((entry) => {
        if (entry.date.getDate() >= today.getDate() - 7 && entry.date.getMonth() === today.getMonth() && entry.date.getFullYear() === today.getFullYear()) {
            workout += 1;
        }
    });

} else {
    workout = undefined; 
}

    // get goal calorieIntake

    let maxCalorieIntake = 0;
    const trackerData = user.tracker[user.tracker.length - 1];
    
    let heightInCm = (user.tracker && user.tracker.length > 0 && user.tracker[0].heightInCm && user.tracker[0].heightInCm.length > 0 ) 
    ? parseFloat(trackerData.heightInCm[0].height) 
    : undefined; // Safely get heightInCm or set to undefined

// Safely get weightInKg
let weightInKg = (user.tracker && user.tracker.length > 0 && user.tracker[0].heightInCm && user.tracker[0].heightInCm.length > 0) 
    ? parseFloat(trackerData.weightInKg[0].weight) 
    : undefined; // Safely get weightInKg or set to undefined
    
    if (user.tracker && user.tracker.length > 0 && user.tracker[0].dob) {
    let birthDate = new Date(user.tracker[0].dob); 
    let age = 0;
    
    if (birthDate > today) {
        console.log('Date of birth is in the future. Age cannot be calculated.');
    } else {
       
        let age = today.getFullYear() - birthDate.getFullYear();
    
    
        let monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    
        
    }
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
    let goal = trackerData.goal
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
    else if (user.tracker[0].goal == "weightGain") {
        goalSteps = 5000;
    }
    else {
        goalSteps = 7500;
    }

   
    

    let tempResponse = [
        {
            name : "Calorie Intake",
            value : calorieIntakee,
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
        
    ]

    res.json(createResponse(true, 'Report', tempResponse));
})



module.exports = router;