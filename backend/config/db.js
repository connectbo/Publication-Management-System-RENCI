const mongoose = require('mongoose');
const db = {
    mongoURI: process.env.MONGO_URI,
};
//mongodb://root:example@mongodb:27017/test?authSource=admin
//mongodb+srv://Bo:Zb951208@chirper-2htxl.mongodb.net/test?retryWrites=true&w=majority

const connectDB = async() => {
    try{
        await mongoose.connect(db.mongoURI, {
            useNewUrlParser: true
        });
        console.log('MongoDB Connected...');
    } catch(err) {
        console.log(err.message);
    }
}

module.exports = connectDB;