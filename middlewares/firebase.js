var fcm = require('fcm-notification');
var FCM = new fcm('./firebase.json'); 


exports.sendNotification = function (message) { //(message,cb)
    return new Promise((resolve, reject) => {
    console.log(message);
    FCM.send(message, function (err, response) {
        console.log("FIRE BASE NOTIFICATION FUNCTION TRIGGERRED--------------------------------------");
        if (err) {
            console.log('error found', err);
            reject({
                code: 500,
                msg: `${err}`,
            });
            // return true;
        //    cb( {
        //     status : false,
        //     message : err
        // })
        } else {
            console.log('response here', response);
            resolve({
                code: 200,
                msg: 'Push Notification Added Successfully',
            });
            // return false;
            // cb( {
            //     status : true,
            //     message : "Notification Sent Successfully...."
            // })
        } 
    })
  })
}