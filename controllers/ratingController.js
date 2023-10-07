require('dotenv').config();
const ratingModel = require('../models/rating');

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
		ratingModel.find({to : req.query.to})			
				.then((userdata) => {
						console.log("User Data...",userdata)
						if (data.length == 0) {
							resolve({
								code: 204,
								msg: 'No Rating Found found!!!',
							});
						} else {
					    let finalData = {
							"_id": data._id,
							"from": data.from,
							"to": data.to,
							"rating": data.rating,
							"isActive": data.isActive,
							"createdAt": data.createdAt,
							"updatedAt": data.updatedAt,
							 totalRating : 0,
							 totalCount : userdata.length
						}	
					   for(let i=0;i<userdata.length;i++)
					   {
						finalData.totalRating += userdata[i].rating;
					   }		
							resolve({
								code: 200,
								result: finalData,
							});
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














