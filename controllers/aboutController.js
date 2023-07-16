require('dotenv').config();

const About = require('../models/about');

class AboutController {
	constructor() {}

	getAbout(req) {
		return new Promise((resolve, reject) => {
			let query = req.query.userid ? { userid: req.query.userid } : { userid: req.user._id };
			About.find(query)
				.then((data) => {
					if (data.length == 0) {
						resolve({
							code: 204,
							msg: 'No details found!!!',
						});
					} else {
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

	addAbout(req) {
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
			} else {
				await About.find({ userid: req.body.userid }).remove();
				let data = req.body;
				try {
					data.experience = JSON.stringify(
						JSON.parse(data.experience)
					);
					data.achievements = JSON.stringify(
						JSON.parse(data.achievements)
					);
					data.education = JSON.stringify(JSON.parse(data.education));
					data.skills = JSON.stringify(JSON.parse(data.skills));

					const about = new About(data);
					about
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
				} catch (err) {
					reject({
						code: 500,
						msg: `${err}`,
					});
				}
			}
		});
	}
}

module.exports = new AboutController();
