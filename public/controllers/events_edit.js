var file = null;
var storageRef = null;
var imageUrl = null;
var newRef = null;


function handleFileSelect(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  file = evt.target.files[0];
}

function postToDatabase(title, date, lecturer, room, descr) {
  var storageRef = firebase.storage().ref();
	if (file) {
	  var metadata = {
		  'contentType': file.type
		};
		var uploadTask = storageRef.child('images/events/' + newRef.key + "/" + file.name).put(file, metadata);
    uploadTask.on('state_changed', null, function(error) {
      alert('Upload failed:' + error);
      btn.button('reset');
    }, function() {
      imageUrl = uploadTask.snapshot.metadata.downloadURLs[0];
      var values = {
        title: title,
        date: date,
        lecturer: lecturer,
        room: room,
        description: descr,
        imageUrl: imageUrl
      };
      newRef.set(values, function(error) {
        if (error) {
          alert("Data could not be saved." + error);
        } else {
         var data = {};
					data.title = "title";
					data.message = "message";
					
					$.ajax({
						type: 'POST',
						data: JSON.stringify(data),
				        contentType: 'application/json',
                        url: '/events/create',						
                        success: function(data) {
                            btn.button('reset');
                            window.location.href = data;
                        }
                    });
        }
      });
    });
  } else {
      var values = {
        title: title,
        date: date,
        lecturer: lecturer,
        room: room,
        description: descr,
        imageUrl: imageUrl
      };
      console.log("dafaq");
      console.log(newRef);
      newRef.set(values, function(error) {
        if (error) {
          alert("Data could not be saved." + error);
        } else {
         var data = {};
					data.title = "title";
					data.message = "message";
					
					$.ajax({
						type: 'POST',
						data: JSON.stringify(data),
				        contentType: 'application/json',
                        url: '/events/create',						
                        success: function(data) {
                            btn.button('reset');
                            window.location.href = data;
                        }
                    });
        }
      });
  }
}

var btn = null;

function fillFields(id) {
  waitingDialog.show();
  newRef = firebase.database().ref('events').child(id);
  newRef.once('value').then(function(snapshot) {
    waitingDialog.hide();
    var parentObj = snapshot.val();
    console.log(parentObj);
    var title = document.getElementById('title');
    var datetimepicker = document.getElementById('datetimepicker');
    var lecturer = document.getElementById('lecturer');
    var room = document.getElementById('room');
    var descr = document.getElementById('descr');
    
    imageUrl = parentObj.imageUrl;
    title.value = parentObj.title;
    datetimepicker.value = parentObj.date;
    lecturer.value = parentObj.lecturer;
    room.value = parentObj.room;
    descr.value = parentObj.description;
  });  
}

window.onload = function() {
  document.getElementById('exampleInputFile').addEventListener('change', handleFileSelect, false);
  document.getElementById('exampleInputFile').disabled = false;
  var id = getQueryVariable("id");
  if (id)
    fillFields(id);
  $('#eventForm').submit(function () {
    var formObj = $(this);
    var title = formObj[0].elements["title"].value;
    var date = $('#datetimepicker').datetimepicker('getValue').valueOf();
    var lecturer = formObj[0].elements["lecturer"].value;
    var room = formObj[0].elements["room"].value;
    var descr = formObj[0].elements["descr"].value;
    postToDatabase(title, date, lecturer, room, descr);
    return false;
  });
  $('#btn').on('click', function () {
    btn = $(this).button('loading');
  });
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}