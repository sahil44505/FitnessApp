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
    if (!user.tracker[0].weightInKg) {
        user.tracker[0].weightInKg = []; // Initialize the array if it doesn't exist
    }
    const result = await collection.updateOne(
        { _id: userId },
        { $push: { 
            'tracker.0.weightInKg':newWeightData // Replace weightInKg with newWeightData
        }}
    );
    if (result.modifiedCount === 0) {
        return res.status(404).json(createResponse(false, 'No tracker entry found to update.'));
    }

    res.json(createResponse(true, 'Weight entry added successfully',result));
});
router.post('/addheightentry', authTokenHandler, async (req, res) => {
    const { date, heightInCm } = req.body;

    if (!date || !heightInCm) {
        return res.status(400).json(createResponse(false, 'Please provide date and weight'));
    }

    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });
   
   

    newheightData = {
        date: new Date(date),
        height : heightInCm,
    }
    if (!user.tracker[0].heightInCm) {
        user.tracker[0].heightInCm = []; // Initialize the array if it doesn't exist
    }
    const result = await collection.updateOne(
        { _id: userId },
        { $push: { 
            'tracker.0.heightInCm':newheightData // Replace weightInKg with newWeightData
        }}
    );
    if (result.modifiedCount === 0) {
        return res.status(404).json(createResponse(false, 'No tracker entry found to update.'));
    }

    res.json(createResponse(true, 'Height entry added successfully',result));
});

router.post('/getweightbydate', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    
    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });
   
    const inputDate = date ? new Date(date) : new Date(); ; 
  
    if (!date) {
        
        user.weightInKg = filterEntriesByDate(user.tracker[0].weightInKg, inputDate);

        return res.json(createResponse(true, 'Weight entries for today', user.weightInKg));
    }
    const inputDateStr = inputDate.toISOString().split('T')[0];

    user.tracker.weightInKg = user.tracker[0].filter(entry => {
        const entryDateStr = new Date(entry.date).toISOString().split('T')[0]; 
        return entryDateStr === inputDateStr; 
    });
    res.json(createResponse(true, 'Weight entries for the date', user.tracker.weightInKg));
});



router.post('/getweightbylimit', authTokenHandler, async (req, res) => {
    const { limit } = req.body;

    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });

    if (!limit) {
        return res.status(400).json(createResponse(false, 'Please provide limit'));
    } else if (limit === 'all') {
        return res.json(createResponse(true, 'All weight entries', user.tracker[0].weightInKg));
    } else {
        let date = new Date();
        let currentDate = new Date(date.setDate(date.getDate() - parseInt(limit))).getTime();

 
        user.tracker[0].weightInKg =user.tracker[0].weightInKg.filter((item) => {
            return new Date(item.date).getTime() >= currentDate;
        })

        return res.json(createResponse(true, `Weight entries for the last ${limit} days`,user.tracker[0].weightInKg));
    }
});

router.delete('/deleteweightentry', authTokenHandler, async (req, res) => {
    const { date } = req.body;

    if (!date) {
        return res.status(400).json(createResponse(false, 'Please provide date'));
    }

    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });
    const inputDate = date ? new Date(date) : new Date(); ; 
    const inputDateStr = inputDate.toISOString().split('T')[0];;
   
    weight = user.tracker[0].weightInKg.filter(entry => {
        return new Date(entry.date).toISOString().split('T')[0] != inputDateStr;
    });

    const result = await collection.updateOne(
        { _id: userId },
        { $set: { 'tracker.0.weightInKg': weight} }
    );

    if (result.modifiedCount === 0) {
        return res.status(404).json(createResponse(false, 'No matching steps track found to delete.'));
    }

    res.json(createResponse(true, 'Weight entry deleted successfully',weight));
});



router.get('/getusergoalweight', authTokenHandler, async (req, res) => {
    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });
    
  
    const currentWeight = user.tracker[0].weightInKg.length > 0 ? user.tracker[0].weightInKg[user.tracker[0].weightInKg.length - 1].weight : null;
    const goalWeight = 22 * ((user.tracker[0].heightInCm[user.tracker[0].heightInCm.length - 1].height / 100) ** 2);
    

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