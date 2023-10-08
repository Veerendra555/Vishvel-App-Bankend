require('dotenv').config();

const masterData = require('../models/masterData');

class masterDataController {
	constructor() {}

	getMasterData(req) {
		return new Promise((resolve, reject) => {
			let query = {type: req.query.type};
			console.log("query==>",query)
			masterData.findOne(query)
				.then((data) => {
					if (!data) {
						resolve({
							code: 204,
							msg: 'No Data found!!!',
							result:{}
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

	addMasterData(req) {
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
				!req.body.description && !req.body.type
			) {
				reject({
					code: 400,
					msg: 'Description missing!!!',
				});
			}
			else {
				if(!!req.body._id)
				{
					masterData.updateOne({$and:[{ _id: req.body._id },{type :req.body.type }]}, { $set: {description : req.body.description }}).then(async(data) => {					 
						resolve({
							code: 200,
							msg: `${req.body.type} Details Updated Succesfully`
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
				const masterDataDeatails = new masterData({
					 userid: req.user._id,
					 description : req.body.description,
					 type : req.body.type 
				});
				masterDataDeatails.save()
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

module.exports = new masterDataController();
