require('dotenv').config();

const CartController = require('../controllers/cartController');

const Order = require('../models/order');
const Chat = require('../models/chat');
const cart = require('../models/cart');

const { constants } = require('../config/constants');

class OrderController {
	constructor() {}

	getOrder(req) {
		return new Promise((resolve, reject) => {
			let query = {};
			if (req.query._id) {
				query._id = req.query._id;
			}
			if (req.query.customerId) {
				query.customerId = req.query.customerId;
			}
			if (req.query.ownerId) {
				query.ownerId = req.query.ownerId;
			}
			Order.find(query)
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

	addOrder(req) {
		return new Promise(async (resolve, reject) => {
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (!req.body.customerId) {
				reject({
					code: 400,
					msg: 'Sender id missing!!!',
				});
			} else if (!req.body.address) {
				reject({
					code: 400,
					msg: 'Address missing!!!',
				});
			} else {
				let data = req.body;

				await CartController.getCartItem({
					query: {
						userId: data.customerId,
					},
				})
					.then((product) => {
						if (product.result.items.length == 0) {
							reject({
								code: 500,
								msg: `Cart empty!!!`,
							});
						}
						data.product = product.result;
						data.ownerId = product.result.items[0].userid.toString();

						const order = new Order(data);
						order
							.save()
							.then((data) => {
								const chat = new Chat({
									fromId: data.customerId,
									toId: data.ownerId,
									msg: 'Your order is placed. Order id: ' + data._id,
									orderId: data._id,
								});
								chat.save()
									.then(async () => {
										await cart
											.find({
												userid: data.customerId,
											})
											.deleteMany(); // delete all
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

	cancelOrder(req) {
		return new Promise(async (resolve, reject) => {
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (!req.body.id) {
				reject({
					code: 400,
					msg: 'Order id missing!!!',
				});
			} else {
				Order.findOne({
					_id: req.body.id,
				})
					.then((order) => {
						if (order == null) {
							reject({
								code: 400,
								msg: 'Order id invalid!!!',
							});
						} else {
							// disc = disc.dataValues;
							Order.findOneAndUpdate(
								{
									_id: req.body.id,
								},
								{
									orderStatus: constants.ORDER.STATUS.CANCELLED,
									orderCancelled: true,
									chatCompleted: true,
								}
							)
								.then(() => {
									let data = {
										fromId: order.customerId,
										toId: order.ownerId,
										msg: 'Your order was cancelled successfully. This chat will no longer be available!!!',
										orderId: req.body.id,
									};

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

	updateOrderStatus(req) {
		return new Promise(async (resolve, reject) => {
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (!req.body.id) {
				reject({
					code: 400,
					msg: 'Order id missing!!!',
				});
			} else if (!req.body.status) {
				reject({
					code: 400,
					msg: 'Status missing!!!',
				});
			} else {
				Order.findOne({
					_id: req.body.id,
				})
					.then((order) => {
						if (order == null) {
							reject({
								code: 400,
								msg: 'Order id invalid!!!',
							});
						} else {
							// disc = disc.dataValues;
							let status = req.body.status;
							let orderStatus = null;

							let updateObj = {}

							let flag = 0;

							if (/accept/i.test(status)) {
								orderStatus = constants.ORDER.STATUS.ACCEPTED;
								updateObj.orderAccepted = true;
							} else if (/reject/i.test(status)) {
								orderStatus = constants.ORDER.STATUS.REJECTED;
							} else if (/place/i.test(status)) {
								orderStatus = constants.ORDER.STATUS.PLACED;
							} 
							// else if (/cancel/i.test(status)) {
							// 	orderStatus = constants.ORDER.STATUS.CANCELLED;
							// } 
							else if (/deliver/i.test(status)) {
								orderStatus = constants.ORDER.STATUS.DELIVERED;
							} else {
								flag = 1;
							}

							if (flag == 1) {
								reject({
									code: 400,
									msg: `Invalid status!!!`,
								});
							} else {
								updateObj.orderStatus =orderStatus;
								Order.findOneAndUpdate(
									{
										_id: req.body.id,
									},
									updateObj
								)
									.then(() => {
										let data = {
											fromId: order.customerId,
											toId: order.ownerId,
											msg: `Your order was ${orderStatus}!!!`,
											orderId: req.body.id,
										};

										const chat = new Chat(data);
										chat.save()
											.then((data) => {
												resolve({
													code: 200,
													msg: data.msg,
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

module.exports = new OrderController();
