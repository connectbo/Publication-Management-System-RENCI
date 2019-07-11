const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const category_schema = Schema({
    Category: String
});

module.exports = mongoose.model('Category', category_schema);
