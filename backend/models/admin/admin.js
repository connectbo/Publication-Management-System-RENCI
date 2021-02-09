const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const admin_schema = Schema({
    Username: String,
    Password: String
});

module.exports = mongoose.model('Admin', admin_schema);