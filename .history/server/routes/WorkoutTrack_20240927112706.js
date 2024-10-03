const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const connectDb = require('../../frontend/src/utils/db')
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
    const userId = req.userId;

    const user = await User.findById({ _id: userId });

    if (!date) {
        let date = new Date();
        user.workouts = filterEntriesByDate(user.tracker[0].workouts, date);

        return res.json(createResponse(true, 'Workout entries for today', user.workouts));
    }

    user.workouts = filterEntriesByDate(user.tracker[0].workouts, new Date(date));
    res.json(createResponse(true, 'Workout entries for the date', user.workouts));
});


// has a bug
router.post('/getworkoutsbylimit', authTokenHandler, async (req, res) => {
    const { limit } = req.body;

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    if (!limit) {
        return res.status(400).json(createResponse(false, 'Please provide limit'));
    } else if (limit === 'all') {
        return res.json(createResponse(true, 'All workout entries', user.workouts));
    } else {
        let date = new Date();
        let currentDate = new Date(date.setDate(date.getDate() - parseInt(limit))).getTime();

        user.workouts = user.workouts.filter((item) => {
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

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    user.workouts = user.workouts.filter(entry => entry.date !== date);

    await user.save();
    res.json(createResponse(true, 'Workout entry deleted successfully'));
});


// has a bug
router.get('/getusergoalworkout', authTokenHandler, async (req, res) => {
    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    if(user.goal == "weightLoss"){
        let goal = 7;
        res.json(createResponse(true, 'User goal workout days', { goal }));
    }
    else if(user.goal == "weightGain"){

        let goal = 4;
        res.json(createResponse(true, 'User goal workout days', { goal }));
    }
    else{
   
        let goal = 5;
        res.json(createResponse(true, 'User goal workout days', { goal }));
    }

    res.json(createResponse(true, 'User workout history', { workouts: user.workouts }));
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