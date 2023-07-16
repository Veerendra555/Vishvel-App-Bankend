require('dotenv').config();

const Feed = require('../models/feed');
const UserDetail = require('../models/userdetail');

class FeedController {
	constructor() {}

	getFeed(req) {
		return new Promise((resolve, reject) => {
			let query = req.query.userid ? { userid: req.query.userid } : {};
			Feed.find(query)
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

	addFeed(req) {
		return new Promise(async (resolve, reject) => {
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (!req.body.userid) {
				reject({
					code: 400,
					msg: 'User id missing!!!',
				});
			}
			else if (
				!req.body.caption ||
				!req.body.image
				// || !req.body.businesslogo
			) {
				reject({
					code: 400,
					msg: 'Caption or image missing!!!',
				});
			}
			else {
				await UserDetail.find({
					userid: req.body.userid,
				})
					.then((user) => {
						if (user.length == 0) {
							reject({
								code: 400,
								msg: `User not found!!!`,
							});
						} else {
							let data = req.body;
							// console.log("Body: ", req.body);
							
							data.businesslogo = user[0].businesslogo;

							const feed = new Feed(data);
							feed.save()
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

	deleteFeed(req) {
		return new Promise(async (resolve, reject) => {
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (!req.body.userid) {
				reject({
					code: 400,
					msg: 'User id missing!!!',
				});
			} else if (!req.body.id) {
				reject({
					code: 400,
					msg: 'Feed id missing!!!',
				});
			} else {
				await UserDetail.find({
					userid: req.body.userid,
				})
					.then(async (user) => {
						if (user.length == 0) {
							reject({
								code: 400,
								msg: `User not found!!!`,
							});
						} else {
							await Feed.find({
								_id: req.body.id,
								userid: req.body.userid,
							})
								.then((feeds) => {
									if (feeds.length == 0) {
										reject({
											code: 400,
											msg: `Feed not found!!!`,
										});
									} else {
										Feed.remove({
											_id: req.body.id,
											userid: req.body.userid,
										})
											.then(() => {
												resolve({
													code: 200,
													result: 'Feed removed!!!',
												});
											})
											.catch((err) => {
												reject({
													code: 500,
													msg: `${err}`,
												});
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
}

module.exports = new FeedController();
