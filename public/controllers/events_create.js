var file = null;
var storageRef = null;




function handleFileSelect(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	file = evt.target.files[0];
}

function postToDatabase(title, date, lecturer, room, descr) {
	var storageRef = firebase.storage().ref();
	var newRef = firebase.database().ref('events/').push();
	if (file) {
		var metadata = {
			'contentType': file.type
		};
		var uploadTask = storageRef.child('images/events/' + newRef.key + "/" + "image").put(file, metadata);
		uploadTask.on('state_changed', null, function(error) {
			alert('Upload failed:' + error);
			btn.button('reset');
		}, function() {
			var url = uploadTask.snapshot.metadata.downloadURLs[0];
			var values = {
				title: title,
				date: date,
				lecturer: lecturer,
				room: room,
				description: descr,
				imageUrl: url
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
		btn.button('reset');
		alert("please upload image");
	}
}

var btn = null;

window.onload = function() {
	document.getElementById('exampleInputFile').addEventListener('change', handleFileSelect, false);
	document.getElementById('exampleInputFile').disabled = false;
	$('#eventForm').submit(function() {
		var formObj = $(this);
		var title = formObj[0].elements["title"].value;
		var date = $('#datetimepicker').datetimepicker('getValue').valueOf();
		var lecturer = formObj[0].elements["lecturer"].value;
		var room = formObj[0].elements["room"].value;
		var descr = formObj[0].elements["descr"].value;
		postToDatabase(title, date, lecturer, room, descr);
		return false;
	});
	$('#btn').on('click', function() {
		btn = $(this).button('loading');
	});
}