require('dotenv').config();

const cart = require('../models/cart');
const Product = require('../models/product');
const user = require('../models/user');

class CartController {
	constructor() {
		this.result = [];
		this.total = 0;
		this.discount = 0;
	}

	getCartItem(req) {
		return new Promise((resolve, reject) => {
			this.total = 0;
			this.discount = 0;
			this.result = [];
			var userId = req.query.userId;
			if (!userId) {
				reject({
					code: 400,
					msg: 'User Id missing!!!',
				});
			} else {
				user.findOne({
					_id: userId,
				})
					.then((user) => {
						if (user != null) {
							cart.find({
								userid: userId,
							})
								.then((data) => {
									if (data.length == 0) {
										resolve({
											code: 200,
											result: {
												items: [],
												basketValue: 0,
												discountValue: 0,
											},
										});
									} else {
										var promise = [];
										data.map((x) => {
											promise.push(this.getItem(x));
										});
										Promise.all(promise)
											.then(() => {
												resolve({
													code: 200,
													result: {
														items: this.result,
														basketValue: this.total,
														discountValue: this
															.discount,
													},
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
						} else {
							reject({
								code: 400,
								msg: 'User not found!!!',
							});
						}
					})
					.catch((err) => {
						console.log('err', err);
						reject({
							code: 500,
							msg: `${err}`,
						});
					});
			}
		});
	}

	getItem(x) {
		return new Promise((resolve, reject) => {
			var obj = {};
			Product.findOne({
				_id: x.productid,
			})
				.then((product) => {
					if (!product) {
						reject('Product Not Found!!!');
					}
					obj = { ...product.toObject(), quantity: x.quantity };
					this.result.push(obj);
					this.total += x.quantity * obj.sellingPrice;
					this.discount += x.quantity * (obj.mrp - obj.sellingPrice);
					resolve('ok');
				})
				.catch((err) => reject(`${err}`));
		});
	}

	addCartItem(req) {
		return new Promise((resolve, reject) => {
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (!req.body.userId || !req.body.productId) {
				reject({
					code: 400,
					msg: 'Some of the fields are missing!!!',
				});
			} else {
				let obj = {
					userid: req.body.userId,
					productid: req.body.productId,
					quantity: 1,
				};

				cart.find({
					userid: req.body.userId,
				})
					.populate('productid')
					.exec((err, data) => {
						if (err) {
							reject({
								code: 500,
								msg: `${err}`,
							});
						}
						if (data.length == 0) {
							const c = new cart(obj);
							c.save()
								.then(() => {
									resolve({
										code: 200,
										msg: 'Cart Items Saved!!!',
									});
								})
								.catch((err) => {
									reject({
										code: 500,
										msg: `${err}`,
									});
								});
						} else {
							let productUserId = [
								...new Set(data.map((x) => x.productid.userid.toString())),
							];

							if (productUserId.length > 1) {
								reject({
									code: 500,
									msg: `Some error occured. Please empty the cart and try again!!!`,
								});
							} else {
								productUserId = productUserId[0];
								Product.findOne({
									_id: req.body.productId,
								})
									.then(async (prod) => {
										if (!prod) {
											reject({
												code: 500,
												msg: `Product not found!!!`,
											});
										} else {
											if (
												productUserId
													.toString()
													.localeCompare(
														prod.userid.toString()
													) != 0
											) {
												await cart
													.find({
														userid: req.body.userId,
													})
													.deleteOne();

												const c = new cart(obj);
												c.save()
													.then(() => {
														resolve({
															code: 200,
															msg:
																'Cart Items Saved!!!',
														});
													})
													.catch((err) => {
														reject({
															code: 500,
															msg: `${err}`,
														});
													});
											} else {
												const item = data.filter(
													(x) =>
														x.userid
															.toString()
															.localeCompare(
																req.body.userId.toString()
															) == 0 &&
														x.productid._id
															.toString()
															.localeCompare(
																req.body.productId.toString()
															) == 0
												)[0];

												if (item) {
													cart.findOneAndUpdate(
														{
															userid:
																req.body.userId,
															productid:
																req.body
																	.productId,
														},
														{
															quantity:
																item.quantity +
																1,
														}
													)
														.then(() => {
															resolve({
																code: 200,
																msg:
																	'Cart Items Saved!!!',
															});
														})
														.catch((err) => {
															reject({
																code: 500,
																msg: `${err}`,
															});
														});
												} else {
													const c = new cart(obj);
													c.save()
														.then(() => {
															resolve({
																code: 200,
																msg:
																	'Cart Items Saved!!!',
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
										}
									})
									.catch((err) => {
										reject({
											code: 500,
											msg: `${err}`,
										});
									});
							}
						}
					});
			}
		});
	}

	deleteCartItem(req) {
		return new Promise((resolve, reject) => {
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (!req.body.userId || !req.body.productId) {
				reject({
					code: 400,
					msg: 'Some of the fields are missing!!!',
				});
			} else {
				cart.findOne({
					userid: req.body.userId,
					productid: req.body.productId,
				})
					.then((disc) => {
						if (disc == null) {
							reject({
								code: 400,
								msg: 'Product not found in cart!!!',
							});
						} else {
							// disc = disc.dataValues;
							cart.findOneAndUpdate(
								{
									userid: req.body.userId,
									productid: req.body.productId,
								},
								{
									quantity: disc.quantity - 1,
								}
							)
								.then(() => {
									cart.findOne({
										userid: req.body.userId,
										productid: req.body.productId,
									})
										.then((data) => {
											if (data != null) {
												if (
													data.quantity == 0 ||
													data.quantity < 0
												) {
													cart.findOneAndRemove({
														_id: data._id,
													})
														.then(() => {
															resolve({
																code: 200,
																msg:
																	'Item removed from cart!!!',
															});
														})
														.catch((err) =>
															reject({
																code: 500,
																msg: `${err}`,
															})
														);
												} else {
													resolve({
														code: 200,
														msg:
															'Item removed from cart!!!',
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

	emptyCart(req) {
		return new Promise((resolve, reject) => {
			cart.remove({
				userid: req.body.userId,
			})
				.then(() => {
					resolve({
						code: 200,
						msg: 'Cart Emptied!!!',
					});
				})
				.catch((err) => {
					reject({
						code: 500,
						msg: `${err}`,
					});
				});
		});
	}
}

module.exports = new CartController();
