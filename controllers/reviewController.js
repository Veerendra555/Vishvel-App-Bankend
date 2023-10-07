require('dotenv').config();

const UserDetail = require('../models/userdetail');

class ReviewController {
	constructor() {}

	getReview(req) {
		return new Promise((resolve, reject) => {
			if (!req.query.userid) {
				reject({
					code: 400,
					msg: `Userid missing!!!`,
				});
			}
			let query = { userid: req.query.userid };
			UserDetail.find(query)
				.then((data) => {
					if (data.length == 0) {
						resolve({
							code: 204,
							msg: 'No User found!!!',
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

	addReview(req) {
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
			} else if (!req.body.from) {
				reject({
					code: 400,
					msg: 'Current User id missing!!!',
				});
			} else if (!req.body.review) {
				reject({
					code: 400,
					msg: 'Review missing!!!',
				});
			} else {
				await UserDetail.findOne({
					userid: req.body.userid,
				})
					.then(async (user) => {
						if (!user) {
							reject({
								code: 400,
								msg: `User not found!!!`,
							});
						} else {
							let review = [];
							if (user.review) {
								review = [...user.review];
							}
							review.push({
								from: req.body.from,
								review: req.body.review,
							});

							await UserDetail.findOneAndUpdate(
								{
									userid: req.body.userid,
								},
								{
									review,
								}
							)
								.then((r) => {
                                    resolve({
                                        code: 200,
                                        msg: 'Review Added!!!',
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
			}
		});
    }
    
    addRating(req) {
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
			} else if (!req.body.from) {
				reject({
					code: 400,
					msg: 'Current User id missing!!!',
				});
			} else if (!req.body.rating) {
				reject({
					code: 400,
					msg: 'Review missing!!!',
				});
			} else {
				await UserDetail.findOne({
					userid: req.body.userid,
				})
					.then(async (user) => {
						if (!user) {
							reject({
								code: 400,
								msg: `User not found!!!`,
							});
						} else {
							let rating = 0;
							let total = 0;
							if (user.rating) {
                                rating = user.rating.rating;
                                total = user.rating.total;
                            }
							console.log("rating" ,rating,"+ req.body.rating;", req.body.rating)
                            
                            rating = rating + Number(req.body.rating);
							console.log("New Rating==>",rating)
                            // let sum = rating * total;
                            total = total + 1;
                            // let newRating = (sum + req.body.rating)/total;

							await UserDetail.findOneAndUpdate(
								{
									userid: req.body.userid,
								},
								{
									rating: {
                                        rating,
                                        total
                                    },
								}
							)
								.then((r) => {
                                    resolve({
                                        code: 200,
                                        msg: 'Rating Added!!!',
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
			}
		});
    }
}

module.exports = new ReviewController();
