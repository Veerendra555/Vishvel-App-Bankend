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
			ratingModel.findOneAndUpdate({_id:req.body._id},req.body).then(x=>{
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
							console.log("req.user._id",req.user._id,"req.query.to",req.query.to , contactLogUser)
						ContactLogType.findOne({$and:[{from: req.user._id},{businessid : contactLogUser._id}]}).then(x=>{
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




}

module.exports = new RatingController();














