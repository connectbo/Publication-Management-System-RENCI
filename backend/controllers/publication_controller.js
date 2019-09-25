const Publication = require('../models/publication/schema');
const Category = require('../models/category/category')
const fetch = require("node-fetch");
const fs = require('fs');
const readline = require('readline');

exports.test = async function (req, res) {
    console.log("Testing Starts...");
    for (let i = 0; i < 2; i++) {
        console.log("Start Processing " + i);
        const result = await fetch('https://api.crossref.org/v1/works/10.1016/j.envsoft.2017.12.008');
        const resultJSON = await result.json();
        console.log("Fetch result...");
        console.log(resultJSON['message']);
    }
    console.log("Testing Ends..")
}

exports.insert = async function (req, Res) {
    console.log("Insert Visited!")
    const toInsert = req.body;
    console.log(toInsert);
    const response = await fetchInsert(toInsert);
    console.log("Printing Results: ");
    console.log(response);
    Res.send(response);
}

exports.getCategory = function (req, res) {
    Category.find({}, function (err, allCategory) {
        if (err) {
            throw err;
        }
        res.send(allCategory);
    })
}

exports.advancedSearch = function (req, res) {
    _title = req.params.title;
    _author = req.params.author;
    _type = req.params.type;
    _sdate = req.params.s_date;
    _edate = req.params.e_date;

    if (_author === undefined) {
        _author = '';
    }
    if (_title === undefined) {
        _title = '';
    }
    if (_type === undefined) {
        _type = '';
    }
    if (_sdate === undefined) {
        _sdate = '1995-12-08';
    }
    if (_edate === undefined) {
        tem_edate = new Date();
        tem_edate = tem_edate.toISOString();
        _edate = tem_edate.substring(0, 10);
    }

    Publication.find()
        .and([
            { Title: { $regex: _title, $options: 'i' } },
            { Authors: { $regex: _author, $options: 'i' } },
            { $or: generateTypeFinder(_type) },
            {
                Created_Date: {
                    '$gte': _sdate,
                    '$lte': _edate
                }
            }
        ])
        .exec(
            function (err, pubs) {
                if (err) {
                    console.log(err);
                    throw (err);
                } res.send(pubs);
            })

    function generateTypeFinder(TypeString) {
        let TypeFinder = [];
        for (let i = 0; i < TypeString.length; i++) {
            switch (TypeString.substring(i, i + 1)) {
                case 'b':
                    TypeFinder.push({ Type: 'book-chapter' });
                    break;
                case 'j':
                    TypeFinder.push({ Type: 'journal-article' });
                    break;
                case 'p':
                    TypeFinder.push({ Type: 'proceedings-article' });
                    break;
            }
        }
        return TypeFinder;
    }
}

exports.getAll = function (req, res) {
    let toSend = {};
    return Publication.countDocuments(function (err, counts) {
        if (err) {
            console.log(err);
        }
        toSend.status = counts;
    }).find({}, function (err, pubs) {
        if (err) {
            throw (err);
        }
        toSend.content = pubs;
        res.send(toSend);
    });
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
                    Title: parsedData['title'], Authors: fullnameAuthors, DOI: parsedData['DOI'], Type: parsedData['type'], Created_Date: parsedData['created']['date-time'].substring(0, 10)
                };
                result['status'] = 'Found 1 matching result from Crossref API';
                Res.send(result);
            })
        }
    });
}

exports.getSave = async function (req, Res) {
    const _DOI = req.params.id + "/" + req.params.id2;
    const apiUrl = 'https://api.crossref.org/v1/works/' + _DOI;
    await request.get(apiUrl, function (error, res, body) {
        const parsedData = JSON.parse(body)['message'];
        const parsedAuthors = JSON.parse(body)['message']['author'];
        const fullnameAuthors = [];
        for (i = 0; i < parsedAuthors.length; i++) {
            fullnameAuthors.push(parsedAuthors[i]['given'] + " " + parsedAuthors[i]['family']);
        }
        Publication.find({ Title: parsedData['title'] }, async function (err, findPub) {
            if (err) {
                throw err;
            }
            if (findPub === undefined || findPub == 0) {
                await Category.find({ Category: parsedData['type'] }, function (err, categoryTest) {
                    if (err) {
                        throw err;
                    }
                    if (categoryTest === undefined || categoryTest.length == 0) {
                        console.log("No Found!");
                        const categoryResult = new Category({
                            'Category': parsedData['type']
                        });
                        categoryResult.save(function (err) {
                            if (err) throw err;
                        })
                    }
                })
                const saveResult = new Publication({
                    'Title': parsedData['title'], 'Authors': fullnameAuthors, 'DOI': parsedData['DOI'], 'Type': parsedData['type'], Created_Date: parsedData['created']['date-time'].substring(0, 10)
                });

                saveResult.save(function (err) {
                    if (err) throw err;
                });
                const insertDBResult = {
                    'Title': parsedData['title'], 'Authors': fullnameAuthors, 'DOI': parsedData['DOI'], 'Type': parsedData['type'], 'status': "Stored in RENCI Database", 'Created_Date': parsedData['created']['date-time'].substring(0, 10)
                }
                Res.send(insertDBResult);
            }
            else {
                const insertDBResult = {
                    'Title': parsedData['title'], 'Authors': fullnameAuthors, 'DOI': parsedData['DOI'], 'Type': parsedData['type'], 'status': "Found in RENCI Database", 'Created_Date': parsedData['created']['date-time'].substring(0, 10)
                }
                Res.send(insertDBResult);
            }
        })
    });
}