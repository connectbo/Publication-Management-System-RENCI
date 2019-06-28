require('dotenv').config({ path: '/Users/Peter/Documents/GitHub/Publication-Management-System-RENCI/.env'});
const mongoose = require('mongoose');
const db = {
    mongoURI: process.env.MONGO_URI || 'localhost',
};
const connectDB = async() => {
    try{
        await mongoose.connect(db.mongoURI, {
            useNewUrlParser: true
        });
        console.log('MongoDB Cloud Connected...');
    } catch(err) {
        console.log(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;