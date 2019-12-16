const PubController = require('../controllers/publication_controller');
const express = require('express');
const PubRouter = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

PubRouter.get('/test', PubController.test);

//search router  
PubRouter.get('/search/title=:title?&&author=:author?&&type=:type?&&s_date=:s_date?&&e_date=:e_date?', PubController.advancedSearch);

PubRouter.get('/category', PubController.getCategory);

//citation router
PubRouter.get('/citation', PubController.citation);

//add router
PubRouter.get('/reference/:id/:id2/save=yes', PubController.getSave);
PubRouter.get('/reference/:id/:id2', PubController.getOne);
PubRouter.get('/', PubController.getAll);

//multipleAdd

//module multer is used to handle multi-part/data file
PubRouter.post('/insert', upload.single('dois'), PubController.insert)
PubRouter.post('/insert_manually', PubController.insert_one)
PubRouter.post('/check', upload.single('dois'), PubController.validation)

module.exports = PubRouter;