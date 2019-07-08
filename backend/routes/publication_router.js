const PubController = require('../controllers/publication_controller');

const express = require('express');
const PubRouter = express.Router();

//search router  
PubRouter.get('/search/title=:title?&&author=:author?&&type=:type?', PubController.advancedSearch);
//PubRouter.get('/search/type=:type', PubController.sortbyType);

//add router
PubRouter.get('/reference/:id/:id2/save=yes', PubController.getSave);
PubRouter.get('/reference/:id/:id2', PubController.getOne);
PubRouter.get('/', PubController.getAll);

module.exports = PubRouter;