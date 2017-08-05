'use strict'

var fs = require('fs');
var SocketIOFile = require('socket.io-file');
var eatLocation = require('../location');
var user = require('../user');
var path = require('path');

var uploadFiles = {};
var allInfoObj = {};

var callAllinfo = function (callback) {
    let returnAllObj = {};
    eatLocation.getAll(function (err, eatLocs) {
        if (err) {
            console.log(err);
        } else {
            returnAllObj.eatLocations = eatLocs;
            eatLocation.getDailyPointsWithTime(function (err, dPoints) {
                if (err) {
                    return callback(err, null);
                } else {
                    returnAllObj.dailyPoints = dPoints;
                    return callback(null, returnAllObj);
                }
            })
        }
    })
}

// define constructor function that gets `io` send to it
module.exports = {
    start: function (io) {
        io.on('connection', function (socket) {
            console.log('client connected');
            var scriptdir = path.dirname(process.argv[1]);
            var uploader = new SocketIOFile(socket, {
                uploadDir: scriptdir + '/tmp',							// simple directory
                accepts: ['image/png', 'image/jpeg', 'application/pdf'],		// chrome and some of browsers checking mp3 as 'audio/mp3', not 'audio/mpeg'
                maxFileSize: 4194304, 						// 4 MB. default is undefined(no limit)
                chunkSize: 10240,							// default is 10240(1KB)
                transmissionDelay: 0,						// delay of each transmission, higher value saves more cpu resources, lower upload speed. default is 0(no delay)
                overwrite: true 							// overwrite file if exists, default is true.
            });

            uploader.on('start', (fileInfo) => {
                // console.log('Start uploading');
                // console.log(fileInfo);
            });
            uploader.on('stream', (fileInfo) => {
                //console.log(`${fileInfo.wrote} / ${fileInfo.size} byte(s)`);
            });
            uploader.on('complete', (fileInfo) => {
                // console.log('Upload Complete.');
                //sort files
                var mime = fileInfo.mime.split('/');
                var randomNum = (new Date()).valueOf().toString() + Math.random().toString();
                if (mime[1] === 'pdf') {
                    //var fileDest = fs.createWriteStream('./public/upload/docs/' + randomNum + '.pdf');
                    uploadFiles.menu = {
                        'tmp': fileInfo.uploadDir,
                        'path': scriptdir + '/public/upload/docs/' + randomNum + '.pdf'
                    }
                }
                if (mime[1] === 'png') {
                    uploadFiles.logo = {
                        'tmp': fileInfo.uploadDir,
                        'path': scriptdir + '/public/upload/images/' + randomNum + '.png'
                    }
                }
                if (mime[1] === 'jpeg') {
                    uploadFiles.logo = {
                        'tmp': fileInfo.uploadDir,
                        'path': scriptdir + '/public/upload/images/' + randomNum + '.jpeg'
                    }
                }
            });

            uploader.on('error', (err) => {
                console.log('Error!', err);
            });
            uploader.on('abort', (fileInfo) => {
                console.log('Aborted: ', fileInfo);
            });

            socket.on('callAllInfo', function () {
                callAllinfo(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        io.emit('allInfo', result);
                    }
                })
            })

            socket.on('getConfig', function (userObj) {
                eatLocation.getAll(function (err, result) {
                    if (err) {
                        return callback(err, null);
                    } else {
                        io.emit('writeModalConfigs', result);
                    }
                })
            })

            socket.on('saveNewLocation', function (location) {

                eatLocation.saveLocation({ location, uploadFiles }, function (err, result) {
                    if (err) {
                        socket.emit("saveNewLocationStat", err)
                    } else {
                        socket.emit("saveNewLocationStat", result);
                        callAllinfo(function (err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                io.emit('allInfo', result);
                            }
                        })
                    }
                });

            })
            socket.on('abortsaveNewLocation', function (err, result) {
                if (uploadFiles.logo !== undefined) {
                    fs.unlink(uploadFiles.logo.tmp);
                }
                if (uploadFiles.menu !== undefined) {
                    fs.unlink(uploadFiles.menu.tmp);
                }
                uploadFiles = {};
            })

            socket.on('deleteUserFinger', function (uPrint) {
                user.delUserFinger(uPrint, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        io.emit('userFingerDeleted', { uPrint, result });
                    }
                })
            })

            socket.on('setRating', function (ratObj) {
                eatLocation.setRating(ratObj, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        io.emit('ratingSetted', { ratObj, result });
                    }
                })
            })

            socket.on('getLocations', function (err, result) {
                eatLocation.getAll(function (err, allLocs) {
                    if (err) {
                        console.log(err);
                    } else {
                        socket.emit('writeModalConfigs', allLocs);
                    }
                })
            })

            socket.on('getDailyPoints', function (dailyPoints) {
                eatLocation.getDailyPointsWithTime(function (err, dailyLoc) {
                    callAllinfo(function (err, result) {
                        if (err) {
                            console.log(err);
                        } else {
                            io.emit('allInfo', result);
                        }
                    })
                })
            })

            socket.on('deleteDailyPoint', function (dPoint, pointOf) {
                eatLocation.deleteDailyPoint(dPoint, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        callAllinfo(function (err, result) {
                            if (err) {
                                console.log(err);
                            } else {
                                io.emit('allInfo', result);
                                io.emit('dayPointdeleted', { dPoint, pointOf });
                            }
                        })
                    }
                })
            })

            socket.on('deleteLocation', function (locName) {
                eatLocation.deleteLocation(locName, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        eatLocation.getAll(function (err, result) {
                            if (err) {
                                return callback(err, null);
                            }
                            callAllinfo(function (err, result) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    io.emit('allInfo', result);
                                    io.emit("locDeleted", locName);
                                }
                            })
                        })
                    }
                })
            })

            socket.on('saveDailyPoint', function (dailyPoint) {
                eatLocation.saveDailyPoints(dailyPoint, function (err, result) {
                    if (err) {
                        cosole.log(err);
                    } else {
                        eatLocation.getDailyPointsWithTime(function (err, dailyLoc) {
                            callAllinfo(function (err, result) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    io.emit('recieveDailyPoints', {
                                        'allInfo': result,
                                        'dPName': dailyPoint.name + dailyPoint.time
                                    });
                                }
                            })
                        })
                    }
                })
            })

            socket.on('addUser', function (userName) {
                eatLocation.addUser(userName, function (err, state) {
                    if (err) {
                        console.log(err)
                    } else {
                        io.emit('userAdded', { userName, state });
                    }
                })
            })
            socket.on('delUser', function (userInfo) {
                eatLocation.delUser(userInfo, function (err, state) {
                    if (err) {
                        console.log(err);
                    } else {
                        io.emit('userDeleted', { userInfo, state });
                    }
                })
            })

            socket.on('checkFingerPrint', function (fingerPrint) {
                user.findPrint(fingerPrint, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (result.length <= 0) {
                            socket.emit('userNotExist', fingerPrint);
                        } else {
                            socket.emit('userNameIs', result[0]);
                        }
                    }
                })
            })

            socket.on('saveUser', function (userObj) {
                user.saveUser(userObj, function (err, state) {
                    if (err) {
                        console.log(err);
                    } else {
                        socket.emit('userNameIs', state);
                    }
                })
            })

            socket.on('saveComment', function (commObj) {
                eatLocation.addComment(commObj, function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {
                        io.emit('commentAdded', commObj);
                    }
                })
            })
        });
    }
}