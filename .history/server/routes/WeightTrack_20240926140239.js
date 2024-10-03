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

router.post('/addweightentry', authTokenHandler, async (req, res) => {
    const { date, weightInKg } = req.body;

    if (!date || !weightInKg) {
        return res.status(400).json(createResponse(false, 'Please provide date and weight'));
    }

    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });
   
   

    newWeightData = {
        date: new Date(date),
        weight : weightInKg,
    }
    const result = await collection.updateOne(
        { _id: userId },
        { $set: { 
            'tracker.0.weightInKg': newWeightData // Replace weightInKg with newWeightData
        }}
    );
    if (result.modifiedCount === 0) {
        return res.status(404).json(createResponse(false, 'No tracker entry found to update.'));
    }

    res.json(createResponse(true, 'Weight entry added successfully',result));
});

router.post('/getweightbydate', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });

    if (!date) {
        let date = new Date();
        user.tracker.weightInKg = filterEntriesByDate(user.tracker.weightInKg, date);

        return res.json(createResponse(true, 'Weight entries for today', user.tracker.weightInKg));
    }

    user.tracker.weight = filterEntriesByDate(user.tracker.weightInKg, new Date(date));
    res.json(createResponse(true, 'Weight entries for the date', user.tracker.weightInKg));
});


// has a bug
router.post('/getweightbylimit', authTokenHandler, async (req, res) => {
    const { limit } = req.body;

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    if (!limit) {
        return res.status(400).json(createResponse(false, 'Please provide limit'));
    } else if (limit === 'all') {
        return res.json(createResponse(true, 'All weight entries', user.weight));
    } else {
        let date = new Date();
        let currentDate = new Date(date.setDate(date.getDate() - parseInt(limit))).getTime();

 
        user.weight = user.weight.filter((item) => {
            return new Date(item.date).getTime() >= currentDate;
        })

        return res.json(createResponse(true, `Weight entries for the last ${limit} days`, user.weight));
    }
});

router.delete('/deleteweightentry', authTokenHandler, async (req, res) => {
    const { date } = req.body;

    if (!date) {
        return res.status(400).json(createResponse(false, 'Please provide date'));
    }

    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    user.weight = user.weight.filter(entry => entry.date !== date);

    await user.save();
    res.json(createResponse(true, 'Weight entry deleted successfully'));
});


// has a bug
router.get('/getusergoalweight', authTokenHandler, async (req, res) => {
    const userId = req.userId;
    const user = await User.findById({ _id: userId });

    const currentWeight = user.weight.length > 0 ? user.weight[user.weight.length - 1].weight : null;
    const goalWeight = 22 * ((user.height[user.height.length - 1].height / 100) ** 2);

    res.json(createResponse(true, 'User goal weight information', { currentWeight, goalWeight }));
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