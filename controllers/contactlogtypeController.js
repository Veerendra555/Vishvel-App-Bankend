require('dotenv').config();

const ContactLogType = require('../models/contactlogtype');
const userDetails = require("../models/userdetail")
const user = require("../models/user")

class ContactlogtypeController {
	constructor() {}

	getContactLogType(req) {
		return new Promise((resolve, reject) => {
		ContactLogType.find({userid: req.query.userid}).populate('businessid').lean()
				.then((data) => {
					if (data.length == 0) {
						resolve({
							code: 204,
							msg: 'No details found!!!',
						});
					} else {
					// userDetailsData = [...data];	
				    console.log(data);
				// 	for (let i=0;i<= data.length;i++) {
				// userDetails.findOne({userid : data[i].businessid}).lean()
                //     .then((detail) => {
				// 		console.log("detail",detail);
				// 		console.log("userDetailsData",userDetailsData);
				// 		console.log("userDetailsData[i]",userDetailsData[i]);
						
                //         if (detail != null || detail != undefined) {
				// 		console.log("Inside detail")
				// 		userDetailsData[i].businessuser = detail;
				// 	    //   data.businessid = detail;
                //         }
                //     })
                //     .catch((err) =>
                //         reject({
                //             code: 500,
                //             msg: `${err}`,
                //         })
                //     );
				// 	}				
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

}

module.exports = new ContactlogtypeController();
