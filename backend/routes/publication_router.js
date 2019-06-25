const PubController = require('../controllers/publication_controller');

const express = require('express');
const PubRouter = express.Router();

PubRouter.get('/reference/type/:type', PubController.sortbyType);
PubRouter.get('/reference/:id/:id2/save=yes', PubController.getSave);
PubRouter.get('/reference/:id/:id2', PubController.getOne);
PubRouter.get('/', PubController.getAll);

module.exports = PubRouter;