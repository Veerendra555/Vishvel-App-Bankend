const router = require('express').Router();
const checkAuth = require('../middlewares/auth');
const multer = require("multer");
let resHandler = require('../handlers/responseHandler');
const adminController = require('../controllers/adminController');


function getFirebaseNotification(req, res) {
	adminController.getFirebaseNotification(req)
		.then((data) => {
			if (data.code == 204) {
				res.status(200).json(
					resHandler(data.code, data.result ? data.result : data.msg)
				);
			} else {
				res.status(data.code).json(
					resHandler(data.code, data.result ? data.result : data.msg)
				);
			}
		})
		.catch((error) => {
			res.status(error.code).json(resHandler(error.code, error.msg));
		});
}

function addAdmin(req, res) {
	adminController.addAdminData(req)
		.then((data) => {
			if (data.code == 204) {
				res.status(200).json(
					resHandler(data.code, data.result ? data.result : data.msg)
				);
			} else {
				res.status(data.code).json(
					resHandler(data.code, data.result ? data.result : data.msg)
				);
			}
		})
		.catch((error) => {
			res.status(error.code).json(resHandler(error.code, error.msg));
		});
}

function loginAdmin(req, res) {
	adminController.loginAdmin(req)
    .then(data => {
        console.log("Data in Router",data)
        res.status(200).json(resHandler(200, data));
    })
    .catch(error => {
        console.log("Error in Router",error)
        res.status(500).json(resHandler(500, error));
    });
}



// function updateFeed(req, res) {
// 	adminController.updateFeed(req)
// 		.then((data) => {
// 			if (data.code == 204) {
// 				res.status(200).json(
// 					resHandler(data.code, data.result ? data.result : data.msg)
// 				);
// 			} else {
// 				res.status(data.code).json(
// 					resHandler(data.code, data.result ? data.result : data.msg)
// 				);
// 			}
// 		})
// 		.catch((error) => {
// 			res.status(error.code).json(resHandler(error.code, error.msg));
// 		});
// }

// router.get('/', checkAuth, getFirebaseNotification);

router.post(
	'/',
	addAdmin
);

router.post(
	'/login',
	loginAdmin
);



module.exports = router;
