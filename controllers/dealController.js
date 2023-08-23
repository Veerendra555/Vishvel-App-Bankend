require("dotenv").config();

const jwt = require("jsonwebtoken");
const users = require("../models/user");
const Deal = require("../models/deal");
const OTP = require("../models/otp");
const superagent = require("superagent");
const otp = require("../models/otp");
const Contact = require("../models/contacts");

const ContactController = require("./contactController");
const { ObjectId } = require('mongodb');

class DealController {
    constructor() {}

    getDeal(req) {
		return new Promise((resolve, reject) => {
			console.log(new Date())
			var start = new Date();
start.setHours(0,0,0,0);

var end = new Date();
end.setHours(23,59,59,999);
			let query ={date: {$gte: start, $lt: end}} ;
			Deal.find(query)
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

	getDealById(req) {
		return new Promise((resolve, reject) => {
			let query = {userid:req.params.userid };
			Deal.find(query)
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

    addDeal(req) {
        return new Promise(async(resolve, reject) => {
            if (!Object.keys(req.body).length) {
                reject({
                    code: 400,
                    msg: "No data passed in request body!!!",
                });
            } else if (
                !req.body.deal_image
            ) {
                reject({
                    code: 400,
                    msg: "Some of the required fields are missing!!!",
                });
            }else {
                let data = req.body;
                const regUser = await users.findById(data.userid);

                if (!regUser) {
                    throw new Error("User not found!!!");
                }
				else
				{
				let dealDetails = new Deal(data);
				dealDetails.save()
				.then((data) => {
					users
						.findByIdAndUpdate(data.userid, {
							exists: true,
						})
						.then(() => {
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

module.exports = new DealController();