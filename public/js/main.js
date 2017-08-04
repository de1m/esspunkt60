'use strict';

var socket = io.connect('http://localhost:5000');
var uploader = new SocketIOFileClient(socket);

var uploadInformation = {
    'menu': {
        'name': 'none',
        'uploaded': false
    },
    'logo': {
        'name': 'none',
        'uploaded': false
    }
};

var userObject = { 'name': '', 'finger': '' };
var count = 0;
var selectedDailyPoint = '';

$(document).ready(function () {

    $(document).on('click', '.eatNameAddPoint li a', function () {
        var selectedLocation = ($(this).text());
        var colPar = document.getElementById('LocObjAddPoint').parentElement;
        colPar.style.fontSize = "1.5em";
        colPar.style.color = '#4cae4c';

        $(colPar).empty();

        var tet = document.createElement('p').appendChild(document.createTextNode($(this).text()))
        colPar.appendChild(tet);
        colPar.id = "LocObjAddPoint"
        selectedDailyPoint = $(this).text();
    })

    $(document).on('click', '.eatNameDelPoint', function () {
        var selectedLocation = ($(this).text());
        var colPar = document.getElementById('LocObjDelPoint').parentElement;
        colPar.style.fontSize = "1.5em";
        colPar.style.color = '#4cae4c';

        document.getElementById('LocObjDelPoint').remove();

        //var tet = document.createElement('p').appendChild(document.createTextNode($(this).text()))
        var delButton = `<button class="btn btn-danger" onclick="deleteLocation('` + $(this).text() + `')">Löschen (` + $(this).text() + `)</button>`
        //colPar.appendChild(tet);
        $(colPar).append(delButton);
        colPar.id = "LocObjDelPoint"
    })

    $(document).on('click', '#delUserButton', function () {
        var delUserButton = $(this)[0];
        delUserButton.className = ' btn btn-danger';
        delUserButton.addEventListener('click', deleteuserFinger);
    })

    socket.emit('getDailyPoints', '');

    $(document).on('mouseenter', '.box', function () {
        $(this).find(".btn-lit").show();
        $(this).context.style.backgroundColor = '#e0e0e0';
    }).on('mouseleave', '.box', function () {
        $(this).find(".btn-lit").hide();
        $(this).context.style.backgroundColor = '#fcfcfc';
    });

    new Fingerprint2().get(function (fingerPrint, components) {
        // console.log(result); //a hash, representing your device fingerprint
        // console.log(components); // an array of FP components
        socket.emit('checkFingerPrint', fingerPrint);
    });

})

// $(document).on('mouseover', '.ratingStar', function () {
//     let ratingID = $(this)[0].id;
//     for (let i = 1; i <= ratingID; i++) {
//         var d = document.getElementById(i);
//         d.style.color = 'red';
//     }
// })

// $(document).on('mouseleave', '.ratingStar', function () {
//     let ratingID = $(this)[0].id;
//     for (let i = 1; i <= ratingID; i++) {
//         var d = document.getElementById(i);
//         d.style.color = 'black';
//     }
// })

// $(document).on('click', '.ratingStar', function () {
//     var ratingNumber = $(this)[0].id;
//     var dailyName = $(this)[0].getAttribute('name');
//     var eatLoc = document.getElementsByName('eatNameAddPoint');
//     socket.emit('setRating', { 'rating': ratingNumber, 'point': dailyName, 'user': userObject });
// })

$(document).on('click', '.addEatPoint', function () {
    $('#configModal').modal()
})

function deleteuserFinger() {
    socket.emit('deleteUserFinger', userObject);
}

function deleteLocation(loc) {
    $('#settingModal').modal('hide');
    setTimeout(function(){
        socket.emit('deleteLocation', loc);
    },300);
}

function showConfigModal() {
    getFingerPrint();
    $('#settingModal').modal({
        backdrop: 'static',
        keyboard: false
    });
}

function deleteUserLocationButt() {
    $('#settingModal').modal('hide');
    setTimeout(function () {
        socket.emit('getConfig', '');
    }, 500);
}

function getFingerPrint() {
    console.log("start FingerPrint");
}

function addNewLocation() {

    var time = document.getElementById('timeVa');
    var locSettings = {
        'name': selectedDailyPoint,
        'time': time.value
    }

    socket.emit('saveDailyPoint', locSettings);
}

function createNewLocation() {
    $('#configModal').modal('hide');
    $('#newLocationModal').modal();
    setTimeout(function () {
        socket.emit('getConfig', '');
    }, 500);
}

$(document).on('change', '#logoInput', function () {
    readURL(this);
})

function addUser(name) {
    socket.emit('addUser', { 'user': userObject.name, 'name': name });
}

function delUser(name) {
    socket.emit('delUser', name);
}

function readURL(input) {
    if (input.files && input.files[0]) {

        var reader = new FileReader();
        reader.onload = function (e) {
            var mime = input.files[0].type.split("/");
            if (mime[0] === 'image') {
                $('#logoImage').attr('src', e.target.result);
            } else {
                alert("Not a image");
            }
        }
        reader.readAsDataURL(input.files[0]);

        uploader.on('complete', function (fileInfo) {
            var mimetype = fileInfo.mime.split('/');
            if (mimetype[0] === 'image') {
                uploadInformation.logo = {
                    'name': fileInfo.name,
                    'uploaded': true
                }
            }
        })

        var logofile = document.getElementById('logoInput');
        if (logofile.files.length > 0) {
            var uploadIds = uploader.upload(logofile);
        }
    }
}

$(document).on('change', '#menuFile', function () {
    var inFile = this;
    if (inFile.files && inFile.files[0]) {

        uploader.on('stream', function (fileInfo) {

            $('#saveConfigModal').prop('disabled', true);

            var proginPerc = Math.round((fileInfo.sent * 100) / fileInfo.size);
            $('.progress').css({ 'display': 'block' });
            $('.progress .progress-bar').text(proginPerc + '%');
            $('.progress .progress-bar').css({ 'width': proginPerc + '%' });

        });
        uploader.on('complete', function (fileInfo) {
            console.log('Upload Complete', fileInfo);

            $('div').remove('.progress .progress-bar');
            $('.proginfo').text("Upload complete: " + fileInfo.name);
            $('.proginfo').css({ 'margin-top': '0.5em' });
            $('#saveConfigModal').prop('disabled', false);

            if (fileInfo.mime === 'application/pdf') {
                uploadInformation.menu = {
                    'name': fileInfo.name,
                    'uploaded': true
                }
            }
        });
        uploader.on('error', function (err) {
            alert('Err on download: ' + err);
        });
        uploader.on('abort', function (fileInfo) {
            console.log('Aborted: ', fileInfo);
        });

        var menuFile = document.getElementById('menuFile');
        var uploadIds = uploader.upload(menuFile);
    }
})

function saveNewEatPoint() {
    var formArr = $('#newPoint').serializeArray();
    var formData = {
        'name': formArr[0].value,
        'str': formArr[1].value,
        'plz': formArr[2].value,
        'ort': formArr[3].value,
        'tel': formArr[4].value,
        'men': formArr[5].value
    }

    var tagstemp = formArr[6].value;
    if (tagstemp.length > 0) {
        var tagsArr = tagstemp.split(";");
    } else {
        var tagsArr = []
    }

    formData.tag = tagsArr;

    if (formData.str.length <= 0 || formData.plz.length <= 0 || formData.ort <= 0) {
        formData.map = '';
    } else {
        formData.map = 'https://maps.google.com/?q=' + formData.str + "," + formData.plz + " " + formData.ort;
    }

    var locationName = {
        'name': formData.name,
        'img': {
            'name': uploadInformation.logo.name,
            'uploaded': uploadInformation.logo.uploaded
        },
        'doc': {
            'name': uploadInformation.menu.name,
            'uploaded': uploadInformation.menu.uploaded
        },
        tag: formData.tag,
        addrr: {
            str: formData.str,
            plz: formData.plz,
            ort: formData.ort,
            tel: formData.tel,
            mapurl: formData.map,
            menulink: formData.men
        }
    }
    if (locationName.name.length > 0) {
        socket.emit('saveNewLocation', locationName);
        $('#newLocationModal').modal('hide');
    } else {
        alert("Name is empty");
    }

    getLocations();
}

function getLocations() {
    console.log("call getLocations");
    socket.emit('getLocations', '')
}

function disableSave() {
    socket.emit('abortsaveNewLocation', "");
}

function deleteRealy(dPoint) {
    socket.emit('deleteDailyPoint', dPoint);
}

function deleteDayPoint(dPoint) {
    var delBut = document.getElementsByName(dPoint + 'dbutton');
    delBut[0].style.color = "Red";
    if (count == 0) {
        count++;
        delBut[0].style.marginRight = "1em";
    } else {
        count = 0;
        deleteRealy(dPoint);
    }
}

function appendDailyPoint(point) {
    if (point.points[0].img.path) {
        var LogoImg = point.points[0].img.path
    } else {
        var LogoImg = '/img/empty_logo.png'
    }
    if (point.points[0].tag.length > 0) {
        var tagshtml;
        for (var tag in point.points[0].tag) {
            if (tag == 3 || tag == 6 || tag == 9 || tag == 12) {
                tagshtml += '<br />';
                tagshtml += '<span class="label label-info">' + point.points[0].tag[tag] + '</span>';
            } else {
                if (tag == 0) {
                    tagshtml = '<span class="label label-info">' + point.points[0].tag[tag] + '</span>';
                } else {
                    tagshtml += '<span class="label label-info">' + point.points[0].tag[tag] + '</span>';
                }

            }
        }
    } else {
        var tagshtml = '<span></span>'
    }

    if (point.points[0].addrr.mapurl.length <= 0) {
        var mapbutton = '<button onclick="getMenu()" disabled="disabled" class="btn btn-default btn-block">Map</button>'
    } else {
        var mapbutton = '<a href="' + point.points[0].addrr.mapurl + '" class="btn btn-info btn-block" role="button">Map</a>'
    }

    if (point.points[0].addrr.menulink.length <= 0) {
        var menubuttonWeb = '<button onclick="getMenu()" disabled="disabled" class="btn btn-default btn-block">Menü (Web)</button>'
    } else {
        var menubuttonWeb = '<a href="' + point.points[0].addrr.menulink + '" class="btn btn-info btn-block" role="button">Menü (Web)</a>'
    }

    if (point.points[0].doc.uploaded <= 0) {
        var menubuttonPDF = '<button onclick="getMenu()" disabled="disabled" class="btn btn-default btn-block">Menü (PDF)</button>'
    } else {
        var menubuttonPDF = '<a href="' + point.points[0].doc.path + '" class="btn btn-info btn-block" role="button">Menü (PDF)</a>'
    }

    // var rating = point.points[0].rating.rated; //anzahl
    // var rated = point.points[0].rating.value; //sterne

    // if (rating !== null) {
    //     var retingNum = rating;
    // } else {
    //     var retingNum = 0;
    // }
    // if (rated !== null) {
    //     var ratedNum = rated;
    // } else {
    //     var ratedNum = 0;
    // }
    // var ratedHtml = '';
    // for (var i = 0; i < 5; i++) {

    //     if (i == 0) {
    //         if (i < rated) {
    //             console.log(rated);
    //             ratedHtml = '<i style="color:red" class="glyphicon glyphicon-star ratingStar rat' + (i + 1) + '" id="' + (i + 1) + '" name="' + point.points[0].name + point.location.time + '"></i>';
    //         } else {
    //             ratedHtml = '<i style="color:black" class="glyphicon glyphicon-star ratingStar rat' + (i + 1) + '" id="' + (i + 1) + '" name="' + point.points[0].name + point.location.time + '"></i>';
    //         }
    //     } else {
    //         if (i < rated) {
    //             console.log(rated);
    //             ratedHtml += '<i style="color:red" class="glyphicon glyphicon-star ratingStar rat' + (i + 1) + '" id="' + (i + 1) + '" name="' + point.points[0].name + point.location.time + '"></i>';
    //         } else {
    //             ratedHtml += '<i style="color:black" class="glyphicon glyphicon-star ratingStar rat' + (i + 1) + '" id="' + (i + 1) + '" name="' + point.points[0].name + point.location.time + '"></i>';
    //         }
    //     }
    // }

    if (point.members.length > 0) {
        var memberSpan;
        var membersArr = point.members;
        for (var memb in membersArr) {
            var delObj = JSON.stringify({
                'user': membersArr[memb],
                'loc': point.name
            });
            if (memb == 0) {
                memberSpan = `<div class="col-md-12" name="` + membersArr[memb] + point.name + `">
                <div class="box">
                    <div onclick='delUser(`+ delObj + `)' class="btn btn-danger btn-lit pull-right">
                        <i class="glyphicon glyphicon-trash"></i>
                    </div>
                        <span>`+ membersArr[memb] + `</span>
                    </div>
                </div>`
            } else {
                memberSpan += `<div class="col-md-12" name="` + membersArr[memb] + point.name + `">
                <div class="box">
                    <div onclick='delUser(`+ delObj + `)' class="btn btn-danger btn-lit pull-right">
                        <i class="glyphicon glyphicon-trash"></i>
                    </div>
                        <span>`+ membersArr[memb] + `</span>
                    </div>
                </div>`
            }
        }

    } else {
        var memberSpan = "";
    }

    var locHtml = `
  <div class="panel panel-default" name="`+ point.points[0].name + point.location.time + `">
    <div name="`+ point.name + `panel" class="panel-heading">` + point.points[0].name + ` - Start ` + point.location.time + ` Uhr
        <button class="close" onclick='deleteDayPoint("`+ point.points[0].name + point.location.time + `")' name="` + point.points[0].name + point.location.time + `dbutton")'><span>×</span></button>
    </div>      
    <div class="panel-body">
        <div class="row">
        <div class="col-md-5">
            <div class="row">
            <div class="col-md-5">
                <div class="row">
                <div class="col-md-12">
                    <img src="`+ LogoImg + `" alt="loc-logo" class="img-thumbnail"/>
                </div>
                </div>
                <div class="row">
                <div class="col-md-12" style="max-width:20px">
                    ` + tagshtml + `
                </div>
                </div>
            </div>
            <div class="col-md-7">
                <div class="row">
                <div class="col-md-12">
                    <span class="addrr">Adresse</span>
                    <br/>
                    <span>`+ point.points[0].addrr.str + `</span>
                    <br/>
                    <span>`+ point.points[0].addrr.plz + ` ` + point.points[0].addrr.ort + `</span>
                    <br/>
                    <span class="addrr">Telefon</span>
                    <br/>
                    <span>`+ point.points[0].addrr.tel + `</span>
                        `+ mapbutton + `
                    <div class="col-md-6" style="padding:1px">
                        `+ menubuttonWeb + `
                    </div>
                    <div class="col-md-6" style="padding:1px">
                        `+ menubuttonPDF + `
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="row" name=`+ point.name + `>
            <div onclick="addUser('`+ point.name + `')" class="btn-toolbar pull-right btn btn-circle btn-success top--30px">
                <i class="glyphicon glyphicon-plus"></i>
            </div>
                `+ memberSpan + `
            </div>
        </div>
        <div class="col-md-3">
            <div class="imgcenter">
            <div class="carnum", name="carnum`+ point.name + `">0</div>
            <div class="passnum", name="passnum`+ point.name + `">0</div>
            </div>
        </div>
        </div>
    </div>
  </div>`;
    $('#toAppend').append($(locHtml));
    calcurateUserCars({
        'state': {
            'number': point.members.length
        },
        'userName': {
            'name': point.name
        }
    })
}

function saveNewUser() {
    var userfield = document.getElementsByName('userNameFPrint');
    var userName = userfield[0].value;
    if (userName.length <= 0) {
        alert('Benutzername wird benötigt');
    } else {
        $('#userCreateDialog').modal('hide');
        socket.emit('saveUser', {
            name: userName,
            finger: userObject.finger
        })
    }
}

function calcurateUserCars(data) {
    var memNumber = data.state.number;
    if (memNumber >= 5) {
        var cars = (memNumber - (memNumber % 5)) / 5;
        var passn = memNumber % 5;
    } else {
        var cars = 0;
        var passn = memNumber;
    }

    var pasNum = document.getElementsByName('passnum' + data.userName.name)[0];
    var carNum = document.getElementsByName('carnum' + data.userName.name)[0];
    pasNum.innerText = passn;
    carNum.innerText = cars;
}

// socket.on('ratingSetted', function (data) {
//     console.log(data);

//     var rating = data.result.location.rating.rated; //anzahl
//     var rated = data.result.location.rating.value; //sterne
//     console.log("1111", rating, rated);
//     var point = data.ratObj;
//     console.log(rating, '###### NIFC');
//     if (rating !== null) {
//         var retingNum = rating;
//         console.log(rating, '+#########');
//     } else {
//         var retingNum = 0;
//         console.log(rating, '###### NIF');
//     }
//     if (rated !== null) {
//         var ratedNum = rated;
//     } else {
//         var ratedNum = 0;
//     }

//     console.log(retingNum);
//     var ratedHtml = '';
//     for (var i = 0; i < 5; i++) {

//         if (i == 0) {
//             if (i < rated) {
//                 console.log(rated);
//                 ratedHtml = '<i style="color:red" class="glyphicon glyphicon-star ratingStar rat' + (i + 1) + '" id="' + (i + 1) + '" name="' + point.point + '"></i>';
//             } else {
//                 ratedHtml = '<i style="color:black" class="glyphicon glyphicon-star ratingStar rat' + (i + 1) + '" id="' + (i + 1) + '" name="' + point.point + '"></i>';
//             }
//         } else {
//             if (i < rated) {
//                 console.log(rated);
//                 ratedHtml += '<i style="color:red" class="glyphicon glyphicon-star ratingStar rat' + (i + 1) + '" id="' + (i + 1) + '" name="' + point.point + '"></i>';
//             } else {
//                 ratedHtml += '<i style="color:black" class="glyphicon glyphicon-star ratingStar rat' + (i + 1) + '" id="' + (i + 1) + '" name="' + point.point + '"></i>';
//             }
//         }
//     }

//     var spanRated = '<span>('+ retingNum + ')</span>'

//     var ratingCol = document.getElementsByName('ratingCol');
//     $(ratingCol).empty();
//     $(ratingCol).append(ratedHtml);
//     $(ratingCol).append(spanRated);
// })

socket.on('writeModalConfigs', function (configObj) {
    var toAppend = document.getElementById('toAppend');
    var settingModal = document.getElementById('settingModal');
    var liHtml = [];
    if (configObj.length > 0) {
        for (var conf in configObj) {
            var locName = configObj[conf].name;
            if (conf == 0) {
                liHtml = '<li><a class="eatNameDelPoint" style="padding:5px;" name="' + locName + '" href="#">'+ locName +'</a></li>'
            } else {
                liHtml += '<li><a class="eatNameDelPoint" style="padding:5px;" name="' + locName + '" href="#">'+ locName +'</a></li>'
            }
        }
    }
    var html = `<div class="modal fade in" id="settingModal" tabindex="-1" role="dialog">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h4 class="modal-title" style="color: #4cae4c;">Konfiguration</h4>
                            </div>
                            <div class="modal-body">
                                <div class="row">
                                <div class="col-md-6">
                                    <div class="dropdown" id="LocObjDelPoint">
                                        <button class="btn dropdown-toggle btn-success" id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">EssPunkt entfernen<span class="caret"></span></button>
                                        <ul class="dropdown-menu settingModal" aria-labelledby="dLabel">
                                            `+ liHtml + `
                                        </ul>
                                    </div>
                                </div>
                                <div class="col-md-6"><button class="btn btn-warning" id="delUserButton" type="button" style="margin-left:1em;">Benutzer löschen (`+ userObject.name + `)</button></div>
                                </div>
                            </div>
                            <div class="modal-footer"><button class="btn btn-default" type="button" onclick="deleteUserLocationButt()">Close</button></div>
                        </div>
                    </div>
                </div>`;

    $(settingModal).remove();
    $(toAppend).append(html);

    var liHtmlConfig = [];

    if (configObj.length > 0) {
        for (var conf in configObj) {
            var locName = configObj[conf].name;
            if (conf == 0) {
                liHtmlConfig = '<li><a class="eatNameAddPoint" style="padding:5px;" name="' + locName + '" href="#">'+ locName +'</a></li>'
            } else {
                liHtmlConfig += '<li><a class="eatNameAddPoint" style="padding:5px;" name="' + locName + '" href="#">'+ locName +'</a></li>'
            }
        }
    }


    var configHtml = `<div class="modal fade in" id="configModal" tabindex="-1" role="dialog">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <button class="close" type="button" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                                    <h4 class="modal-title" style="color: #4cae4c;">EssPunkt hinzufügen</h4>
                                </div>
                                <div class="modal-body">
                                    <div class="row">
                                    <div class="col-md-4">
                                        <p>Wählen</p>
                                    </div>
                                    <div class="col-md-4">
                                        <p>Startzeit</p>
                                    </div>
                                    <div class="col-md-2">
                                        <p>Neu</p>
                                    </div>
                                    </div>
                                    <div class="row">
                                    <div class="col-md-4">
                                        <div class="dropdown" id="LocObjAddPoint">
                                            <button class="btn dropdown-toggle btn-success" id="dLabel" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">EssPunkt auswählen<span class="caret"></span></button>
                                            <ul class="dropdown-menu configModal" aria-labelledby="dLabel">
                                                `+ liHtmlConfig + `
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="input-group clockpicker" data-placement="bottom" data-align="top" data-autoclose="true"><input class="form-control" type="text" value="11:45" id="timeVa"><span class="input-group-addon"><span class="glyphicon glyphicon-time"></span></span></div>
                                        <script type="text/javascript">$('.clockpicker').clockpicker();</script>
                                    </div>
                                    <div class="col-md-2 text-center"><button class="btn btn-success" onclick="createNewLocation()">Neu</button></div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button class="btn btn-default" type="button" data-dismiss="modal" onclick="deleteUserLocationButt()">Abbrechen</button>
                                    <button class="btn btn-success" type="button" data-dismiss="modal" onclick="addNewLocation()">Erstellen</button>
                                </div>
                            </div>
                        </div>
                        </div>`
    var configModal = document.getElementById('configModal');
    $(configModal).remove();
    $(toAppend).append(configHtml);
})

socket.on('userFingerDeleted', function (userInfo) {
    $('#settingModal').modal('hide');
    new Fingerprint2().get(function (fingerPrint, components) {
        // console.log(result); //a hash, representing your device fingerprint
        // console.log(components); // an array of FP components
        socket.emit('checkFingerPrint', fingerPrint);
    });
})

socket.on('dayPointdeleted', function (result) {
    var name = result.dPoint;
    var panel = document.getElementsByName(name);
    $(panel).remove();
})

socket.on('userNotExist', function (fPrint) {
    $('#userCreateDialog').modal({
        backdrop: 'static',
        keyboard: false
    });
    userObject.finger = fPrint;
})

socket.on('userNameIs', function (userIn) {
    userObject.name = userIn.name;
    userObject.finger = userIn.finger;
    socket.emit('getConfig', userObject);

    var userName = document.getElementById('delUserButton');
    userName.innerText = userName.innerText + ' (' + userIn.name + ')';
})

socket.on('recieveDailyPoints', function (pointsArr) {

    //var test = document.getElementsByName(pointsArr[0].name+"panel");
    for (var point in pointsArr) {
        var panel = document.getElementsByName(pointsArr[point].name + "panel");
        if (panel.length <= 0) {
            appendDailyPoint(pointsArr[point]);
        }
    }
})

socket.on('saveNewLocationStat', function (result) {
    if (result.status === true) {
        $('#toAppend').append('<div class="alert alert-success alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong> Location was saved</div>');
    } else {
        if (result.status == 'duplicate') {
            $('#toAppend').append('<div class="alert alert-warning alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Warning!</strong> Location already exist</div>');
        } else {
            $('#toAppend').append('<div class="alert alert-danger alert-dismissable"><a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Error!</strong> ' + JSON.stringify(result) + '</div>');
        }
    }
    socket.emit('getConfig');
})

socket.on('userAdded', function (data) {
    var searchName = document.getElementsByName(data.userName.name);

    var toAppend = searchName[1];
    var membersArr = data.state.userarr;
    var membAppend;
    for (var memb in membersArr) {
        var userExist = (document.getElementsByName(membersArr[memb] + data.userName.name));
        var delObj = JSON.stringify({
            'user': membersArr[memb],
            'loc': data.userName.name
        });
        if (memb == 0) {
            membAppend = `<div class="col-md-12 userNames" name="` + membersArr[memb] + data.userName.name + `">
                                <div class="box">
                                    <div class="btn btn-danger btn-lit pull-right" onclick='delUser(`+ delObj + `)'>
                                        <i class="glyphicon glyphicon-trash"></i>
                                    </div>
                                        <span>` + membersArr[memb] + `</span>
                                    </div>
                             </div>`
        } else {
            membAppend += `<div class="col-md-12 userNames" name="` + membersArr[memb] + data.userName.name + `">
                                <div class="box">
                                    <div class="btn btn-danger btn-lit pull-right" onclick='delUser(`+ delObj + `)'>
                                        <i class="glyphicon glyphicon-trash"></i>
                                    </div>
                                        <span>` + membersArr[memb] + `</span>
                                    </div>
                             </div>`
        }
    }
    $(toAppend).append(membAppend);

    var memNumber = data.state.number;
    if (memNumber >= 5) {
        var cars = "";
    } else {
        var cars = 0;
        var passn = memNumber;
    }


    calcurateUserCars(data);
})

socket.on('userDeleted', function (userInfo) {
    var searchName = document.getElementsByName(userInfo.userInfo.user + userInfo.userInfo.loc);
    var toAppend = searchName[0];
    var membersArr = userInfo.state.members;
    $(toAppend).remove();
    calcurateUserCars({
        'state': {
            'number': userInfo.state.members.length
        },
        'userName': {
            'name': userInfo.userInfo.loc
        }
    })
})