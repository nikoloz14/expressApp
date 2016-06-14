"use strict";
var btn = null;

window.onload = function() {
    waitingDialog.show();
    initLoadBtn();
    initFormSubmit();
    firebase.database().ref('programmes/').once('value').then(function(snapshot) {
        waitingDialog.hide();
        var obj = snapshot.val();
        console.log(obj);
        var bachelorObj = obj.bachelor;
        var masterObj = obj.master;
        var phdObj = obj.phd;
        var profObj = obj.prof;
        
        var bachelorProgType = fillWithArray(bachelorObj, "bachelor");
        var masterProgType = fillWithArray(masterObj, "master");
        var phdProgType = fillWithArray(phdObj, "phd");
        var profProgType = fillWithArray(profObj, "prof");
        
        var programmesList = new ProgrammesList(bachelorProgType, masterProgType, phdProgType, profProgType);
        
        fillTables(programmesList);
    });
}

function fillTables(programmesList) {
  fillTable("bachelorfree", programmesList.bachelor.freeuni);
  fillTable("bacheloragr", programmesList.bachelor.agruni);
  fillTable("masterfree", programmesList.master.freeuni);
  fillTable("masteragr", programmesList.master.agruni);
  fillTable("phdfree", programmesList.phd.freeuni);
  fillTable("phdagr", programmesList.phd.agruni);
  fillTable("proffree", programmesList.prof.freeuni);
  fillTable("profagr", programmesList.prof.agruni);
}

function fillTable(id, arr) {
     // this should be inside the first loop
    var tbl = document.getElementById(id);
    var tableBody = tbl.getElementsByTagName('tbody')[0];
    
    for (var i = 0; i < arr.length; i++) {
      addProfToTable(arr[i], tableBody);
    }
}

function deleteProg(prog, row) {
  var ref = firebase.database().ref('programmes/' + prog.progType + "/" + prog.progSchool + "/" + prog.id);
  ref.remove(function(error) {
    if (error) {
      alert("Error on deletion. Try again later!");
    } else {
      row.parentNode.removeChild(row);
    }
  });
}

function addProfToTable(prog, tableBody) {
  var tr = document.createElement('TR');
  var td = document.createElement('TD');
  td.className = "col-md-11";
  var text = document.createTextNode(prog.name);
  td.appendChild(text);
  var td2 = document.createElement('TD');
  td2.className = "col-md-1";
  var btn = document.createElement('button');
  btn.className = 'btn btn-danger btn-sm btndelete';
  btn.addEventListener("click", function() {
    deleteProg(prog, tr)
  }, false);
  btn.innerHTML = 'DELETE';
  td2.appendChild(btn);
  tr.appendChild(td);
  tr.appendChild(td2);
  tableBody.appendChild(tr);
}

function fillWithArray(parentObj, progType) {
    var freeuniObj = parentObj.freeuni;
    var agruniObj = parentObj.agruni;
    
    var freeuniArr = fill(freeuniObj, progType, "freeuni");
    var agruniArr = fill(agruniObj, progType, "agruni");
    
    var finalObj = new ProgrammeType(freeuniArr, agruniArr);
    return finalObj;
}

function fill(parentObj, progType, progSchool) {
    var arr = [];
    if (parentObj.constructor !== Array) {
      parentObj = $.map(parentObj, function(value, index) {
        return [value, index];
      });
    }
    if (parentObj) {
        for (var i = 0; i < parentObj.length; i++) {
            var tmp = parentObj[i];
            if (tmp) 
                arr.push(new Programme(tmp.name, parentObj[++i], progType, progSchool));
        }
    }
    return arr;
}


function initLoadBtn() { 
  $('.btnload').on('click', function () {
    btn = $(this).button('loading');
  });
}

function initFormSubmit() {
  $('.createform').submit(function () {
    var formObj = $(this);
    var title = formObj[0].elements["title"].value;
    formObj[0].elements["title"].value = "";
    var prog = formObj[0].elements["prog"].value;
    var school = formObj[0].elements["school"].value;
    var tableId = formObj[0].elements["tableid"].value;
    writeNewProgramme(title, prog, school, tableId);
    return false;
  });
}

function writeNewProgramme(title, prog, school, tableId) {
  var newRef = firebase.database().ref('programmes/' + prog + "/" + school).push();

  newRef.set({name: title}, function(error) {
    if (error) {
      alert("Data could not be saved." + error);
    } else {
      var tbl = document.getElementById(tableId);
      var tableBody = tbl.getElementsByTagName('tbody')[0];
      var res = getProgTypeAndSchoolFromId(tableId);
      var prog = new Programme(title, newRef.key);
      addProfToTable(prog, tableBody);
      btn.button('reset');
    }
  });
}
  
function getProgTypeAndSchoolFromId(tableId) {
  switch (tableId) {
    case "bachelorfree":
      return ["bachelor", "freeuni"];
    case "bacheloragr":
      return ["bachelor", "agruni"];
    case "masterfree":
      return ["master", "freeuni"];
    case "masteragr":
      return ["master", "agruni"];
    case "phdfree":
      return ["phd", "freeuni"];
    case "phdagr":
      return ["phd", "agruni"];
    case "proffree":
      return ["prof", "freeuni"];
    case "profagr":
      return ["prof", "agruni"];
  }
}