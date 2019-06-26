const Publication = require('../models/publication/schema');
const request = require('request');

let newData;

exports.getAll = function (req, res) {
    return Publication.find({}, function (err, pubs) {
        if (err) {
            console.log(err);
            throw (err);
        }
        res.send(pubs);
    })
}

exports.getOne = function (req, Res) {
    const _DOI = req.params.id + "/" + req.params.id2;
    Publication.findOne({ DOI: _DOI }, function (err, publication) {
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
                newData = new Publication({ Title: parsedData['title'], Authors: fullnameAuthors, DOI: parsedData['DOI'], Type: parsedData['type'] })
            })
        }
    });
}

exports.getSave = function (req, Res){
    const _DOI = req.params.id + "/" + req.params.id2;
    const apiUrl = 'https://api.crossref.org/v1/works/' + _DOI;
    request.get(apiUrl, function (error, res, body) {
        const parsedData = JSON.parse(body)['message'];
        const parsedAuthors = JSON.parse(body)['message']['author'];
        const fullnameAuthors = [];
        for (i = 0; i < parsedAuthors.length; i++) {
            fullnameAuthors.push(parsedAuthors[i]['given'] + " " + parsedAuthors[i]['family']);
        }
        const saveResult = new Publication({
            'Title': parsedData['title'], 'Authors': fullnameAuthors, 'DOI': parsedData['DOI'], 'Type': parsedData['type'] 
        });
        saveResult.save(function (err){
            if (err) throw err;
        });
        const renderResult = {
            'Title': parsedData['title'], 'Authors': fullnameAuthors, 'DOI': parsedData['DOI'], 'Type': parsedData['type'], 'status' : "Stored in RENCI Database"
        }
        Res.send(renderResult);
    });
}

exports.sortbyType = function (req, res){
    const _TYPE = req.params.type;  
    Publication.find({ Type: _TYPE }, function (err, publication){
        if(err){
            console.log(err);
            throw err;
        }
        else{
            res.send(publication);
        }
    });
}