require('dotenv').config();

const Firebase = require('../models/firebase');
const UserDetail = require('../models/userdetail');
const firebaseNotification = require("../middlewares/firebase")

class firbaseController {
	constructor() {}

	getFirebaseNotification(req) {
		return new Promise((resolve, reject) => {
			let query = {};
			Firebase.find(query).sort({
				updatedAt:-1
			})
				.then((data) => {
					if (data.length == 0) {
						resolve({
							code: 204,
							msg: 'No feed found!!!',
						});
					} else {
						resolve({
							code: 200,
							result: data,
						});
					}
				})
				.catch((err) => {
					reject({
						code: 500,
						msg: `${err}`,
					});
				});
		});
	}

	addFirebaseNotification(req) {
		return new Promise(async (resolve, reject) => {
			console.log("req=====>",req)
			console.log("reqbody=====>",req.body)
			console.log("req user==============>",req.user)
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (!req.body.userid) {
				reject({
					code: 400,
					msg: 'User id missing!!!',
				});
			}
			else if (
				!req.body.title ||
				!req.body.description
				// || !req.body.businesslogo
			) {
				reject({
					code: 400,
					msg: 'Title or Description missing!!!',
				});
			}
			else {
				let data = req.body;
				const firebase = new Firebase(data);
				firebase.save()
					.then(async(data) => {
						UserDetail.find({})
						.then(async(userData) => {
							if (userData.length == 0) {
								// resolve({
								// 	code: 204,
								// 	msg: 'No feed found!!!',
								// });
							} else {
							for(let i =0;i<userData.length;i++)
							{
								if(userData[i].firebase_token != null && userData[i].firebase_token != undefined  )
								{
								var message = {
									data: {
										"click_action": "FLUTTER_NOTIFICATION_CLICK",
										"url":"./firebase.json",
										"sound": "default",
										"status": "done",
										// "screen": "screenA",
										// "orderId": JSON.stringify(orderData)
										// "description" : `${innerText}`,
										//     "departmentName" : `${ticketData.deptName}`,
										//      status : `${ticketData.status.status_name}`,
										//      creationDate: `${ticketData.creationDate}`
									},
									notification: {
										title: req.body.title,
										body:  req.body.description            
									},
									token : userData[i].firebase_token,
								};
					           await firebaseNotification.sendNotification(message);
							 }
							}	
							}
						})
						.catch((err) => {
							reject({
								code: 500,
								msg: `${err}`,
							});
						});
					  console.log(message); 
					 
						resolve({
							code: 200,
							result: data,
						});
					})
					.catch((err) => {
						reject({
							code: 500,
							msg: `${err}`,
						});
					});
			}
		});
	}

	deleteFeed(req) {
		return new Promise(async (resolve, reject) => {
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (!req.body.userid) {
				reject({
					code: 400,
					msg: 'User id missing!!!',
				});
			} else if (!req.body.id) {
				reject({
					code: 400,
					msg: 'Firebase id missing!!!',
				});
			} else {
				await UserDetail.find({
					userid: req.body.userid,
				})
					.then(async (user) => {
						if (user.length == 0) {
							reject({
								code: 400,
								msg: `User not found!!!`,
							});
						} else {
							await Firebase.find({
								_id: req.body.id,
								userid: req.body.userid,
							})
								.then((feeds) => {
									if (feeds.length == 0) {
										reject({
											code: 400,
											msg: `Firebase not found!!!`,
										});
									} else {
										Firebase.remove({
											_id: req.body.id,
											userid: req.body.userid,
										})
											.then(() => {
												resolve({
													code: 200,
													result: 'Firebase removed!!!',
												});
											})
											.catch((err) => {
												reject({
													code: 500,
													msg: `${err}`,
												});
											});
									}
								})
								.catch((err) => {
									reject({
										code: 500,
										msg: `${err}`,
									});
								});
						}
					})
					.catch((err) => {
						reject({
							code: 500,
							msg: `${err}`,
						});
					});
			}
		});
	}
}

module.exports = new firbaseController();
