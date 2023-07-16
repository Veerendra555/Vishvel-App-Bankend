require('dotenv').config();

const SelectedTemplate = require('../models/templateSelected');
const Template = require('../models/template');

class SelectedTemplateController {
	constructor() {}

	getSelectedTemplate(req) {
		return new Promise((resolve, reject) => {
			let query = req.query.userid ? { userid: req.query.userid } : {};
			SelectedTemplate.find(query)
				.populate({
          path: 'selected',
				})
				.then((data) => {
					if (data.length == 0) {
						resolve({
							code: 204,
							msg: 'No selected Template found!!!',
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

	addSelectedTemplate(req) {
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
			} else if (!req.body.selected) {
				reject({
					code: 400,
					msg: 'Selected Template missing!!!',
				});
			} else {
				let data = req.body;

				const selectedTemplate = new SelectedTemplate(data);
				selectedTemplate
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

module.exports = new SelectedTemplateController();
