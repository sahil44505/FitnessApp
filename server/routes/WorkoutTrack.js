const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectDb = require('../db')
const authTokenHandler = require('../middleware/authenticateUser');

const User = require('../models/UserSchema');

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}

router.post('/addworkoutentry', authTokenHandler, async (req, res) => {
    const { date, exercise, durationInMinutes } = req.body;

    if (!date || !exercise || !durationInMinutes) {
        return res.status(400).json(createResponse(false, 'Please provide date, exercise, and duration'));
    }

    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });

    newWorkoutsData = {
        date: new Date(date),
        exercise,
        durationInMinutes,
    }
    if (!user.tracker[0].workouts) {
        user.tracker[0].workouts = []; // Initialize the array if it doesn't exist
    }
   
    const result = await collection.updateOne(
        { _id: userId },
        { $push: { 
            'tracker.0.workouts':newWorkoutsData // Replace weightInKg with newWeightData
        }}
    );
    if (result.modifiedCount === 0) {
        return res.status(404).json(createResponse(false, 'No tracker entry found to update.'));
    }

    res.json(createResponse(true, 'Workout entry added successfully'));
});

router.post('/getworkoutsbydate', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });
    const inputDate = date ? new Date(date) : new Date(); ; 
    if (!user.tracker[0].workouts) {
        user.tracker[0].workouts = []; // Initialize the array if it doesn't exist
    }
    if (!date) {
        let date = new Date();
        user.workouts = filterEntriesByDate(user.tracker[0].workouts,inputDate);

        return res.json(createResponse(true, 'Workout entries for today', user.workouts));
    }
    const inputDateStr = inputDate.toISOString().split('T')[0]; // Get date in 'YYYY-MM-DD' format

    user.workouts = user.tracker[0].workouts.filter(entry => {
        const entryDateStr = new Date(entry.date).toISOString().split('T')[0]; 
        return entryDateStr === inputDateStr; 
    });
    res.json(createResponse(true, 'Workout entries for the date', user.workouts));
});


// has a bug
router.post('/getworkoutsbylimit', authTokenHandler, async (req, res) => {
    const { limit } = req.body;

    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });
    if (!limit) {
        return res.status(400).json(createResponse(false, 'Please provide limit'));
    } else if (limit === 'all') {
        return res.json(createResponse(true, 'All workout entries', user.tracker[0].workouts));
    } else {
        let date = new Date();
        let currentDate = new Date(date.setDate(date.getDate() - parseInt(limit))).getTime();

        user.workouts = user.tracker[0].workouts.filter((item) => {
            return new Date(item.date).getTime() >= currentDate;
        })

        return res.json(createResponse(true, `Workout entries for the last ${limit} days`, user.workouts));
    }
});

router.delete('/deleteworkoutentry', authTokenHandler, async (req, res) => {
    const { date } = req.body;

    if (!date) {
        return res.status(400).json(createResponse(false, 'Please provide date'));
    }

    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });
    const inputDate = date ? new Date(date) : new Date(); ; 
    const inputDateStr = inputDate.toISOString().split('T')[0];;; 
    user.workouts = user.tracker[0].workouts.filter(entry => {
        return new Date(entry.date).toISOString().split('T')[0] != inputDateStr;
    });

    const result = await collection.updateOne(
        { _id: userId },
        { $set: { 'tracker.0.workouts': user.workouts } }
    );

    res.json(createResponse(true, 'Workout entry deleted successfully'));
});


// has a bug
router.get('/getusergoalworkout', authTokenHandler, async (req, res) => {
    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });
    
    const trackerData = user.tracker[user.tracker.length - 1];
    let goal = trackerData.goal;


    if(goal == "weightLoss"){
        let goaldays = 7;
        res.json(createResponse(true, 'User goal workout days', {goaldays }));
    }
    else if(goal == "weightGain"){

        let goaldays = 4;
        res.json(createResponse(true, 'User goal workout days', { goaldays }));
    }
    else{
   
        let goaldays = 5;
        res.json(createResponse(true, 'User goal workout days', { goaldays }));
    }

    // res.json(createResponse(true, 'User workout history', { workouts: user.tracker[0].workouts }));
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