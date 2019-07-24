const express = require('express');
const app = express();
const connectDB = require('./config/db');
const cors = require('cors');
const PubRouter = require('./routes/publication_router');
const bodyParser = require('body-parser')

connectDB();
app.use(cors());
app.use(bodyParser.json())

app.use('/', PubRouter);

const API_PORT = process.env.API_PORT || 5050;

app.listen(API_PORT, () => console.log(`Server is running on port ${ API_PORT }!`));