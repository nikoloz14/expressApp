

window.onload = function() {
    waitingDialog.show();
    firebase.database().ref('forKids/meetings').once('value').then(function(snapshot) {
        waitingDialog.hide();
        var parentObj = snapshot.val();
        
        var date = document.getElementById('date');
        var info = document.getElementById('info');
        var link = document.getElementById('link');
        
        var arr = [];
        if (parentObj.constructor !== Array) {
          parentObj = $.map(parentObj, function(value, index) {
            return [value, index];
          });
        }
        if (parentObj) {
            var tmp = parentObj[0];
            if (tmp){
                date.textContent = tmp.dates;
                info.textContent = tmp.info;
                link.textContent = tmp.registerLink;
            } 

        }
    });
}