var fcm = require('fcm-notification');
var FCM = new fcm('./firebase.json'); 


exports.sendNotification = function (message) { //(message,cb)

    console.log(message);
    FCM.send(message, function (err, response) {
        console.log("FIRE BASE NOTIFICATION FUNCTION TRIGGERRED--------------------------------------");
        if (err) {
            console.log('error found', err);
        //    cb( {
        //     status : false,
        //     message : err
        // })
        } else {
            console.log('response here', response);
            // cb( {
            //     status : true,
            //     message : "Notification Sent Successfully...."
            // })
        } 
    })
}