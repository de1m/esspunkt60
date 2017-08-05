'use strict';

function createConfigModal() {


    var toAppend = document.getElementById('toAppend');
    var configObj = allInfo.locations;
    var liHtmlConfig = [];

    if (configObj.length > 0) {
        for (var conf in configObj) {
            var locName = configObj[conf].name;
            if (conf == 0) {
                liHtmlConfig = '<li><a class="eatNameAddPoint" style="padding:5px;" name="' + locName + '" href="#">' + locName + '</a></li>'
            } else {
                liHtmlConfig += '<li><a class="eatNameAddPoint" style="padding:5px;" name="' + locName + '" href="#">' + locName + '</a></li>'
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
                                    <div class="col-md-2 text-center"><button class="btn btn-success" onclick="createNewLocation()">Neuer Esspunkt</button></div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button class="btn btn-default" type="button" data-dismiss="modal" onclick="deleteUserLocationButt()">Abbrechen</button>
                                    <button class="btn btn-success" id="createEssPunktButton" disabled type="button" data-dismiss="modal" onclick="addNewLocation()">Erstellen</button>
                                </div>
                            </div>
                        </div>
                        </div>`
    var configModal = document.getElementById('configModal');
    $(configModal).remove();
    $(toAppend).append(configHtml);

    $('#configModal').modal();
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

    var bestellung = point.points[0].beste;
    if (bestellung == 'true') {
        var labelbe = `<span class="label label-info" style="margin-right:5px">bestellung</span>`
    } else {
        var labelbe = ``
    }

    var passanger = {
        'userName': {
            'name': point.name,
            'memNum': point.members.length
        }
    }

    var locHtml = `
  <div class="panel panel-default panelDailyPoint" name="`+ point.points[0].name + point.location.time + `;` + point.points[0].name + `">
    <div name="`+ point.name + `panel" class="panel-heading">` + labelbe + point.points[0].name + ` - Start ` + point.location.time + ` Uhr
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
            <div class="col-md-12" name="appendComment`+ point.points[0].name + point.location.time + `">

            </div>
            <div class="col-md-12">
                    <div class="input-group">
                        <input id="commentarInput`+ point.points[0].name + point.location.time + `" type="text" class="form-control" placeholder="Kommentar schreiben">
                        <span class="input-group-btn">
                            <div class="btn btn-success btn-circle pull-right" onclick='addComment("`+ point.points[0].name + point.location.time + `;` + point.points[0].name + `")'>
                                <i class="glyphicon glyphicon-comment"></i>
                            </div>
                        </span>
                    </div><!-- /input-group -->
            </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="row" name=`+ point.name + `>
            <div onclick="addUserButton('`+ point.name + `;` + bestellung + `')" class="btn-toolbar pull-right btn btn-circle btn-success top--30px">
                <i class="glyphicon glyphicon-plus"></i>
            </div>

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

    if (point.members.length > 0) {
        var memberSpan;
        var membersArr = point.members;
        for (var memb in membersArr) {

            var username = {
                'userName': {
                    'user': membersArr[memb].user,
                    'beste': membersArr[memb].beste,
                    'name': point.name,
                    'memNum': point.members.length
                }
            }
            var delObj = JSON.stringify({
                'user': membersArr[memb],
                'loc': point.name
            });

            addUserDaily(username);
        }
    }

    for (var i = 0; i < point.comments.length; i++) {
        var comment = point.comments[i];
        var commOjb = {
            'user': comment.user,
            'comment': comment.commentar,
            'dPoint': point.name,
            'point': point.points[0].name
        }

        appendComment(commOjb);
    }
}

function appendComment(commObj) {
    var user = commObj.user;
    var comment = commObj.comment;
    var panelName = commObj.dPoint;
    var comment = `<div class="panel panel-default commentpanel">
                    <div class="panel-heading comment" style="color:white; background-color: #4cae4c;">
                        `+ user + `
                    </div>
                    <div class="panel-body comment">
                        `+ comment + `
                    </div>
                </div>`

    var toAppend = document.getElementsByName('appendComment' + panelName);
    $(toAppend).append(comment);
}

function addUserDaily(data) {
    var searchName = document.getElementsByName(data.userName.name);

    var toAppend = searchName[0];
    var membersArr = [data.userName];
    var membAppend;
    for (var memb in membersArr) {
        var member = membersArr[memb].user;
        var bestell = membersArr[memb].beste;
        if (bestell !== false) {
            var bestellspan = `<span class="label label-info bestell">` + bestell + `</span>`;
        } else {
            var bestellspan = '';
        }
        var userExist = (document.getElementsByName(membersArr[memb] + data.userName.name));
        var delObj = JSON.stringify({
            'user': data.userName.user,
            'loc': data.userName.name
        });
        if (memb == 0) {
            membAppend = `<div class="col-md-12 userNames" name="` + member + data.userName.name + `">
                                <div class="box">
                                    <div class="btn btn-danger btn-lit pull-right" onclick='delUser(`+ delObj + `)'>
                                        <i class="glyphicon glyphicon-trash"></i>
                                    </div>
                                        <span>` + member + bestellspan + `</span>
                                    </div>
                             </div>`
        } else {
            membAppend += `<div class="col-md-12 userNames" name="` + member + data.userName.name + `">
                                <div class="box">
                                    <div class="btn btn-danger btn-lit pull-right" onclick='delUser(`+ delObj + `)'>
                                        <i class="glyphicon glyphicon-trash"></i>
                                    </div>
                                        <span>` + member + bestellspan + `</span>
                                    </div>
                             </div>`
        }
    }
    $(toAppend).append(membAppend);

    calcurateUserCars(data);
}

function calcurateUserCars(data) {
    var memNumber = data.userName.memNum;
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

function createBestellModal(name) {

    var bestellDialog = document.getElementById('bestellDialog');
    if (bestellDialog === null) {

    } else {
        $(bestellDialog).remove();
    }

    var html = `<div class="modal fade" id="bestellDialog" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-sm" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" style="color: #4cae4c">Bestellung</h4>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-lg-12"></div>
                        <form id='besthin'>
                            <div class="form-group">
                                <div class="col-lg-12">
                                    <input id="bestellungInput" class="form-control" type="text" name="bestellung" placeholder="Bestellung (möglichst kurz)" required="required" />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-default" type="button" data-dismiss="modal">Abbrechen</button>
                    <button class="btn btn-success" type="button" onclick="saveBestellungsname('`+ name + `')">Speichern</button>
                </div>
            </div>
        </div>
    </div>`

    $('#toAppend').append(html);
    $('#bestellDialog').modal('show');

}

function createUserDialog() {
    var html = `
        <div class="modal fade" id="userCreateDialog" tabindex="-1" role="dialog">
            <div class="modal-dialog modal-sm" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" style="color: #4cae4c;">Neuer Benutzer</h4>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-lg-12"><span>Benutzer wird anhand von <a href="https://de.wikipedia.org/wiki/Canvas_Fingerprinting">Fingerprint</a> identifiziert und es funktionier nur innerhalb eines Browsers. <br><br></span></div>
                                <form>
                                    <div class="form-group">
                                        <div class="col-lg-12"><input class="form-control" type="text" name="userNameFPrint" placeholder="Benutzername" required=""></div>
                                        </div>
                                </form>
                            </div>
                        </div>
                    <div class="modal-footer"><button class="btn btn-success" type="button" onclick="saveNewUser()">Speichern</button></div>
                </div>
            </div>
        </div>`
    $('#toAppend').append(html);
    $('#userCreateDialog').modal({
        backdrop: 'static',
        keyboard: false
    });
}

function createSettingModal() {
    var settingModal = document.getElementById('settingModal');
    var liHtml = [];
    var configObj = allInfo.locations;
    var userObject = allInfo.userObject;
    if (configObj.length > 0) {
        for (var conf in configObj) {
            var locName = configObj[conf].name;
            if (conf == 0) {
                liHtml = '<li><a class="eatNameDelPoint" style="padding:5px;" name="' + locName + '" href="#">' + locName + '</a></li>'
            } else {
                liHtml += '<li><a class="eatNameDelPoint" style="padding:5px;" name="' + locName + '" href="#">' + locName + '</a></li>'
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
                                <div class="col-md-6"><button class="btn btn-warning" id="delUserButton" type="button" style="margin-left:1em;">Benutzer löschen (` + userObject.name + `)</button></div>
                                </div>
                            </div>
                            <div class="modal-footer"><button class="btn btn-default" type="button" onclick="deleteUserLocationButt()">Abbrechen</button></div>
                        </div>
                    </div>
                </div>`;

    //$(settingModal).remove();
    $('#toAppend').append(html);

    $('#settingModal').modal({
        backdrop: 'static',
        keyboard: false
    });

    var deluserButton = document.getElementById('delUserButton');
    deluserButton.innerText = 'Benutzer löschen(' + allInfo.userObject.name + ')';

}

function createNewLocationModal() {

    var html = `<div class="modal fade in" id="newLocationModal" tabindex="-1" role="dialog" style="display: block;">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button class="close" type="button" data-dismiss="modal" aria-label="Close" onclick="disableSave()><span aria-hidden="true">×</span></button>
                        <h4 class="modal-title" style="color: #4cae4c;">Neuer EssPunkt</h4>
                    </div>
                    <div class="modal-body">
                        <div class="content">
                        <div class="row">
                            <div class="col-lg-3"><img class="logo-img" src="img/empty_logo.png" id="logoImage"><span class="btn btn-success btn-file" id="btnLogoFile"><label for="logo"></label>Logo Bild<input type="file" name="logo" id="logoInput"></span></div>
                            <div class="col-lg-9">
                                <form id="newPoint">
                                    <div class="form-group">
                                    <div class="col-lg-12"><input class="form-control" type="text" name="name" placeholder="Name" required=""></div>
                                    <div class="col-lg-12">
                                        <ul class="list-group customli">
                                            <li class="list-group-item custom">
                                                Mit Bestellung
                                                <div class="material-switch pull-right"><input id="someSwitchOptionSuccess" name="bes" type="checkbox"><label class="label-success" for="someSwitchOptionSuccess"></label></div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div class="col-lg-5"><input class="form-control" type="text" name="str" placeholder="Adr: Str"></div>
                                    <div class="col-lg-3"><input class="form-control" type="text" name="plz" placeholder="PLZ"></div>
                                    <div class="col-lg-4"><input class="form-control" type="text" name="ort" placeholder="Ort"></div>
                                    <div class="col-lg-12"><input class="form-control" type="text" name="tel" placeholder="Telefon"></div>
                                    <div class="col-lg-12"><input class="form-control" type="text" name="men" placeholder="Menü Link/Website"></div>
                                    <div class="col-lg-12"><input class="form-control" type="text" name="tag" placeholder="Tags (durch &quot;;&quot; getrennt)"></div>
                                    <div class="col-lg-3"><span class="btn btn-success btn-file"><label for="menufile"></label>Menu (PDF)<input type="file" name="menufile" id="menuFile"></span></div>
                                    <div class="col-lg-9 proginfo">
                                        <div class="progress" style="display:none;">
                                            <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">0%</div>
                                        </div>
                                    </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div class="modal-footer"><button class="btn btn-default" type="button" data-dismiss="modal" onclick="disableSave()">Abbrechen</button><button class="btn btn-success" id="saveConfigModal" type="button" onclick="saveNewEatPoint()">Speichern</button></div>
                </div>
            </div>
            </div>`

    var toAppend = document.getElementById('toAppend');
    $(toAppend).append(html);

    $('#newLocationModal').modal({
        backdrop: 'static',
        keyboard: false
    });
}
