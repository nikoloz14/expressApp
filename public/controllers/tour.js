window.onload = function() {
    waitingDialog.show();
    firebase.database().ref('tour').once('value').then(function(snapshot) {
        waitingDialog.hide();
        var parentObj = snapshot.val();
        
        var info = document.getElementById('info');
        var link = document.getElementById('link');
        console.log(parentObj);
            var tmp = parentObj;
                info.value = tmp.text;
                link.value = tmp.link;

        
    });
}