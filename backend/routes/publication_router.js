const PubController = require('../controllers/publication_controller');

const express = require('express');
const PubRouter = express.Router();

PubRouter.param('title', function(request, response, next, title){
    console.log(title);
    next();
})

PubRouter.param('author', function(request, response, next, author){
    console.log(author);
    next();
})

PubRouter.get('/search/title=:title&author=:author', PubController.searchTA);
PubRouter.get('/search/title=:title', PubController.searchTitle);
PubRouter.get('/reference/type/:type', PubController.sortbyType);
PubRouter.get('/reference/:id/:id2/save=yes', PubController.getSave);
PubRouter.get('/reference/:id/:id2', PubController.getOne);
PubRouter.get('/', PubController.getAll);

module.exports = PubRouter;