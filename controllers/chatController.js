require('dotenv').config();

const Chat = require('../models/chat');

class ChatController {
	constructor() {}

	getChat(req) {
		return new Promise((resolve, reject) => {
			let query = {};
			if (req.query.fromId) {
				query.fromId = req.query.fromId;
			}
			if (req.query.toId) {
				query.toId = req.query.toId;
			}
			if (req.query.orderId) {
				query.orderId = req.query.orderId;
			}
			Chat.find(query)
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

	addChat(req) {
		return new Promise(async (resolve, reject) => {
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (!req.body.fromId) {
				reject({
					code: 400,
					msg: 'Sender id missing!!!',
				});
			} else if (!req.body.toId) {
				reject({
					code: 400,
					msg: 'Reciever id missing!!!',
				});
			} else if (!req.body.orderId) {
				reject({
					code: 400,
					msg: 'Order id missing!!!',
				});
			} else if (!req.body.msg) {
				reject({
					code: 400,
					msg: 'Message missing!!!',
				});
			} else {
				let data = req.body;

				const chat = new Chat(data);
				chat.save()
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

module.exports = new ChatController();
