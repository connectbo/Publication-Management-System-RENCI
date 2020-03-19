require('dotenv').config({ path: '/Users/Peter/Documents/GitHub/Publication-Management-System-RENCI/.env'});
const mongoose = require('mongoose');
const db = {
    mongoURI: 'mongodb://root:example@mongodb:27017/test?authSource=admin' || process.env.MONGO_URI,
};
const connectDB = async() => {
    try{
        await mongoose.connect(db.mongoURI, {
            useNewUrlParser: true
        });
        console.log('MongoDB Connected...');
    } catch(err) {
        console.log(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;


//Backup and Restore:

//docker exec mongodb sh -c 'mongodump -d test --authenticationDatabase admin -u root -p example' > db.dump
//docker exec mongodb sh -c 'mongorestore -d test dump/test/ -u root -p example --authenticationDatabase admin' < db.dump