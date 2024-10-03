const express = require('express');
const router = express.Router();

const authTokenHandler = require('../middleware/authenticateUser');

const User = require('../models/UserSchema');

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}

router.post('/addstepentry', authTokenHandler, async (req, res) => {
    const { date, steps } = req.body;

    if (!date || !steps) {
        return res.status(400).json(createResponse(false, 'Please provide date and steps count'));
    }

    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });

    const data = await collection.updateOne(
        { _id: userId },
        {
        date: new Date(date),
        steps,
    });
    // const data = await collection.updateOne(
             
    //     { _id: userId },
    //       { $push: { calorieIntake: newCalorieEntry }}
         
    //   );
     


  
    res.json(createResponse(true, 'Steps entry added successfully'));
});

router.post('/getstepsbydate', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });

    if (!date) {
        let date = new Date();
        user.steps = filterEntriesByDate(user.steps, date);

        return res.json(createResponse(true, 'Steps entries for today', user.steps));
    }

    user.steps = filterEntriesByDate(user.steps, new Date(date));
    res.json(createResponse(true, 'Steps entries for the date', user.steps));
});



router.post('/getstepsbylimit', authTokenHandler, async (req, res) => {
    const { limit } = req.body;

    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });
    if (!limit) {
        return res.status(400).json(createResponse(false, 'Please provide limit'));
    } else if (limit === 'all') {
        return res.json(createResponse(true, 'All steps entries', user.steps));
    } else {
        let date = new Date();
        let currentDate = new Date(date.setDate(date.getDate() - parseInt(limit))).getTime();



        user.steps = user.steps.filter((item) => {
            return new Date(item.date).getTime() >= currentDate;
        })

        return res.json(createResponse(true, `Steps entries for the last ${limit} days`, user.steps));
    }
});

router.delete('/deletestepentry', authTokenHandler, async (req, res) => {
    const { date } = req.body;

    if (!date) {
        return res.status(400).json(createResponse(false, 'Please provide date'));
    }

    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });

    user.steps = user.steps.filter(entry => entry.date !== date);

    await user.save();
    res.json(createResponse(true, 'Steps entry deleted successfully'));
});



router.get('/getusergoalsteps', authTokenHandler, async (req, res) => {
    const userId = new ObjectId(req.userId);
    const db = await connectDb(); 
    const collection = db.collection('User');
    
    const user = await collection.findOne({ _id: userId });

    let totalSteps = 0;

    if(user.goal == "weightLoss"){
        totalSteps = 10000;
    }
    else if(user.goal == "weightGain"){
        totalSteps = 5000;
    }
    else{
        totalSteps = 7500;
    }   

    res.json(createResponse(true, 'User steps information', { totalSteps }));
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