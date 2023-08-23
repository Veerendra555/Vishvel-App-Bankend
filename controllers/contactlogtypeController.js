require('dotenv').config();

const ContactLogType = require('../models/contactlogtype');

class ContactlogtypeController {
	constructor() {}

	getContactLogType(req) {
		return new Promise((resolve, reject) => {
			ContactLogType.find({userid: req.query.userid}).populate('userid').populate('businessid')
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
}

module.exports = new ContactlogtypeController();
