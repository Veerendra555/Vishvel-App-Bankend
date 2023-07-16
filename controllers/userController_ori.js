require('dotenv').config();

const jwt = require('jsonwebtoken');
const users = require('../models/user');
const UserDetails = require('../models/userdetail');
const OTP = require('../models/otp');
const superagent = require('superagent');
const otp = require('../models/otp');

class UserController {
	constructor() {}

	otpGenerate(req) {
		return new Promise(async (resolve, reject) => {
			var mob = req.body.mob;
			if (!mob) {
				reject('Mobile number missing!!!');
			} else {
				try {
					let randNum = '000000';
					const textMsg = `Your verification code is ${randNum}.`;

					const user = await users
						.findOne({
							mob_no: mob,
						})
						.then((r) => r)
						.catch((err) =>
							reject({
								code: 500,
								msg: `${err}`,
							})
						);

					if (!user) {
						const user = new users({
							mob_no: mob,
							exists: false,
						});
						await user
							.save()
							.then(async (userData, err) => {
								if (err) {
									throw err;
								}

								let url = `https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=${process.env.MSGKEY}&senderid=${process.env.SENDERID}&channel=2&DCS=0&flashsms=0&number=91${mob}&text=${textMsg}&route=1`;
								const res = await superagent.post(url);
								var result = JSON.parse(res.text);
								if (result.ErrorMessage == 'Success') {
									const data = {
										userid: userData._id,
										otp: randNum,
										isverified: false,
									};

									const otp = new OTP(data);
									await otp
										.save()
										.then((r) => r)
										.catch((e) => {
											throw e;
										});

									resolve(
										'OTP sent to your mobile number!!!'
									);
								} else {
									reject(`${result.message}`);
								}
							})
							.catch((e) => {
								throw e;
							});
					} else {
						const otpDetail = await OTP.findOne({
							userid: user._id,
							// isverified: false,
						})
							.then((r) => r)
							.catch((e) => {
								throw e;
							});

						if (otpDetail && otp.isverified == false) {
							randNum = otpDetail.otp;
						}

						let url = `https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=${process.env.MSGKEY}&senderid=${process.env.SENDERID}&channel=2&DCS=0&flashsms=0&number=91${mob}&text=${textMsg}&route=1`;
						const res = await superagent.post(url);
						var result = JSON.parse(res.text);
						if (result.ErrorMessage == 'Success') {
							if (!otpDetail) {
								const data = {
									userid: user._id,
									otp: randNum,
									isverified: false,
								};

								const otp = new OTP(data);
								await otp
									.save()
									.then((r) => r)
									.catch((e) => {
										throw e;
									});
							} else if (
								otpDetail &&
								otpDetail.isverified == true
							) {
								await OTP.findOneAndUpdate(
									{
										_id: otpDetail._id,
									},
									{
										otp: randNum,
										isverified: false,
									}
								)
									.then((r) => r)
									.catch((err) =>
										reject({
											code: 500,
											msg: `${err}`,
										})
									);
							}

							resolve('OTP sent to your mobile number!!!');
						} else {
							reject(`${result.message}`);
						}
					}
				} catch (err) {
					reject(err);
				}
			}
		});
	}

	getTokens(data) {
		return new Promise((resolve, reject) => {
			let token = jwt.sign(
				{
					_id: data._id,
					mob_no: data.mob_no,
				},
				process.env.JWT_SECRET,
				{
					expiresIn: '1y',
				}
			);
			let refrestToken = jwt.sign(
				{
					_id: data._id,
					mob_no: data.mob_no,
				},
				process.env.JWT_REFRESH_SECRET,
				{
					expiresIn: '1y',
				}
			);
			if (token && refrestToken) {
				resolve({
					token,
					refrestToken,
				});
			} else {
				reject(`Error in generating tokens....`);
			}
		});
	}

	verifyOTP(req) {
		return new Promise(async (resolve, reject) => {
			var { mob, otp } = req.body;
			if (!mob) {
				reject('Mobile number missing!!!');
			} else if (!otp) {
				reject('OTP missing!!!');
			} else {
				try {
					const user = await users
						.findOne({
							mob_no: mob,
						})
						.then((r) => r)
						.catch((err) =>
							reject({
								code: 500,
								msg: `${err}`,
							})
						);
					if (!user) {
						reject({
							code: 400,
							msg: 'User not found!!!',
						});
					}

					var result = {};

					const otpDetail = await OTP.findOne({
						userid: user._id,
						otp: otp,
						isverified: false,
					})
						.then((r) => r)
						.catch((err) =>
							reject({
								code: 500,
								msg: `${err}`,
							})
						);
					if (!otpDetail) {
						result.message = 'Login failed. Please try again!';
					} else {
						await OTP.findOneAndUpdate(
							{
								_id: otpDetail._id,
							},
							{
								isverified: true,
							}
						)
							.then((r) => r)
							.catch((err) =>
								reject({
									code: 500,
									msg: `${err}`,
								})
							);
						result.type = 'success';
					}

					if (result.type.localeCompare('success') == 0) {
						try {
							var u = await users
								.findOne({
									mob_no: mob,
								})
								.then((r) => r.toObject())
								.catch((err) => {
									reject(`${err}`);
								});
							// .then(u => {
							if (u == null) {
								const user = new users({
									mob_no: mob,
									exists: false,
								});
								user.save()
									.then(async (data) => {
										const tokens = await this.getTokens(
											data
										);
										resolve({
											...data,
											tokens,
										});
									})
									.catch((err) => {
										reject(`${err}`);
									});
							} else {
								const tokens = await this.getTokens(u);
								resolve({
									...u,
									tokens,
								});
							}
							//   })
							// .catch(err => reject(`${err}`))
						} catch (err) {
							reject(`${err}`);
						}
					} else {
						reject(`${result.message}`);
					}
				} catch (err) {
					reject(err);
				}
			}
		});
	}

	resend(req) {
		return new Promise(async (resolve, reject) => {
			var mob = req.body.mob;
			if (!mob) {
				reject('Mobile number missing!!!');
			} else {
				try {
					const user = await users
						.findOne({
							mob_no: mob,
						})
						.then((r) => r)
						.catch((err) =>
							reject({
								code: 500,
								msg: `${err}`,
							})
						);

					if (!user) {
						reject({
							code: 400,
							msg: 'User not found!!!',
						});
					} else {
						let randNum = null;
						const otpDetail = await OTP.findOne({
							userid: user._id,
							isverified: false,
						})
							.then((r) => r)
							.catch((e) => {
								throw e;
							});

						if (!otpDetail) {
							throw new Error('Otp not found!!!');
						}
						randNum = otpDetail.otp;
						const textMsg = `Your verification code is ${randNum}.`;

						let url = `https://www.smsgatewayhub.com/api/mt/SendSMS?APIKey=${process.env.MSGKEY}&senderid=${process.env.SENDERID}&channel=2&DCS=0&flashsms=0&number=91${mob}&text=${textMsg}&route=1`;
						const res = await superagent.post(url);
						var result = JSON.parse(res.text);
						if (result.ErrorMessage == 'Success') {
							resolve('OTP sent to your mobile number!!!');
						} else {
							reject(`${result.message}`);
						}
					}
				} catch (err) {
					reject(err);
				}
			}
		});
	}

	getUser(req) {
		return new Promise((resolve, reject) => {
			let query = {};
			if (req.query.others == undefined) {
				req.query.others = 'false';
			}
			if (req.query.others.localeCompare('false') == 0) {
				req.query.others = 'false';
				query = req.query.userid ? { userid: req.query.userid } : {};
			}

			if (req.query.search) {
				const { search } = req.query;
				const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
				const searchRgx = rgx(search);

				query = {};
				query = {
					$or: [
						{ name: { $regex: searchRgx, $options: 'i' } },
						{ email: { $regex: searchRgx, $options: 'i' } },
						{ occupation: { $regex: searchRgx, $options: 'i' } },
						{ company: { $regex: searchRgx, $options: 'i' } },
						{ designation: { $regex: searchRgx, $options: 'i' } },
						{ website: { $regex: searchRgx, $options: 'i' } },
						{ address: { $regex: searchRgx, $options: 'i' } },
					],
				};
			}

			query.isdeleted = false;

			UserDetails.find(query)
				.then((data) => {
					if (data.length == 0) {
						resolve({
							code: 204,
							msg: 'No user found!!!',
						});
					} else {
						if (req.query.others.localeCompare('true') == 0) {
							if (!req.query.userid) {
								reject({
									code: 500,
									msg: `Please make 'others' as 'false' in the req query or pass 'userid' also!!! `,
								});
							}
							data = data.filter((x) => {
								let userid = x.userid;
								return userid != req.query.userid;
							});
							resolve({
								code: 200,
								result: data,
							});
						} else {
							resolve({
								code: 200,
								result: data,
							});
						}
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

	addUser(req) {
		return new Promise(async (resolve, reject) => {
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (
				!req.body.userid ||
				!req.body.name ||
				!req.body.email ||
				!req.body.occupation ||
				!req.body.company ||
				// !req.body.businesslogo ||
				!req.body.mob_no
			) {
				reject({
					code: 400,
					msg: 'Some of the required fields are missing!!!',
				});
			}  else if (
				!req.body.latitude ||
				!req.body.longitude
			) {
				reject({
					code: 400,
					msg: 'Location coordinates missing!!!',
				});
			} else {
				let data = req.body;
				const regUser = await users.findById(data.userid);

				if (!regUser) {
					throw new Error('User not found!!!');
				}

				UserDetails.findOne({
					userid: data.userid,
					isdeleted: false
				})
					.then((user) => {
						if (user == null) {
							let userDetails = new UserDetails(data);
							userDetails
								.save()
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
						} else {
							reject({
								code: 409,
								msg: 'User already exists!!!',
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

	search(req) {
		return new Promise(async (resolve, reject) => {
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (!req.body.search || !req.body.columns) {
				reject({
					code: 400,
					msg: 'Some of the required fields are missing!!!',
				});
			} else {
				const { search, columns } = req.body;
				const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
				const searchRgx = rgx(search);

				let query = {};

				if (columns.length == 0) {
					query = {
						$or: [
							{ name: { $regex: searchRgx, $options: 'i' } },
							{ email: { $regex: searchRgx, $options: 'i' } },
							{
								occupation: {
									$regex: searchRgx,
									$options: 'i',
								},
							},
							{ company: { $regex: searchRgx, $options: 'i' } },
							{
								designation: {
									$regex: searchRgx,
									$options: 'i',
								},
							},
							{ website: { $regex: searchRgx, $options: 'i' } },
							{ address: { $regex: searchRgx, $options: 'i' } },
						],
					};
				} else {
					query = {
						$or: [],
					};

					columns.map((x) => {
						let temp = {};
						temp[x] = { $regex: searchRgx, $options: 'i' };
						query['$or'].push(temp);
					});
				}

				query.isdeleted= false;

				UserDetails.find(query)
					.then((data) => {
						if (data.length == 0) {
							resolve({
								code: 204,
								msg: 'No result found!!!',
							});
						} else {
							console.log("Data: ", data)
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
			}
		});
	}
}

module.exports = new UserController();
