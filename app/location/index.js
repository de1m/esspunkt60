'use strict'

var jimp = require('jimp');
var eatPoint = require('../models/eatPoint');
var dailyPoint = require('../models/eatDay');
var user = require('../user');
var fs = require('fs');

function saveLocation(infoArr, callback) {

    var locInfo = infoArr.location;
    var tempInfo = infoArr.uploadFiles;

    var mongoObj = {
        name: '',
        beste: '',
        img: {
            name: '',
            uploaded: '',
            path: ''
        },
        tar: [],
        doc: {
            name: '',
            uploaded: '',
            path: ''
        },
        addrr: {
            str: '',
            plz: '',
            tel: '',
            ort: '',
            mapurl: '',
            menulink: ''
        },
        rating: {
            value: '',
            rated: ''
        }
    };
    if (locInfo.img.uploaded) {

        let fileSource = fs.createReadStream(tempInfo.logo.tmp);
        let fileTarget = fs.createWriteStream(tempInfo.logo.path);
        fileSource.pipe(fileTarget);

        mongoObj.img.name = locInfo.img.name;
        mongoObj.img.uploaded = true;
        mongoObj.img.path = tempInfo.logo.path

        let filePathSplit = tempInfo.logo.path.split('/');
        let lengArr = filePathSplit.length;
        mongoObj.img.path = '/' + filePathSplit[lengArr - 3] + '/' + filePathSplit[lengArr - 2] + '/' + filePathSplit[lengArr - 1]


    } else {
        mongoObj.img.uploaded = false;
    }

    if (locInfo.doc.uploaded) {
        let fileSource = fs.createReadStream(tempInfo.menu.tmp);
        let fileTarget = fs.createWriteStream(tempInfo.menu.path);
        fileSource.pipe(fileTarget);

        fs.unlink(tempInfo.menu.tmp);

        mongoObj.doc.name = locInfo.doc.name;
        mongoObj.doc.uploaded = true;

        let docPathSplit = tempInfo.menu.path.split('/');
        let dlengArr = docPathSplit.length;
        mongoObj.doc.path = '/' + docPathSplit[dlengArr - 3] + '/' + docPathSplit[dlengArr - 2] + '/' + docPathSplit[dlengArr - 1]

    } else {
        mongoObj.doc.uploaded = false;
    }

    mongoObj.name = locInfo.name;
    mongoObj.addrr = locInfo.addrr;
    mongoObj.tag = locInfo.tag;

    mongoObj.beste = locInfo.beste;

    var resize = function () {
        //console.log("++++++", isEmptyObject(tempInfo));
        if (!isEmptyObject(tempInfo)) {
            fs.unlink(tempInfo.logo.tmp, function (err) {
                if (err) {
                    console.error(err);
                } else {
                    //resize image
                    jimp.read(tempInfo.logo.path, function (err, image) {
                        // do stuff with the image (if no exception)
                        image.scaleToFit(128, 128)
                            .write(tempInfo.logo.path);
                    });
                }
            });
        }
    }
    //save to db
    eatPoint.create(mongoObj, function (err, result) {
        if (err) {
            if (err.duplicate === true) {
                if (locInfo.img.uploaded) {
                    fs.unlink(tempInfo.logo.path);
                }
                if (locInfo.doc.uploaded) {
                    fs.unlink(tempInfo.menu.path);
                }
                return callback(null, { 'status': 'duplicate', 'output': result });
            } else {
                return callback(err, null);
            }
        } else {
            if (locInfo.img.uploaded) {
                resize();
            }
            return callback(null, { 'status': true, 'output': result });
        }
    })

}

function getAll(callback) {
    eatPoint.findAll(function (err, allLoc) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, allLoc);
        }
    })
}

function getSelected(filter, callback) {
    eatPoint.findSelected(filter, function (err, result) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}

function saveDailyPoints(dPoint, callback) {
    var date = new Date();
    eatPoint.findNamed(dPoint.name, function (err, locObj) {
        if (err) {
            return callback(err, null);
        } else {
            dailyPoint.create({
                'name': dPoint.name + dPoint.time,
                'created_on': date,
                'location': {
                    'point': dPoint.name,
                    'time': dPoint.time,
                    'beste': locObj[0].beste
                }
            }, function (err, result) {
                if (err) {
                    if (err.duplicate === true) {
                        return callback(null, { 'status': 'duplicate', 'output': result });
                    } else {
                        return callback(err, null);
                    }
                } else {
                    return callback(null, { 'status': true, 'output': result });
                }
            })
        }
    })
}

function getDailyLocations(callback) {
    dailyPoint.findToday(function (err, allLoc) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, allLoc);
        }
    })
}

function getDailyPoints(callback) {
    getDailyLocations(function (err, result) {
        if (result.length > 0) {
            var dLocations = [];
            for (var obj in result) {
                dLocations.push(result[obj].location.point);
            }
        }

        eatPoint.findSelected(dLocations, function (err, selectedDayPoints) {
            if (err) {
                return callback(err, null);
            } else {
                return callback(null, selectedDayPoints);
            }
        })
    })
}

function deleteDailyPoint(dailyP, callback) {
    dailyPoint.deleteOne(dailyP, function (err, result) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}

function getDailyPointsWithTime(callback) {
    dailyPoint.getMergeWithTime(function (err, eatPointmerged) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, eatPointmerged)
        }
    })
}

function deleteLocation(locName, callback) {
    eatPoint.deleteLocation(locName, function (err, result) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, err);
        }
    })
}

function getUser(fingerPrint, callback) {
    user.findPrint(fingerPrint, function (err, result) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}

function addUser(userName, callback) {
    dailyPoint.addUser(userName, function (err, userResult) {
        if (err) {
            return callback(err, null);
        } else {
            var usersArr = userResult.members;
            var userPushArr = [];
            for (var i = 0; i < usersArr.length; i++) {
                if (usersArr[i].user == userName.user) {
                    userPushArr.push(usersArr[i]);
                }
            }
            return callback(null, { userarr: userPushArr, number: usersArr.length });
        }
    })
}

function delUser(userInfo, callback) {
    dailyPoint.delUser(userInfo, function (err, userResult) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, userResult);
        }
    })
}

function setRating(ratObj, callback) {
    dailyPoint.findNameLoc(ratObj.point, function (err, pointsArr) {
        if (err) {
            return callback(err, null);
        } else {
            var locName = pointsArr[0].location.point;
            eatPoint.findNamed(locName, function (err, locFound) {
                if (err) {
                    return callback(err, null);
                } else {
                    var ratingAct = parseInt(ratObj.rating, 10);
                    var ratFromDB = locFound[0].rating.value;
                    var ratNumFromDB = locFound[0].rating.rated
                    if (ratFromDB == null) {
                        var rating = 0;
                    } else {
                        var rating = parseInt(locFound[0].rating.value, 10);
                    }
                    if (ratNumFromDB == null) {
                        var ratNum = 0;
                    } else {
                        var ratNum = parseInt(locFound[0].rating.rated, 10);
                    }

                    var sumPoint = parseInt((rating * ratNum), 10);
                    sumPoint = sumPoint + ratingAct;
                    ratNum++;
                    sumPoint = Math.round(sumPoint / ratNum);

                    var ratingObj = {
                        'value': sumPoint,
                        'rated': ratNum
                    }
                    user.updateRatedLoc(locName, ratObj.user, function (err, ratingSet) {
                        if (err) {
                            return callback(err, null)
                        } else {
                            if (ratingSet.state) {
                                ratingObj.name = locName;
                                eatPoint.updateRating(ratingObj, function (err, ratingStat) {
                                    if (err) {
                                        return callback(err, null);
                                    } else {
                                        return callback(null, ratingStat);
                                    }
                                })
                            } else {
                                return callback(null, ratingSet);
                            }
                        }
                    })
                }
            })
        }
    })
}

function isEmptyObject(obj) {
    for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return false;
        }
    }
    return true;
}

function addComment(commObj, callback){
    dailyPoint.addComment(commObj, function(err,  result){
        if(err){
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}

module.exports = {
    saveLocation,
    getAll,
    saveDailyPoints,
    getDailyPoints,
    getDailyPointsWithTime,
    getUser,
    addUser,
    delUser,
    deleteDailyPoint,
    deleteLocation,
    setRating,
    addComment
}
