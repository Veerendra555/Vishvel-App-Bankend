require('dotenv').config();

const ContactLogType = require('../models/contactlogtype');
const userDetails = require("../models/userdetail")
const user = require("../models/user")
const { ObjectId } = require('mongoose').Types;


class ContactlogtypeController {
	constructor() {}

	getContactLogType(req) {
		return new Promise((resolve, reject) => {
		
        userDetails.findOne({userid: req.query.userid}).
		then((userData) => {
			if (userData == null || userData == undefined) {
				resolve({
					code: 204,
					msg: 'No details found!!!',
				});
			} else {
			 userDetails.find({$or:[{ mob_no : { $in: userData.blocked}},{ blocked: { $in: userData.mob_no }  }]}, {_id:1}).
			 then((userBlockedData) => {
			 console.log("userBlockedData",userBlockedData)
			let blockedListUsers,tempList = [];
		    for(let i=0;i<userBlockedData.length;i++)
			{
			tempList.push(userBlockedData[i]._id.toString())
			}
			blockedListUsers = tempList.map(id => new ObjectId(id));
			console.log("blockedListUsers==>",blockedListUsers)
			 ContactLogType.find({$and:[{userid: req.query.userid},{ businessid : { $nin: blockedListUsers } }]}).populate('businessid').lean().sort({createdAt:-1})
			 .then((data) => {
				 if (data.length == 0) {
					 resolve({
						 code: 204,
						 msg: 'No details found!!!',
					 });
				 } else {
				 // userDetailsData = [...data];	
				 console.log(data);			
					 resolve({
						 code: 200,
						 result: data,
					 });
				 }
			 })
			 .catch((err) =>
				 reject({
					 code: 500,
					 msg: `${err}`,
				 })
			 );
		})
			.catch((err) =>
				reject({
					code: 500,
					msg: `${err}`,
				})
			);
				 
			}
		})
		.catch((err) =>
			reject({
				code: 500,
				msg: `${err}`,
			})
		);
		});
	}


	addContactLogType(req, res) {
		ContactLogType.addContactLog(req)
		  .then((data) => {
			if (data.code == 204) {
			  res
				.status(200)
				.json(resHandler(data.code, data.result ? data.result : data.msg));
			} else {
			  res
				.status(data.code)
				.json(resHandler(data.code, data.result ? data.result : data.msg));
			}
		  })
		  .catch((error) => {
			res.status(error.code).json(resHandler(error.code, error.msg));
		  });
	  }


	  addContactLog(req) {
        return new Promise(async(resolve, reject) => {
            if (!Object.keys(req.body).length) {
                reject({
                    code: 400,
                    msg: "No data passed in request body!!!",
                });
            }else {
                let data = req.body;
                const regUser = await user.findById(data.userid);

                if (!regUser) {
                    throw new Error("User not found!!!");
                }
				else
				{
				let contactDetails = new ContactLogType(data);
				contactDetails.save()
				.then((data) => {
					resolve({
						code: 200,
						result: data,
					});
					// users
					// 	.findByIdAndUpdate(data.userid, {
					// 		exists: true,
					// 	})
					// 	.then(() => {
					// 		resolve({
					// 			code: 200,
					// 			result: data,
					// 		});
					// 	})
					// 	.catch((err) => {
					// 		reject({
					// 			code: 500,
					// 			msg: `${err}`,
					// 		});
					// 	});
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

	
	updateContactLog(req) {
        return new Promise(async(resolve, reject) => {
            if (!Object.keys(req.body).length) {
                reject({
                    code: 400,
                    msg: "No data passed in request body!!!",
                });
            }else {
                let data = req.body;
                const regUser = await user.findById(data.userid);

                if (!regUser) {
                    throw new Error("User not found!!!");
                }
				else
				{
				ContactLogType.updateMany({$and:[{businessid:req.body.businessid},{userid:req.body.userid}]},{ $set: {fav_status : req.body.fav_status }}).then(x=>{
                    resolve({
                        code: 200,
                        msg: "Favourite Status Updated successfully",
                    });
                }).catch(err=>{
                    reject({
                        code: 400,
                        Error: `${err}`,
                    });
                })
				}
            }
        });
    }

}

module.exports = new ContactlogtypeController();
