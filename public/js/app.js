'use strict';

var socket = io.connect();
var uploader = new SocketIOFileClient(socket);

var allInfo = {
    'locations': [],
    'dayPoints': [],
    'userObject': {
        'name': '',
        'finger': ''
    }
}

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
var selectedDailyPoint = '';
var count = 0;

$(document).ready(function () {
    callAllInfo();

    new Fingerprint2().get(function (fingerPrint, components) {
        //  console.log(fingerPrint); //a hash, representing your device fingerprint
        //  console.log(components); // an array of FP components
        allInfo.userObject.finger = fingerPrint;
        socket.emit('checkFingerPrint', fingerPrint);
    });
});

$(document).on('change', '#logoInput', function () {
    readURL(this);
})

$(document).on('click', 'ul li a', function () {
    var selectedLocation = ($(this).text());
    if ($(this)[0].className == 'eatNameAddPoint') {
        var colPar = document.getElementById('LocObjAddPoint').parentElement;
        colPar.style.fontSize = "1.5em";
        colPar.style.color = '#4cae4c';

        $(colPar).empty();

        var tet = document.createElement('p').appendChild(document.createTextNode($(this).text()))
        colPar.appendChild(tet);
        colPar.id = "LocObjAddPoint"
        selectedDailyPoint = $(this).text();
    } else {
        var selectedLocation = ($(this).text());
        var colPar = document.getElementById('LocObjDelPoint').parentElement;
        colPar.style.fontSize = "1.5em";
        colPar.style.color = '#4cae4c';

        document.getElementById('LocObjDelPoint').remove();

        var delButton = `<button class="btn btn-danger" onclick="deleteLocation('` + $(this).text() + `')">Löschen (` + $(this).text() + `)</button>`
        $(colPar).append(delButton);
        colPar.id = "LocObjDelPoint"
    }

    var createBut = document.getElementById('createEssPunktButton');
    createBut.disabled = false;

})

$(document).on('change', '#menuFile', function () {
    var inFile = this;
    var mime = inFile.files[0].type.split("/");
    if(mime[1] === 'pdf'){
        if (inFile.files && inFile.files[0]) {

            uploader.on('stream', function (fileInfo) {

                $('#saveConfigModal').prop('disabled', true);

                var proginPerc = Math.round((fileInfo.sent * 100) / fileInfo.size);
                $('.progress').css({ 'display': 'block' });
                $('.progress .progress-bar').text(proginPerc + '%');
                $('.progress .progress-bar').css({ 'width': proginPerc + '%' });

            });
            uploader.on('complete', function (fileInfo) {

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
                //console.log('Aborted: ', fileInfo);
            });

            var menuFile = document.getElementById('menuFile');
            var uploadIds = uploader.upload(menuFile);
        }
    } else {
        alert("File not pdf");
    }
})

$(document).on('click', '#delUserButton', function () {
    var delUserButton = $(this)[0];
    delUserButton.className = ' btn btn-danger';
    delUserButton.addEventListener('click', deleteuserFinger);
})

$(document).on('mouseenter', '.box', function () {
    $(this).find(".btn-lit").show();
    $(this).context.style.backgroundColor = '#e0e0e0';
}).on('mouseleave', '.box', function () {
    $(this).find(".btn-lit").hide();
    $(this).context.style.backgroundColor = '#fcfcfc';
});

function deleteuserFinger() {
    socket.emit('deleteUserFinger', allInfo.userObject);
}

function delUser(uName) {
    if (uName.user == allInfo.userObject.name) {
        socket.emit('delUser', uName);
    } else {
        $.notify("Das ist nicht Dein Benutzer (Du bist " + allInfo.userObject.name + ")", "warn");
    }
}

function addDriver(uName){
    if(allInfo.userObject.name == uName.user){
        socket.emit('addDriver', uName);
    } else {
        $.notify("Das ist nicht Dein Benutzer (Du bist " + allInfo.userObject.name + ")", "warn");
    }
}

function callAllInfo() {
    //call info of locations and daypoints;
    socket.emit('callAllInfo', allInfo.userObject.finger);
}

function updateAll() {
    appendDailyPoints();
}

function appendDailyPoints() {

    var pointsArr = allInfo.dayPoints;

    for (var point in pointsArr) {
        var panel = document.getElementsByName(pointsArr[point].name + "panel");
        if (panel.length <= 0) {
            appendDailyPoint(pointsArr[point]);
        }
    }
}

function addLocation() {
    createConfigModal();
}

function createNewLocation() {
    $('#configModal').modal('hide');
    var newLocModal = document.getElementById('newLocationModal');
    if(newLocModal === null){
        createNewLocationModal();
    } else {
        $(newLocModal).remove();
        createNewLocationModal();
    }
}

function showConfigModal() {
    var settingsModal = document.getElementById('settingModal');
    if (settingsModal === null) {
        createSettingModal();
    } else {
        $(settingsModal).remove();
        createSettingModal();
    }
}

function deleteUserLocationButt() {
    $('#settingModal').modal('hide');
}

function readURL(input) {
    if (input.files && input.files[0]) {

        var reader = new FileReader();
        reader.onload = function (e) {
            var mime = input.files[0].type.split("/");
            if (mime[0] === 'image') {
                $('#logoImage').attr('src', e.target.result);
                var logofile = document.getElementById('logoInput');
                if (logofile.files.length > 0) {
                    var uploadIds = uploader.upload(logofile);
                }
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
    }
}

function saveNewEatPoint() {

    var formArr = $('#newPoint').serializeArray();

    var str = formArr[0].value;
    var nameReplaced = str.replace(/'/g, "");

    if (formArr.length <= 7) {
        var formData = {
            'name': nameReplaced.replace(/</g, "😩").replace(/>/g, "😩"),
            'beste': false,
            'str': formArr[1].value.replace(/</g, "😩").replace(/>/g, "😩"),
            'plz': formArr[2].value.replace(/</g, "😩").replace(/>/g, "😩"),
            'ort': formArr[3].value.replace(/</g, "😩").replace(/>/g, "😩"),
            'tel': formArr[4].value.replace(/</g, "😩").replace(/>/g, "😩"),
            'men': formArr[5].value.replace(/</g, "😩").replace(/>/g, "😩")
        }

        var tagstemp = formArr[6].value;
        if (tagstemp.length > 0) {
            var tagsArr = tagstemp.split(";");
        } else {
            var tagsArr = []
        }
    } else {
        var formData = {
            'name': nameReplaced.replace(/</g, "😩").replace(/>/g, "😩"),
            'beste': true,
            'str': formArr[2].value.replace(/</g, "😩").replace(/>/g, "😩"),
            'plz': formArr[3].value.replace(/</g, "😩").replace(/>/g, "😩"),
            'ort': formArr[4].value.replace(/</g, "😩").replace(/>/g, "😩"),
            'tel': formArr[5].value.replace(/</g, "😩").replace(/>/g, "😩"),
            'men': formArr[6].value.replace(/</g, "😩").replace(/>/g, "😩")
        }

        var tagstemp = formArr[7].value;
        if (tagstemp.length > 0) {
            var tagsArr = tagstemp.split(";");
        } else {
            var tagsArr = []
        }
    }

    var menulink = formData.men;
    if(menulink.length > 0){
        var n = menulink.search('http');
        if(n == -1){
            formData.men = 'http://' + formData.men;
        }
    }

    formData.tag = tagsArr;

    if (formData.str.length <= 0 || formData.plz.length <= 0 || formData.ort <= 0) {
        formData.map = '';
    } else {
        formData.map = 'https://maps.google.com/?q=' + formData.str + "," + formData.plz + " " + formData.ort;
    }

    var locationName = {
        'name': formData.name,
        'beste': formData.beste,
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
        var locArr = allInfo.locations;
        var picked = locArr.find(o => o.name === locationName.name);
        if (picked == undefined) {
            socket.emit('saveNewLocation', locationName);
            $('#newLocationModal').modal('hide');
        } else {
            $.notify("Esspunkt " + locationName.name + " existiert bereits", "warn");
        }
    } else {
        $.notify("Name ist leer", "warn");
    }
}

function disableSave() {
    socket.emit('abortsaveNewLocation', "");
}

function saveNewUser() {
    var userfield = document.getElementsByName('userNameFPrint');
    var userName = userfield[0].value;
    userName = userName.replace(/</g, "😩").replace(/>/g, "😩");
    if (userName.length <= 0) {
        alert('Benutzername wird benötigt');
    } else {
        $('#userCreateDialog').modal('hide');
        socket.emit('saveUser', {
            name: userName,
            finger: allInfo.userObject.finger
        })
    }
}

function deleteLocation(loc) {
    $('#settingModal').modal('hide');

    var panels = document.getElementsByClassName('panelDailyPoint');

    for (var i = 0; i < panels.length; i++) {
        var pann = panels[i];
        var name = pann.getAttribute('name');
        var splitnameArr = name.split(";");
        var dPoint = splitnameArr[0];
        var pointPanel = splitnameArr[1];
        if (pointPanel === loc) {
            deleteRealy(dPoint);
        }
    }

    setTimeout(function () {
        socket.emit('deleteLocation', loc);
    }, 200);
}

function addNewLocation() {
    $('#configModal').modal('hide');
    var time = document.getElementById('timeVa');
    time = time.replace(/</g, "😩").replace(/>/g, "😩");
    var locSettings = {
        'name': selectedDailyPoint,
        'time': time.value
    }
    socket.emit('saveDailyPoint', locSettings);
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

function deleteRealy(dPoint) {
    var allDPoints = allInfo.dayPoints;
    var picked = allDPoints.find(o => o.name === dPoint);
    var pointName = picked.points[0].name;
    socket.emit('deleteDailyPoint', dPoint, pointName);
}

function addUserButton(name) {


    var splitPar = name.split(";");
    var dPointName = splitPar[0];
    var beste = splitPar[1];
    if (beste == 'true') {
        createBestellModal(dPointName);
    } else {
        socket.emit('addUser', { 'user': allInfo.userObject.name, 'name': dPointName, 'beste': false });
    }
}

function saveBestellungsname(dPoint) {

    var formArr = $('#besthin').serializeArray();
    if (formArr[0].value.length <= 0) {
        alert("Bitte Bestellung eingeben");
    } else {
        $('#bestellDialog').modal('hide');
        var beste = formArr[0].value;
        socket.emit('addUser', { 'user': allInfo.userObject.name, 'name': dPoint, 'beste': beste });
    }
}

function addComment(data) {
    var d = new Date();
    var nTemp = d.getHours();
    var mTemp = d.getMinutes();
    var dataArr = data.split(";");
    var dPoint = dataArr[0];
    var point = dataArr[1];
    var commentText = document.getElementById('commentarInput'+ dPoint).value;
    commentText = commentText.replace(/</g, "😩").replace(/>/g, "😩");
    
    document.getElementById('commentarInput'+ dPoint).value = '';

    if(nTemp > 9){
        var n = nTemp;
    } else {
        var n = '0' + nTemp;
    }

    if(mTemp > 9){
        var m = mTemp;
    } else {
        var m = '0' + mTemp
    }

    if (commentText.length <= 0) {
        $.notify('Kein Text eingegeben', "warn");
    } else {
        var user = allInfo.userObject.name;
        var commObj = {
            'user': user,
            'comment': commentText,
            'dPoint': dPoint,
            'point': point,
            'time': n + ":" + m
        }
        socket.emit('saveComment', commObj);
    }
}

socket.on('commentAdded', function (commData) {
    appendComment(commData);
})

socket.on('locDeleted', function(locName){
    $.notify("Esspunkt "+ locName +" wurde gelöscht", "success");
})

socket.on('allInfo', function (allData) {
    //update locations and dayPoints;
    allInfo.locations = allData.eatLocations;
    allInfo.dayPoints = allData.dailyPoints;
    updateAll();
})

socket.on('saveNewLocationStat', function (result) {
    if (result.status === true) {
        $.notify("Esspunkt erstellt", "success");
    } else {
        if (result.status == 'duplicate') {
            $.notify("Esspunkt existiert bereits", "warn");
        } else {
            $.notify("Fehler: " + result, "error");
        }
    }
})

socket.on('userNotExist', function (fPrint) {
    allInfo.userObject.finger = fPrint;
    createUserDialog();
})

socket.on('userNameIs', function (userIn) {
    allInfo.userObject.name = userIn.name;
    allInfo.userObject.finger = userIn.finger;
})

socket.on('userFingerDeleted', function (userInfo) {
    $('#settingModal').modal('hide');
    var settingModal = document.getElementById('settingModal');
    $(settingModal).remove;
    new Fingerprint2().get(function (fingerPrint, components) {
        allInfo.userObject.finger = fingerPrint;
        socket.emit('checkFingerPrint', fingerPrint);
    });
})

socket.on('recieveDailyPoints', function (pointName) {
    allInfo.locations = pointName.allInfo.eatLocations;
    allInfo.dayPoints = pointName.allInfo.dailyPoints;
    appendDailyPoints();
})

socket.on('dayPointdeleted', function (result) {
    var name = result.dPoint;
    var pName = result.pointOf;
    var panel = document.getElementsByName(name + ";" + pName);
    $(panel).remove();
})

socket.on('userAdded', function (data) {
    var username = {
        'userName': {
            'user': data.userName.user,
            'beste': data.userName.beste,
            'name': data.userName.name,
            'memNum': data.state.number
        }
    }
    addUserDaily(username);
})

socket.on('addedDriver', function(drivObj){
    addDriverHtml(drivObj);
})

socket.on('userDeleted', function (data) {
    var userInfo = {
        'userName': {
            'user': data.userInfo.user,
            'name': data.userInfo.loc,
            'memNum': data.state.members.length
        }
    }
    var searchName = document.getElementsByName(userInfo.userName.user + userInfo.userName.name);
    var toAppend = searchName[0];
    $(toAppend).remove();
    calcurateUserCars(userInfo);

    //delete driver
    var drivName = document.getElementsByName('drivName' + data.userInfo.user);
    $(drivName).remove();

})

socket.on('customErr', function(errdata){
    $.notify(errData, "error");
})

socket.on('disconnect', function(err){
    $.notify("Fehler: " + err + "\n Kann nichts mehr machen", "error");
})

socket.on('connect', function(){
    $.notify('Online!', "info");
})
