window.onload = function() {
    waitingDialog.show();
    firebase.database().ref('tour').once('value').then(function(snapshot) {
        waitingDialog.hide();
        var parentObj = snapshot.val();
        
        var info = document.getElementById('info');
        var link = document.getElementById('link');
        
        var tmp = parentObj;
        if (tmp){
            info.value = tmp.text;
            link.value = tmp.link;
        } 

        var btn = document.getElementById('btn');
        btn.onclick = function() {
            firebase.database().ref('tour').set({
                link: link.value,
                text: info.value
              });
        };
    });
}