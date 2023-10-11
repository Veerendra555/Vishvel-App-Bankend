require('dotenv').config();
const ratingModel = require('../models/rating');
const ContactLogType = require('../models/contactlogtype');

const userDetails = require("../models/userdetail")
const user = require("../models/user");
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

class RatingController {
	constructor() {}

    addRating(req) {
        return new Promise(async(resolve, reject) => {
            if (!Object.keys(req.body).length) {
                reject({
                    code: 400,
                    msg: "No data passed in request body!!!",
                });
            }else {
                req.body.from = req.user._id;
                let data = req.body;
                const regUser = await user.findById(data.to);

                if (!regUser) {
                    throw new Error("User not found!!!");
                }
				else
				{
				let ratingDetails = new ratingModel(data);
				ratingDetails.save()
				.then((data) => {
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


    editRating(req) {
		return new Promise(async (resolve, reject) => {
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (!req.body._id) {
				reject({
					code: 400,
					msg: '_id missing!!!',
				});
			} else {
			ratingModel.findOneAndUpdate({_id:req.body._id},req.body)
			.then(x=>{
                    resolve({
                        code: 200,
                        msg: "Rating Updated successfully",
                    });
                }).catch(err=>{
                    reject({
                        code: 400,
                        Error: `${err}`,
                    });
                })
				
			}
		});
	}

    getRating(req) {
		return new Promise((resolve, reject) => {
			ratingModel.findOne({$and:[{from: req.user._id},{to : req.query.to}]})
				.then(async(data) => {
					console.log("Data...",data)
					if (!data) {
						resolve({
							code: 204,
							msg: 'No Rating Found!!!',
						});
					}
		   ratingModel.find({to : req.query.to})			
				.then(async(userdata) => {
						console.log("User Data...",userdata)
						if (userdata.length == 0) {
							resolve({
								code: 204,
								msg: 'No Rating Found!!!',
							});
						} else {
							let contactLogUser = await userDetails.findOne({userid : req.query.to});
							console.log("req.user._id",req.user._id,"req.query.to",contactLogUser._id , contactLogUser)
						ContactLogType.findOne({$and:[{userid: req.user._id},{businessid : contactLogUser._id}]}).then(x=>{
							let finalData ={}
							console.log("X===>",x);
							  if(x == null || x == undefined)
							  {
								finalData = {
									"_id": data._id,
									"from": data.from,
									"to": data.to,
									"template_position": userdata.template_position || 0,
									"fav_status": false,
									"rating": data.rating,
									"isActive": data.isActive,
									"createdAt": data.createdAt,
									"updatedAt": data.updatedAt,
									 totalRating : 0,
									 totalCount : userdata.length
								}	
							  }
							  else
							  {
								finalData = {
									"_id": data._id,
									"from": data.from,
									"to": data.to,
									"template_position": userdata.template_position || 0,
									"rating": data.rating,
									"fav_status": x.fav_status,
									"isActive": data.isActive,
									"createdAt": data.createdAt,
									"updatedAt": data.updatedAt,
									 totalRating : 0,
									 totalCount : userdata.length
								}	
							  }	
							   for(let i=0;i<userdata.length;i++)
							   {
								finalData.totalRating += userdata[i].rating;
							   }		
									resolve({
										code: 200,
										result: finalData,
									});
							}).catch(err=>{
								reject({
									code: 400,
									Error: `${err}`,
								});
							})
						}
					 })
					 .catch((err) => {
						reject({
							code: 500,
							msg: `${err}`,
						});
					});
				})
				.catch((err) => {
					reject({
						code: 500,
						msg: `${err}`,
					});
				});
		});
	}


	getRatingNew(req) {
		return new Promise((resolve, reject) => {
			let finalData = {
				from:  req.user._id,
				to: req.query.to,
				fav_status : false,
				template_position : 0,
				rating : 0,
				total_count : 0,
				followers_count : 0
			}

			ratingModel.findOne({$and:[{from: req.user._id},{to : req.query.to}]})
				.then(async(data) => {
					console.log("Data...",data)
					// if (!data) {
					// 	resolve({
					// 		code: 204,
					// 		msg: 'No Rating Found!!!',
					// 	});
					// }
		   ratingModel.find({to : req.query.to})			
				.then(async(userdata) => {
					    if(data != null && data != undefined)
					    finalData = {...finalData, rating : data.rating };
						console.log("finalData1",finalData)
						console.log("User Data...",userdata)
						// if (userdata.length == 0) {
						// 	resolve({
						// 		code: 204,
						// 		msg: 'No Rating Found!!!',
						// 	});
						// } else {
							let contactLogUser = await userDetails.findOne({userid : req.query.to});
							console.log("req.user._id",req.user._id,"req.query.to",contactLogUser._id , contactLogUser)
						ContactLogType.findOne({$and:[{userid: req.user._id},{businessid : contactLogUser._id}]}).then(async x=>{
						await ContactLogType.find({businessid : contactLogUser._id}).then(async uniqueData=>{
							console.log(uniqueData,"uniqueData===>");
                            
							let uniqueSet = [... new Map(uniqueData.map(item => [item.userid.toString() , item])).values()];


							console.log("uniqueSet",uniqueSet)


// 							const uniqueMap = new Map();
// uniqueData.forEach(item => {
//   uniqueMap.set(item.businessid, item);
// });

// // Convert uniqueMap values back to an array
// const uniqueArray = Array.from(uniqueMap.values());

// console.log(uniqueArray);

							for(let i=0;i<uniqueSet.length;i++)
							{
								if(uniqueSet[i].fav_status)
								finalData = {...finalData, followers_count : finalData.followers_count+1 }

								// await	ContactLogType.findOne({businessid : uniqueData[i]}).then(details=>{
								// 	console.log(details,"details--->")
								// 	   if(details !=null &&details != undefined )
								// 	    {
								// 		  if(details.fav_status)
								// 		  finalData = {...finalData, followers_count : finalData.followers_count+1 }
								// 		}
								// }).catch(err=>{
								// 	 console.log(err)
								// })
							}
							console.log("X===>",x);
							if(x == null || x == undefined)
							{
							  finalData = {
								  ...finalData,
								  "template_position": contactLogUser.template_position || 0,
								   total_rating : 0,
								   total_count : userdata != null && userdata != undefined ?  userdata.length : 0
							  }	
							}
							else
							{
							  if(data == null)
							  {
								finalData = {
									...finalData,
									"template_position": contactLogUser.template_position || 0,
									"fav_status": x.fav_status,
									 total_rating : 0,
									 total_count : userdata != null && userdata != undefined ?  userdata.length : 0
								}	
							  }	
							  else{
								finalData = {
								...finalData,
								"_id": data != null && data != undefined ? data._id : '',
								"from": data.from,
								"to": data.to,
								"template_position": contactLogUser.template_position || 0,
								"rating": data.rating,
								"fav_status": x.fav_status,
								"isActive": data.isActive,
								"createdAt": data.createdAt,
								"updatedAt": data.updatedAt,
								 total_rating : 0,
								 total_count : userdata != null && userdata != undefined ?  userdata.length : 0
								}
							  }
							
							}	
							 for(let i=0;i<userdata.length;i++)
							 {
							  finalData.total_rating += userdata[i].rating;
							 }
								  resolve({
									  code: 200,
									  result: finalData,
								  });
						}).catch(err=>{
							console.log("Error 1",err)
							reject({
								code: 400,
								Error: `${err}`,
							});
						})
							}).catch(err=>{
								console.log("Error 2",err)
								reject({
									code: 400,
									Error: `${err}`,
								});
							})
						// }
					 })
					 .catch((err) => {
						console.log("Error 3",err)
						reject({
							code: 500,
							msg: `${err}`,
						});
					});
				})
				.catch((err) => {
					console.log("error 4",err)
					reject({
						code: 500,
						msg: `${err}`,
					});
				});

		});
	}



}

module.exports = new RatingController();














