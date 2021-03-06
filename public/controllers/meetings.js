window.onload = function() {
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			waitingDialog.show();
			firebase.database().ref('forKids/meetings').once('value').then(function(snapshot) {
				waitingDialog.hide();
				var parentObj = snapshot.val();

				var date = document.getElementById('date');
				var info = document.getElementById('info');
				var link = document.getElementById('link');

				var tmp = parentObj;
				if (tmp) {
					date.value = tmp.dates;
					info.value = tmp.info;
					link.value = tmp.registerLink;
				}

				var btn = document.getElementById('btn');
				btn.onclick = function() {
					firebase.database().ref('forKids/meetings').set({
						dates: date.value,
						info: info.value,
						registerLink: link.value
					});
				};
			});
		} else {
			var cont = document.getElementById("container");
			cont.innerHTML = '<div class="center"><h1>Permission Denied</h1><p>Please Log-in to use this feature</p></div>';
		}
	});
}