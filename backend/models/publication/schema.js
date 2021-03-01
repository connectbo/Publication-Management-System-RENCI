const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const publication_schema = Schema({ 
    Title: String, 
    Authors: String, 
    DOI: String, 
    Type: String,
    Created_Date: String,
    Citation: String,
    Status: String
});

module.exports = mongoose.model('Publication', publication_schema);