const express = require('express');
const app = express();
require('dotenv').config()
const connectDB = require('./config/db');
const cors = require('cors');
const PubRouter = require('./routes/publication_router');

connectDB();
app.use(cors());

app.use('/', PubRouter);

const API_PORT = process.env.API_PORT || 5000;

app.listen(API_PORT, () => console.log(`Server is running on port ${ API_PORT }!`));