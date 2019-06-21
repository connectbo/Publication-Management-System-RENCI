const express = require('express');
const mongoose = require('mongoose');
const request = require('request');
const connectDB = require('./config/db');
const app = express();
const cors = require('cors');


const router = express.Router();

connectDB();

const publication_schema = mongoose.Schema({ Title: Array, Authors: Array, DOI: String, Type: String });
const publication_model = mongoose.model('Publication', publication_schema)

router.get('/reference/:id/:id2/save=yes', function (req, Res, next) {
    
})

router.get('/reference/:id/:id2', function (req, Res, next) {
    const _DOI = req.params.id + "/" + req.params.id2;

    publication_model.findOne({ DOI: _DOI }, function (err, publication) {

        if (publication !== null) {
            var pub = JSON.parse(JSON.stringify(publication));
            pub["status"] = 'Found 1 matching result from RENCI Database';
            Res.send(pub);
        }
        else {
            const apiUrl = 'https://api.crossref.org/v1/works/' + _DOI; // title DOI authors type citation
            request.get(apiUrl, function (error, res, body) {
                const parsedData = JSON.parse(body)['message'];
                const parsedAuthors = JSON.parse(body)['message']['author'];
                const fullnameAuthors = [];
                for (i = 0; i < parsedAuthors.length; i++) {
                    fullnameAuthors.push(parsedAuthors[i]['given'] + " " + parsedAuthors[i]['family']);
                }
                let result = {
                    Title: parsedData['title'], Authors: fullnameAuthors, DOI: parsedData['DOI'], Type: parsedData['type']
                };
                result['status'] = 'Found 1 matching result from Crossref API';
                result['save'] = '0';
                Res.send(result);

                // const newData = new publication_model({ Title: parsedData['title'], Authors: fullnameAuthors, DOI: parsedData['DOI'], Type: parsedData['type'] })
                // newData.save(function (err) {
                //     if (err) {
                //         throw err;
                //     }
                //     else {
                //         console.log('Publications added to MongoDB!');
                //         Res.send(newData);
                //     }
                // });
            })
        }
    });

});

router.get('/', function (req, res, next) {
    res.send("Express API has been connected!");
})

app.use(cors());

app.use('/', router);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${ PORT }!`));