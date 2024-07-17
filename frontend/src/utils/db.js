const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI
const dbName = 'yourDatabaseNa'; // Replace with your database name

let client;

const connectDb = async () => {
    try {
        if (!client) {
            client = new MongoClient(uri);
            await client.connect();
            console.log('Connected to MongoDB');
        }
        return client.db(dbName); // Return the database instance
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit process if unable to connect
    }
};

module.exports = connectDb;
