'use strict';

var eatDay = require('../database').models.eatDay;

var create = function (data, callback) {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var neweatDay = new eatDay(data);
    eatDay.find({ 'name': data.name, created_on: now }, function (err, points) {
        if (points.length <= 0) {
            neweatDay.save(callback);
        } else {
            return callback({ 'duplicate': true }, null);
        }
    })
}

var getMergeWithTime = function (callback) {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    eatDay.aggregate({
        $lookup: {
            from: 'points',
            localField: 'location.point',
            foreignField: 'name',
            as: 'points'
        }
    }, { $match: { created_on: { $gte: startOfToday } } }, function (err, result) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, result);
        }
    })
}

var findToday = function (callback) {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    eatDay.find({ created_on: { $gte: startOfToday } }, function (err, founds) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, founds);
        }
    })
}

var findNameLoc = function (loc, callback) {
    var now = new Date();
    var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    eatDay.find({ 'name': loc, created_on: { $gte: startOfToday } }, function (err, founds) {
        if (err) {
            return callback(err, null);
        } else {
            return callback(null, founds);
        }
    })
}

var addUser = function (userName, callback) {
    findNameLoc(userName.name, function (err, result) {
        if (err) {
            return callback(err, null);
        } else {
            var members = [];
            var memberObj = {
                'user': userName.user,
                'beste': userName.beste
            }
            members = result[0].members;
            var picked = members.find(o => o.user === userName.user);
            if (picked == undefined) {
                var now = new Date();
                var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                members.push(memberObj);
                eatDay.update({ 'name': userName.name, created_on: { $gte: startOfToday } }, { $set: { 'members': members } }, function (err, state) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, { state, members });
                    }
                })
            }
        }
    })
}

var addDriver = function(userName, callback){
    findNameLoc(userName.loc, function(err, result){
        if(err){
            return callback(err, null);
        } else {
            var members = [];
            members = result[0].members;
            var picked = members.find(o => o.user === userName.user);
            if(picked != undefined){
                var now = new Date();
                var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                picked.driver = true;
                var index = members.indexOf(picked);
                members.splice(index,1);
                members.push(picked);
                
                eatDay.update({ 'name': userName.loc, created_on: { $gte: startOfToday } }, { $set: { 'members': members } }, function (err, state) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        var retObj= {
                            'member': picked,
                            'loc': userName.loc
                        }
                        return callback(null, retObj);
                    }
                })

            }
        }
    })
}

var delUser = function (userName, callback) {
    findNameLoc(userName.loc, function (err, result) {
        if (err) {
            return callback(err, null);
        } else {
            var members = result[0].members;
            var picked = members.find(o => o.user === userName.user);
            var now = new Date();
            var startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            if (picked != undefined) {
                var index = members.indexOf(picked);
                members.splice(index, 1);
                eatDay.update({ 'name': userName.loc,created_on: { $gte: startOfToday } }, { $set: { 'members': members } }, function (err, state) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, { state, members });
                    }
                })
            }
        }
    })
}

var deleteOne = function (dailyPoint, callback) {
    findNameLoc(dailyPoint, function (err, result) {
        if (err) {
            return callback(err, null);
        } else {
            if (result.length > 0) {
                eatDay.remove({ 'name': dailyPoint }, function (err, result) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        return callback(null, result);
                    }
                })
            }
        }
    })
}

var addComment = function (commObj, callback) {
    findNameLoc(commObj.dPoint, function (err, result) {
        if (err) {
            return callback(err, null);
        } else {
            var commentArr = result[0].comments;
            var commentar = {
                'user': commObj.user,
                'commentar': commObj.comment,
                'time': commObj.time
            }
            commentArr.push(commentar);
            eatDay.update({ 'name': commObj.dPoint }, { $set: { 'comments': commentArr } }, function (err, state) {
                if (err) {
                    return callback(err, null);
                } else {
                    return callback(null, state);
                }
            })

        }
    })
}

Array.prototype.contains = function (k, callback) {
    var self = this;
    return (function check(i) {
        if (i >= self.length) {
            return callback(false);
        }

        if (self[i] === k) {
            return callback(true);
        }

        return process.nextTick(check.bind(null, i + 1));
    }(0));
}



module.exports = {
    create,
    findToday,
    findNameLoc,
    getMergeWithTime,
    addUser,
    addDriver,
    delUser,
    deleteOne,
    addComment
};
