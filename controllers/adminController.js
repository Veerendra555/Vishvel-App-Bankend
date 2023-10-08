require('dotenv').config();

const adminData = require('../models/admin');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

class adminDataController {
	constructor() {}

	getadminData(req) {
		return new Promise((resolve, reject) => {
			let query = {type: req.query.type};
			console.log("query==>",query)
			adminData.findOne(query)
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

	getTokens(data) {
        return new Promise((resolve, reject) => {
            let token = jwt.sign({
                    _id: data._id,
                    mob_no: data.mob_no,
                },
                process.env.JWT_SECRET, {
                    expiresIn: "1y",
                }
            );
            // let refrestToken = jwt.sign({
            //         _id: data._id,
            //         mob_no: data.mob_no,
            //     },
            //     process.env.JWT_REFRESH_SECRET, {
            //         expiresIn: "1y",
            //     }
            // );
            if (token) {
                resolve({
                    token,
                });
            } else {
                reject(`Error in generating tokens....`);
            }
        });
    }

	addAdminData(req) {
		return new Promise(async (resolve, reject) => {
			console.log("req=====>",req)
			console.log("reqbody=====>",req.body)
			console.log("req user==============>",req.user)
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			}
			else if (
				!req.body.username || !req.body.email ||
				!req.body.mob_no || !req.body.password
			) {
				reject({
					code: 400,
					msg: 'User Data is missing!!!',
				});
			}
			else {
				if(!!req.body._id)
				{
					delete req.body.password;
					adminData.updateOne({$and:[{ _id: req.body._id }]}, { $set: req.body}).then(async(data) => {					 
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
				const salt = await bcrypt.genSalt(10);		
				const adminDataDeatails = new adminData({
					username : req.body.username,
					email : req.body.email,
					mob_no : req.body.mob_no,
					password : await bcrypt.hashSync(req.body.password, salt),
				});
				adminDataDeatails.save()
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

	loginAdmin(req) {
		return new Promise(async (resolve, reject) => {
			
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			}
			else if (
				!req.body.email || !req.body.password
			) {
				reject({
					code: 400,
					msg: 'User Data is missing!!!',
				});
			}
			else {
				var user = await adminData
				.findOne({
					email: req.body.email,
					isActive: true
				})
				.then((r) => r)
				.catch((err) => {
					console.log(err)
					reject(`${err}`);
				});
				if(user)
				{
					console.log(user,"==>")
					const pwdMatch = await bcrypt.compare(req.body.password, user.password);
				  if(pwdMatch)	
				  {
					await this.getTokens(user).then((data)=>{
						resolve({
							user,
							data,
						});
					}).catch(error=>{
						console.log("Error Block Caling..4",error)
						reject(`Server Issue!!!!!!`);
						// reject({
						// 	code: 400,
						// 	msg: 'Password Missmatch!!!',
						// });
					});	
				  }
				  else{
					reject(`Password Missmatch!!!!!!`);
				  }

				}
				else{
					console.log("Error Block Caling..4")
					reject(`User Not Found Please Contact Super Admin!!!`);
					// reject({
					// 	code: 400,
					// 	msg: 'Please Contact Super Admin!!!',
					// });
				}
			}
		});
	}

}

module.exports = new adminDataController();
