require('dotenv').config();

const Tandc = require('../models/tandc');

class tandcController {
	constructor() {}

	getTandC(req) {
		return new Promise((resolve, reject) => {
			let query = {};
			Tandc.findOne(query)
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

	addTandC(req) {
		return new Promise(async (resolve, reject) => {
			console.log("req=====>",req)
			console.log("reqbody=====>",req.body)
			console.log("req user==============>",req.user)
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (!req.user._id) {
				reject({
					code: 400,
					msg: 'User id missing!!!',
				});
			}
			else if (
				!req.body.description
			) {
				reject({
					code: 400,
					msg: 'Description missing!!!',
				});
			}
			else {
				if(!!req.body._id)
				{
					Tandc.updateOne({ _id: req.body._id }, { $set: {description : req.body.description }}).then(async(data) => {					 
						resolve({
							code: 200,
							msg: "Terms And Conditions Details Updated Succesfully"
						});
					})
					.catch((err) => {
						reject({
							code: 500,
							msg: `${err}`,
						});
					});
				}
				else{
				const TandCDeatails = new Tandc({
					 userid: req.user._id,
					 description : req.body.description 
				});
				TandCDeatails.save()
					.then(async(data) => {					 
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
			}
		});
	}
}

module.exports = new tandcController();
