'use strict';

var eatPoint = require('../database').models.eatPoint;
var eatDays = require('../models/eatDay');
var fs = require('fs');
var path = require('path');

var create = function (data, callback) {
    var neweatPoint = new eatPoint(data);
    eatPoint.find({ 'name': data.name }, function (err, result) {
        if (result.length <= 0) {
            neweatPoint.save(callback);
        } else {
            return callback({ 'duplicate': true }, null);
        }
    })
}

var findAll = function (callback) {
    eatPoint.find({}, function (err, founds) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, founds);
        }
    })
}

var findSelected = function (filter, callback) {
    eatPoint.find({ name: { $in: filter } }, function (err, result) {
        if (err) {
            return callback(err, null);
        } else {
            //console.log(result);
            return callback(null, result);
        }
    })
}

var findNamed = function (locName, callback) {
    eatPoint.find({ 'name': locName }, function (err, result) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}

var deleteLocation = function (locName, callback) {
    findNamed(locName, function(err, result){
        var scriptdir = path.dirname(process.argv[1]);
        if(err){
            return callback(err, null);
        } else {
            var docpath = {
                'path': result[0].doc.path,
                'stat': result[0].doc.uploaded
            }
            var imgpath = {
                'path': result[0].img.path,
                'stat': result[0].img.uploaded
            }
            if(docpath.stat === true){
                //exist
                fs.unlink(scriptdir + "/public" + docpath.path, function(err, result){
                    if(err){
                        console.log(err);
                    }
                });
            }
            if(imgpath.stat === true){
                //exist
                fs.unlink(scriptdir + "/public" + imgpath.path, function(err, result){
                    if(err){
                        console.log(err);
                    }
                });
            }
        }
    })
    eatPoint.remove({ 'name': locName }, function (err, result) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}

var getMergeWithTime = function (callback) {
    eatPoint.aggregate([{
        $lookup: {
            from: 'days',
            localField: 'name',
            foreignField: 'location.point',
            as: "dayli"
        }
    }, {
        $match: {
            'dayli.location.time': { $exists: true }
        }
    }], function (err, result) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}

var updateRating = function (ratingObj, callback) {
    // var ratingObj = {
    //     'name': ,
    //     'value': ,
    //     'rated':
    // }
    console.log(ratingObj);
    eatPoint.update( {'name': ratingObj.name},{$set: {'rating.value': ratingObj.value, 'rating.rated': ratingObj.rated } }, function(err, updateResult){
        if(err){
            return callback(err, null);
        } else {
            return (null, updateResult);
        }
    })

}

module.exports = {
    create,
    findAll,
    findSelected,
    findNamed,
    deleteLocation,
    updateRating
};
