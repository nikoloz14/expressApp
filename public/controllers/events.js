
function toDateTime(secs) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setMilliseconds(secs);
    return t;
}

function deleteEvent(event, row) {
  var ref = firebase.database().ref('events/' + event.id);
  ref.remove(function(error) {
    if (error) {
      alert("Error on deletion. Try again later!");
    } else {
      // Create a reference to the file to delete
      var desertRef = firebase.storage().ref('images/events/'+event.id);
      
      // Delete the file
      desertRef.delete().then(function() {
        // File deleted successfully
      }).catch(function(error) {
        alert("Error on image deletion. Try again later! "+error);
      });
      row.parentNode.removeChild(row);
    }
  });
}

function addEventToTable(event, tableBody) {
  var tr = document.createElement('TR');
  var td = document.createElement('TD');
  td.className = "col-md-2";
  var text = document.createTextNode(event.title);
  td.appendChild(text);
  var td1 = document.createElement('TD');
  td1.className = "col-md-2";
  text = document.createTextNode(event.lecturer);
  td1.appendChild(text);
  var td2 = document.createElement('TD');
  td2.className = "col-md-1";
  text = document.createTextNode(event.room);
  td2.appendChild(text);
  var td3 = document.createElement('TD');
  td3.className = "col-md-3";
  text = document.createTextNode(event.description);
  td3.appendChild(text);
  var tdt = document.createElement('TD');
  tdt.className = "col-md-2";
  text = document.createTextNode(toDateTime(event.date));
  tdt.appendChild(text);
  var td4 = document.createElement('TD');
  td4.className = "col-md-3";
  var a = document.createElement('a');
  a.setAttribute("href", "#");
  a.className = 'pop';
  var img = document.createElement('img');
  img.setAttribute("style", "width:80px; height:80px;")
  img.src=event.imageURL;
  a.appendChild(img)
  td4.appendChild(a);
  var td5 = document.createElement('TD');
  td5.className = "col-md-1";
  var btn = document.createElement('button');
  btn.className = 'btn btn-danger btn-sm btndelete';
  btn.addEventListener("click", function() {
    deleteEvent(event, tr);
  }, false);
  btn.innerHTML = 'DELETE';
  td5.appendChild(btn);
  tr.appendChild(td);
  tr.appendChild(tdt);
  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);
  tr.appendChild(td5);
  tableBody.appendChild(tr);
}



window.onload = function() {
    waitingDialog.show();
    firebase.database().ref('events').once('value').then(function(snapshot) {
        waitingDialog.hide();
        var parentObj = snapshot.val();
        
        var tbl = document.getElementById('events');
        var tableBody = tbl.getElementsByTagName('tbody')[0];
        
        var arr = [];
        if (parentObj.constructor !== Array) {
          parentObj = $.map(parentObj, function(value, index) {
            return [value, index];
          });
        }
        console.log(parentObj);
        if (parentObj) {
            for (var i = 0; i < parentObj.length; i++) {
                var tmp = parentObj[i];
                if (tmp) 
                    addEventToTable(new Event(tmp.title,tmp.date,tmp.description,
                    tmp.imageUrl,tmp.lecturer,tmp.room,parentObj[++i]), tableBody);
            }
            $('.pop').on('click', function() {
        			$('.imagepreview').attr('src', $(this).find('img').attr('src'));
        			$('#imagemodal').modal('show');   
        		});
        }
    });
}