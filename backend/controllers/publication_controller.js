const Publication = require('../models/publication/schema');
const Category = require('../models/category/category')
const Admin = require('../models/admin/admin')
const fetch = require("node-fetch");
const Cite = require('citation-js');
const fs = require('fs');


exports.citation = async function (req, res) {
    Publication.find({}, function (err, pub) {
        res.send(pub);
    })
}

exports.commsLogin = async function (req, res) {
    let username = req.query.Username;
    let password = req.query.Password;
    Admin.find({ Username: username, Password: password }, async function (err, auth) {
        if (auth == undefined || auth == 0) { res.send({ 'message': "Failure" }) }
        else {
            res.send({ 'message': "Success" });
        }
    })
    // Admin.find()
}



exports.fileCheck = async function (req, res) {
    fs.readFile(req.file.path, 'utf-8', function (err, data) {
        let dois = data.split('\n');
        let checkStatus = {
            'Fetchable': [],
            'Error': [],
            'Existing': []
        }
        for (let i = 0; i < dois.length; i++) {
            let _DOI = dois[i];
            console.log("Processing " + _DOI);

            Publication.find({ DOI: _DOI }, async function (err, pub) {
                if (err) {
                    throw err;
                }
                if (pub == undefined || pub == 0) {
                    try {
                        let example = new Cite(_DOI)
                        let output = example.format('bibliography', {
                            type: 'string'
                        })
                        let _title = example['data'][0]['title'];
                        let _type = example['data'][0]['type'];
                        let _created;
                        if ('created' in example['data'][0]) {
                            if ('date-time' in example['data'][0]['created']) {
                                _created = example['data'][0]['created']['date-time'].substring(0, 10);
                            }
                            let lastnameIdx = output.indexOf("(");
                            let _author = output.substring(0, lastnameIdx - 1);
                            let toReturn = {
                                'DOI': _DOI,
                                'Title': _title,
                                'Type': _type,
                                'Author': _author,
                                'Created': _created,
                                'Citation': output,
                                'Checked': true
                            };
                            checkStatus.Fetchable.push(toReturn);
                            if ((checkStatus.Error.length + checkStatus.Existing.length + checkStatus.Fetchable.length) == dois.length) {
                                res.send(checkStatus);
                            }
                        }
                        else {
                            let toReturn = {
                                "DOI": _DOI,
                                "Error": 'Please contact comms@renci.org to add this publication.'
                            }
                            checkStatus.Error.push(toReturn);
                            if ((checkStatus.Error.length + checkStatus.Existing.length + checkStatus.Fetchable.length) == dois.length) {
                                console.log(checkStatus);
                                res.send(checkStatus);
                            }
                        }
                    }
                    catch (err) {
                        let toReturn = {
                            "DOI": _DOI,
                            "Error": 'Please contact comms@renci.org to add this publication.'
                        }
                        checkStatus.Error.push(toReturn);
                        console.log(_DOI + " Error " + (checkStatus.Error.length + checkStatus.Existing.length + checkStatus.Fetchable.length));
                        if ((checkStatus.Error.length + checkStatus.Existing.length + checkStatus.Fetchable.length) == dois.length) {
                            res.send(checkStatus);
                        }
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
    })
}


exports.check = async function (req, res) {
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
    if (dois.length == 0) res.send(checkStatus);
    for (let i = 0; i < dois.length; i++) {
        let _DOI = dois[i];
        console.log("Processing " + _DOI);

        Publication.find({ DOI: _DOI }, async function (err, pub) {
            if (err) {
                throw err;
            }
            if (pub == undefined || pub == 0) {
                try {
                    let example = new Cite(_DOI)
                    let output = example.format('bibliography', {
                        type: 'string'
                    })
                    let _title = example['data'][0]['title'];
                    let _type = example['data'][0]['type'];
                    let _created;
                    if ('created' in example['data'][0]) {
                        if ('date-time' in example['data'][0]['created']) {
                            _created = example['data'][0]['created']['date-time'].substring(0, 10);
                        }
                        let lastnameIdx = output.indexOf("(");
                        let _author = output.substring(0, lastnameIdx - 1);
                        let toReturn = {
                            'DOI': _DOI,
                            'Title': _title,
                            'Type': _type,
                            'Author': _author,
                            'Created': _created,
                            'Citation': output,
                            'Checked': true
                        };
                        checkStatus.Fetchable.push(toReturn);
                        if ((checkStatus.Error.length + checkStatus.Existing.length + checkStatus.Fetchable.length) == dois.length) {
                            res.send(checkStatus);
                        }
                    }
                    else {
                        let toReturn = {
                            "DOI": _DOI,
                            "Error": 'Please contact comms@renci.org to add this publication.'
                        }
                        checkStatus.Error.push(toReturn);
                        if ((checkStatus.Error.length + checkStatus.Existing.length + checkStatus.Fetchable.length) == dois.length) {
                            console.log(checkStatus);
                            res.send(checkStatus);
                        }
                    }
                }
                catch (err) {
                    console.log(err);
                    let toReturn = {
                        "DOI": _DOI,
                        "Error": 'Please contact comms@renci.org to add this publication.'
                    }
                    checkStatus.Error.push(toReturn);
                    console.log(_DOI + " Error " + (checkStatus.Error.length + checkStatus.Existing.length + checkStatus.Fetchable.length));
                    if ((checkStatus.Error.length + checkStatus.Existing.length + checkStatus.Fetchable.length) == dois.length) {
                        res.send(checkStatus);
                    }
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
        console.log(_DOI);
        Publication.find({ DOI: _DOI }, async function (err, pub) {
            if (err) {
                throw err;
            }
            console.log(pub);
            if (pub == undefined || pub == 0) {
                try {
                    let fetchResult;
                    let fetchJSON;
                    let fullnameAuthors = [];
                    let example = new Cite(_DOI)
                    let output = example.format('bibliography', {
                        type: 'string'
                    })
                    let created_date;
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
                    if ((checkStatus.Error.length + checkStatus.Existing.length + checkStatus.Fetchable.length) == dois.length) {
                        res.send(checkStatus);
                    }
                }
                catch (err) {
                    if (fetchResult['status'] == '404') {
                        checkStatus.Error.push(_DOI);
                        console.log(_DOI + " Error " + (checkStatus.Error.length + checkStatus.Existing.length + checkStatus.Fetchable.length));
                    }
                    if ((checkStatus.Error.length + checkStatus.Existing.length + checkStatus.Fetchable.length) == dois.length) {
                        res.send(checkStatus);
                    }
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

exports.insert_one = async function (req, res) {
    const _info = req.body;
    console.log(_info['status'])
    Category.find({ Category: _info['type'] }, function (err, categoryTest) {
        if (categoryTest == undefined || categoryTest == 0) {
            const newCategory = new Category({ 'Category': _info['type'] });
            newCategory.save(function (err) {
                if (err) throw err;
            })
        }
    })
    const saveResult = new Publication({
        'Title': _info['title'], 'Authors': _info['author'], 'DOI': _info['doi'], 'Type': _info['type'], 'Created_Date': _info['date'], 'Status': _info['status']
    });
    saveResult.save(function (err) {
        if (err) throw err;
    })
    res.send({ "message": 'Your Publication is added to RENCI Database!' });
}


exports.insert = async function (req, Res) {
    const info = req.body;
    let insertStatus = {
        'Inserted': [],
        'Failed': []
    };
    let tem_category = [];
    for (let i = 0; i < info.length; i++) {
        const _info = info[i];
        const saveResult = new Publication({
            'Title': _info['Title'], 'Authors': _info['Author'], 'DOI': _info['DOI'], 'Type': _info['Type'], 'Created_Date': _info['Created'], 'Citation': _info['Citation'], 'Status': 'published'
        });
        if (!tem_category.includes(_info['Type'])) {
            tem_category.push(_info['Type']);
            console.log(_info['Type'] + _info['DOI'])
        }
        try {
            await saveResult.save(function (err) {
                if (err) throw err;
            });
            insertStatus['Inserted'].push(_info['DOI'])
            console.log("Inserted " + _info['DOI']);
        }
        catch (err) {
            insertStatus['Failed'].push(_info['DOI'])
            console.log("Failed" + _info['DOI']);
            console.log(err)
        }
        if ((insertStatus['Inserted'].length + insertStatus['Failed'].length) == info.length) {
            for (let a = 0; a < tem_category.length; a++) {
                Category.find({ Category: tem_category[a] }, function (err, categoryTest) {
                    if (err) {
                        throw err;
                    }
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
    }
}

exports.getCategory = function (req, res) {
    console.log("Visit getCategory")
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
    _sdate = req.params.s_date;
    _edate = req.params.e_date;

    let _status = [];
    let StatusJSON = JSON.parse(req.params.status);
    for (let key in StatusJSON) {
        if (StatusJSON[key] === true) {
            _status.push({ Status: `${key}` });
        }
    }

    if (_status.length === 0) {
        console.log(_status)
        _status = {
            Status: 'none'
        }
    }


    let _type = [];
    let TypeJSON = JSON.parse(req.params.type);
    for (let key in TypeJSON) {
        if (TypeJSON[key] === true) {
            _type.push({ Type: `${key}` });
        }
    }
    if (_type == []) {
        console.log(_type)
        _type = {
            Type: 'none'
        }
    }
    if (_author === undefined) {
        _author = '';
    }
    if (_title === undefined) {
        _title = '';
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
            { $or: _type },
            { $or: _status },
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
                }
                if (pubs == []) res.send()
                else res.send(pubs);
            })
}

exports.getAll = function (req, res) {
    let toSend = {};
    Publication.find({}, function (err, result) {
        console.log(result);
    });
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