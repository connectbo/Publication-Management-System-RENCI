const PubController = require('../controllers/publication_controller');
const express = require('express');
const PubRouter = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// passport.use(new GoogleStrategy({
//     clientID:'998739880330-h14pcufmrjt863dbrof672tqttcub1be.apps.googleusercontent.com',
//     clientSecret:'gMLQ_hxrw4NwDK6gKz7926yp',
//     callbackURL: "http://localhost:5000/auth/google/callback"
//     },
//     function(accessToken, refreshToken, profile, done){
//         User.findOrCreate({ googleId: profile.id }, function(err, user){
//             return done(err, user);
//         });
//     }
// ));

// PubRouter.get('/auth/google',
//   passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

// PubRouter.get('/auth/google/callback', 
//     passport.authenticate('google', { failureRedirect :'/login'}),
//     function(req, res){
//         console.log(req);
//         res.redirect('/');
// });

//search router  
PubRouter.get('/search/title=:title?&&author=:author?&&type=:type?&&s_date=:s_date?&&e_date=:e_date?&&status=:status?', PubController.advancedSearch);

PubRouter.get('/category', PubController.getCategory);

//citation router
PubRouter.get('/citation', PubController.citation);

//add router
PubRouter.get('/reference/:id/:id2/save=yes', PubController.getSave);
PubRouter.get('/reference/:id/:id2', PubController.getOne);
PubRouter.get('/', PubController.getAll);

PubRouter.post('/commsLogin', PubController.commsLogin);

//module multer is used to handle multi-part/data file
PubRouter.post('/insert', upload.single('dois'), PubController.insert)
PubRouter.post('/insert_manually', PubController.insert_one)

//validation
PubRouter.post('/check', upload.single('dois'), PubController.check)
PubRouter.post('/fileCheck', upload.single('myDOI'), PubController.fileCheck)

module.exports = PubRouter;