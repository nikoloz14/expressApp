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
			var desertRef = firebase.storage().ref().child('images/events/' + event.id + '/image');

			// Delete the file
			desertRef.delete().then(function() {
				// File deleted successfully
			}).catch(function(error) {
				alert("Error on image deletion. Try again later! " + error + ">>" + desertRef.name);
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
	text = document.createTextNode(event.descript);
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
	img.src = event.imageURL;
	a.appendChild(img)
	td4.appendChild(a);
	var td5 = document.createElement('TD');
	td5.className = "col-md-1";
	/*<div class="dropdown">
	  <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Dropdown Example
	  <span class="caret"></span></button>
	  <ul class="dropdown-menu">
	    <li><a href="#">HTML</a></li>
	    <li><a href="#">CSS</a></li>
	    <li><a href="#">JavaScript</a></li>
	  </ul>
	</div>*/
	var div = document.createElement('div');
	/*div.innerHTML = '<div class="dropdown">\
	  <button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown">Action\
	  <span class="caret"></span></button>\
	  <ul class="dropdown-menu">\
	    <li id="editevent"><a href="#">Edit</a></li>\
	    <li id="deleteevent"><a href="#">Delete</a></li>\
	  </ul>\
	</div>'*/

	div.className = "dropdown";
	var btn = document.createElement('button');
	btn.className = 'btn btn-primary dropdown-toggle';
	btn.setAttribute("data-toggle", "dropdown");
	btn.setAttribute("type", "button");
	btn.innerHTML = 'Action <span class="caret"></span>';
	div.appendChild(btn);
	var ul = document.createElement('ul');
	ul.className = "dropdown-menu";
	var li1 = document.createElement('li');
	var a1 = document.createElement("a");
	a1.setAttribute("href", "/events/edit?id=" + event.id);
	a1.innerHTML = "Edit";
	li1.appendChild(a1);
	var li2 = document.createElement('li');
	var a2 = document.createElement("a");
	a2.setAttribute("href", "#");
	a2.innerHTML = "Delete";
	li2.appendChild(a2);
	li2.addEventListener("click", function() {
		deleteEvent(event, tr);
	}, false);
	ul.appendChild(li1);
	ul.appendChild(li2);
	div.appendChild(ul);
	td5.appendChild(div);
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
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
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
				if (parentObj) {
					for (var i = 0; i < parentObj.length; i++) {
						var tmp = parentObj[i];
						if (tmp)
							addEventToTable(new Event(tmp.title, tmp.date, tmp.description,
								tmp.imageUrl, tmp.lecturer, tmp.room, parentObj[++i]), tableBody);
					}
					$('.pop').on('click', function() {
						$('.imagepreview').attr('src', $(this).find('img').attr('src'));
						$('#imagemodal').modal('show');
					});
				}
			});
		} else {
			var cont = document.getElementById("container");
			cont.innerHTML = '<div class="center"><h1>Permission Denied</h1><p>Please Log-in to use this feature</p></div>';
		}
	});
}