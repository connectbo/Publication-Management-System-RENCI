const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const publication_schema = Schema({ 
    Title: Array, 
    Authors: Array, 
    DOI: String, 
    Type: String 
});

module.exports = mongoose.model('Publication', publication_schema);