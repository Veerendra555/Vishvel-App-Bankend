require('dotenv').config();

const Favourite = require('../models/favourite');
const UserDetails = require('../models/userdetail');
const Feed = require('../models/feed');

class FavouriteController {
	constructor() {}

	getFavourite(req) {
		return new Promise((resolve, reject) => {
			let query = req.query.userid
				? { userid: req.query.userid }
				: { userid: req.user._id };
			Favourite.find(query)
				.then((data) => {
					if (data.length == 0) {
						resolve({
							code: 204,
							msg: 'No favourite found!!!',
						});
					} else {
						UserDetails.find({
							isdeleted: false
						})
							.then(async (users) => {
								const temp = [];
								const promise = [];
								data.map(async (x) => {
									const fav = users.filter((z) =>
										z.userid.equals(x.favourite)
									)[0];
									if (fav) {
										promise.push(this.getFeeds(fav.userid));
										temp.push({
											userid: x.userid,
											favourite: fav,
										});
									}
								});

								const feeds = await Promise.all(promise)
									.then((r) => r)
									.catch((err) => {
										reject({
											code: 500,
											msg: `${err}`,
										});
									});
								var mergedFeeds = [].concat.apply([], feeds);
								mergedFeeds.sort(function (a, b) {
									return b.createdAt - a.createdAt;
								});
								resolve({
									code: 200,
									result: {
										favourites: temp,
										feeds: mergedFeeds,
									},
								});
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

	getFeeds(userid) {
		return new Promise((resolve, reject) => {
			Feed.find({
				userid: userid,
			})
				.then((feeds) => {
					resolve(feeds);
				})
				.catch((err) =>
					reject({
						code: 500,
						msg: `${err}`,
					})
				);
		});
	}

	addFavourite(req) {
		return new Promise(async (resolve, reject) => {
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (!req.body.favourite) {
				reject({
					code: 400,
					msg: 'Favourite missing!!!',
				});
			} else {
				let data = req.body;

				Favourite.findOne(data)
					.then((fav) => {
						if (fav) {
							reject({
								code: 409,
								msg: `User already added!!!`,
							});
						} else {
							const favourite = new Favourite(data);
							favourite
								.save()
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

	deleteFavourite(req) {
		return new Promise((resolve, reject) => {
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (!req.body.userid) {
				reject({
					code: 400,
					msg: 'UserId missing!!!',
				});
			} else if (!req.body.favourite) {
				reject({
					code: 400,
					msg: 'Favourite missing!!!',
				});
			} else {
				let query = {
					favourite: req.body.favourite,
					userid: req.body.userid,
				};
				Favourite.findOne(query)
					.then((data) => {
						if (!data) {
							resolve({
								code: 204,
								msg: 'No product found!!!',
							});
						} else {
							console.log('data', data);
							Favourite.deleteOne({
								_id: data._id,
							})
								.then(() => {
									resolve({
										code: 200,
										result: 'Favourite removed!!!',
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
}

module.exports = new FavouriteController();
