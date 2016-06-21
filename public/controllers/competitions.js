"use strict";
function deleteCompetition(competition, row) {
  var ref = firebase.database().ref('forKids/competitions/' + competition.id);
  ref.remove(function(error) {
    if (error) {
      alert("Error on deletion. Try again later!");
    } else {
      row.parentNode.removeChild(row);
    }
  });
}

function addCompetitionToTable(competition, tableBody) {
  var tr = document.createElement('TR');
  var td = document.createElement('TD');
  td.className = "col-md-6";
  var text = document.createTextNode(competition.name);
  td.appendChild(text);
  var td1 = document.createElement('TD');
  td1.className = "col-md-6";
  var text = document.createTextNode(competition.link);
  td1.appendChild(text);
  var td2 = document.createElement('TD');
  td2.className = "col-md-1";
  var btn = document.createElement('button');
  btn.className = 'btn btn-danger btn-sm btndelete';
  btn.addEventListener("click", function() {
    deleteCompetition(competition, tr)
  }, false);
  btn.innerHTML = 'DELETE';
  td2.appendChild(btn);
  tr.appendChild(td);
  tr.appendChild(td1);
  tr.appendChild(td2);
  tableBody.appendChild(tr);
}

function writeNewCompetition(title,link){
  var newRef = firebase.database().ref('forKids/competitions').push();

  newRef.set({name: title, registerLink: link}, function(error) {
    if (error) {
      alert("Data could not be saved." + error);
    } else {
      var tbl = document.getElementById('competitions');
      var tableBody = tbl.getElementsByTagName('tbody')[0];
      var competition = new Competition(title,link,newRef.key);
      addCompetitionToTable(competition, tableBody);
    }
  });
}

function initFormSubmit() {
  $('.createform').submit(function () {
    var formObj = $(this);
    var title = formObj[0].elements["title"].value;
    formObj[0].elements["title"].value = "";
    var link = formObj[0].elements["link"].value;
    formObj[0].elements["link"].value = "";
    
    writeNewCompetition(title,link);
    return false;
  });
}

window.onload = function() {
    waitingDialog.show();
    initFormSubmit();
    firebase.database().ref('forKids/competitions').once('value').then(function(snapshot) {
        waitingDialog.hide();
        var parentObj = snapshot.val();
        
        var tbl = document.getElementById('competitions');
        var tableBody = tbl.getElementsByTagName('tbody')[0];
        
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
                    addCompetitionToTable(new Competition(tmp.name,tmp.registerLink,parentObj[++i]), tableBody);
            }
        }
    });
}