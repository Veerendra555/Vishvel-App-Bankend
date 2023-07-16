require('dotenv').config();

const Template = require('../models/template');

class TemplateController {
	constructor() {}

	getTemplate(req) {
		return new Promise((resolve, reject) => {
			let query = req.query.userid ? { userid: req.query.userid } : {};
			if (req.query.templateid) {
				query._id = req.query.templateid;
			}
			Template.find(query)
				.then((data) => {
					if (data.length == 0) {
						resolve({
							code: 204,
							msg: 'No template found!!!',
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

	addTemplate(req) {
		return new Promise(async (resolve, reject) => {
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (
				!req.body.template ||
				!req.body.color ||
				!req.body.icon_color
			) {
				reject({
					code: 400,
					msg: 'Template, color or icon_color missing!!!',
				});
			} else {
				let data = req.body;

				const template = new Template(data);
				template
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
		});
	}
}

module.exports = new TemplateController();
