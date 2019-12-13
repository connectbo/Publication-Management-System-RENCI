const Publication = require('../models/publication/schema');
const Category = require('../models/category/category')
const fetch = require("node-fetch");
const Cite = require('citation-js');

exports.test = async function (req, res) {
    let example = new Cite('10.1109/tvcg.2013.24')
    try {
        let output = example.format('bibliography', {
            type: 'string'
        })
        res.send(output);
    }
    catch (err) {
        console.log(err);
    }
}

exports.citation = async function (req, res) {
    Publication.find({}, function (err, pub) {
        res.send(pub);
    })
}

exports.validation = async function (req, res) {
    const uploaded = req.body;
    let pre_dois = [];
    for (key in uploaded) {
        pre_dois = key.split(",");
    }
    let dois = [...new Set(pre_dois)];
    let checkStatus = {
        'Fetchable': [],
        'Error': [],
        'Existing': []
    }
    for (let i = 0; i < dois.length; i++) {
        const _DOI = dois[i];
        let fetchResult;
        let fetchJSON;
        let fullnameAuthors = [];
        let example = new Cite(_DOI)
        let output = example.format('bibliography', {
            type: 'string'
        })
        let created_date;
        Publication.find({ DOI: _DOI }, async function (err, pub) {
            if (err) {
                throw err;
            }
            if (pub == undefined || pub == 0) {
                const apiUrl = 'https://api.crossref.org/v1/works/' + _DOI;
                fetchResult = await fetch(apiUrl);
                fetchJSON = await fetchResult.json();
                if ('author' in fetchJSON['message']) {
                    const parsedAuthors = fetchJSON['message']['author'];
                    for (let m = 0; m < parsedAuthors.length; m++) {
                        fullnameAuthors.push(parsedAuthors[m]['given'] + " " + parsedAuthors[m]['family']);
                    }
                }
                else {
                    fullnameAuthors = ['Null']
                }
                if ('date-time' in fetchJSON['message']) {
                    created_date = fetchJSON['message']['date-time'].substring(0, 10)
                }
                else {
                    created_date = null;
                }
                try {
                    let toReturn = {
                        'DOI': _DOI,
                        'Author': fullnameAuthors,
                        'Type': fetchJSON['message']['type'],
                        'Created_date': created_date,
                        'Citation': output
                    }

                    if (fetchResult.status == '200') {
                        checkStatus.Fetchable.push(toReturn);
                        console.log(_DOI + " checked " + (checkStatus.Error.length + checkStatus.Existing.length + checkStatus.Fetchable.length));
                    }
                    if (fetchResult.status == '404') {
                        checkStatus.Error.push(toReturn);
                        console.log(_DOI + " Error " + (checkStatus.Error.length + checkStatus.Existing.length + checkStatus.Fetchable.length));
                    }
                    if ((checkStatus.Error.length + checkStatus.Existing.length + checkStatus.Fetchable.length) == dois.length) {
                        res.send(checkStatus);
                    }
                }
                catch (err) {
                    throw err;
                }
            }
            else {
                checkStatus.Existing.push(_DOI);
                console.log(_DOI + " existed " + (checkStatus.Error.length + checkStatus.Existing.length + checkStatus.Fetchable.length));
                if ((checkStatus.Error.length + checkStatus.Existing.length + checkStatus.Fetchable.length) == dois.length) {
                    res.send(checkStatus);
                }
            }
        })
    }
}

exports.insert = async function (req, Res) {
    const dois = req.body;
    let insertStatus = {
        'Inserted': [],
        'Inserted with missing value': []
    };
    let tem_category = [];
    for (let i = 0; i < dois.length; i++) {
        const _DOI = dois[i];
        console.log("Processing " + _DOI);
        let example = new Cite(_DOI)
        let output = example.format('bibliography', {
            type: 'string'
        })
        console.log("Citation: " + output);
        Publication.find({ DOI: _DOI }, async function (err, pub) {
            if (err) {
                throw err;
            }
            const apiUrl = 'https://api.crossref.org/v1/works/' + _DOI;
            const fetchResult = await fetch(apiUrl);
            const fetchJSONResult = await fetchResult.json();
            const parsedData = fetchJSONResult['message'];
            let fullnameAuthors = [];
            let citation_author = '';
            if (!tem_category.includes(parsedData['type'])) {
                console.log("Pushing.." + parsedData['type'])
                tem_category.push(parsedData['type']);
            }
            try {
                if ('author' in parsedData) {
                    const parsedAuthors = fetchJSONResult['message']['author'];
                    for (let m = 0; m < parsedAuthors.length; m++) {
                        fullnameAuthors.push(parsedAuthors[m]['given'] + " " + parsedAuthors[m]['family']);
                    }
                }
                else {
                    fullnameAuthors = ['Null']
                }
                const saveResult = new Publication({
                    'Title': parsedData['title'], 'Authors': fullnameAuthors, 'DOI': parsedData['DOI'], 'Type': parsedData['type'], 'Created_Date': parsedData['created']['date-time'].substring(0, 10), 'Citation': output
                });
                saveResult.save(function (err) {
                    if (err) throw err;
                });
                insertStatus['Inserted'].push(_DOI)
                console.log("Inserted " + _DOI);
            }
            catch (err) {
                insertStatus['Inserted with missing value'].push(_DOI)
                console.log("Inserted with missing value" + _DOI);
                console.log(err)
            }
            if ((insertStatus['Inserted'].length + insertStatus['Inserted with missing value'].length) == dois.length) {
                for (let a = 0; a < tem_category.length; a++) {
                    Category.find({ Category: tem_category[a] }, function (err, categoryTest) {
                        if (err) {
                            throw err;
                        }
                        console.log(categoryTest);
                        if (categoryTest == undefined || categoryTest.length == 0) {
                            console.log("Adding: " + tem_category[a]);
                            const categoryResult = new Category({
                                'Category': tem_category[a]
                            });
                            categoryResult.save(function (err) {
                                if (err) throw err;
                            })
                        }
                    })
                }
                console.log(insertStatus);
                Res.send(insertStatus);
            }
        })
    }
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


    // communicate more with Matt. Powerful skills 

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