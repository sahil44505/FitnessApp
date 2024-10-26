
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; 
const dbName = 'yourDatabaseNa'; 

let client;

const connectDb = async () => {
    try {
        if (!client) {
            client = new MongoClient(uri);
            await client.connect();
            console.log('Connected to MongoDB');
        }
        return client.db(dbName); 
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); 
    }
};

module.exports = connectDb;
