

window.onload = function() {
    waitingDialog.show();
    firebase.database().ref('forKids/meetings').once('value').then(function(snapshot) {
        waitingDialog.hide();
        var parentObj = snapshot.val();
        
        var date = document.getElementById('date');
        var info = document.getElementById('info');
        var link = document.getElementById('link');
        
        
            var tmp = parentObj;
            if (tmp){
                console.log(parentObj.length);
                console.log(tmp.dates);
                console.log(tmp.info);
                console.log(tmp.registerLink);
                date.value = tmp.dates;
                info.value = tmp.info;
                link.value = tmp.registerLink;
            } 

        
    });
}