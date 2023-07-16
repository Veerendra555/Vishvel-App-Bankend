require('dotenv').config();

const { ObjectID } = require('bson');
const Product = require('../models/product');

class ProductController {
	constructor() {
		this.products = [];
	}

	getProduct(req) {
		return new Promise((resolve, reject) => {
			let query = req.query.userid ? { userid: req.query.userid } : {};
			Product.find(query)
				.then((data) => {
					if (data.length == 0) {
						resolve({
							code: 204,
							msg: 'No product found!!!',
						});
					} else {
						const temp = [];
						data.map((x) => {
							x = x.toObject();
							temp.push({
								...x,
								saved: x.mrp - x.sellingPrice,
							});
						});
						resolve({
							code: 200,
							result: temp,
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

	addProduct(req) {
		return new Promise(async (resolve, reject) => {
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
			} else if (
				!req.body.name ||
				!req.body.category ||
				!req.body.images ||
				req.body.images.length == 0 ||
				!req.body.mrp ||
				!req.body.sellingPrice
			) {
				reject({
					code: 400,
					msg: 'Fields missing!!!',
				});
			} else {
				let data = req.body;

				const product = new Product(data);
				product
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

	editProduct(req) {
		return new Promise(async (resolve, reject) => {
			if (!Object.keys(req.body).length) {
				reject({
					code: 400,
					msg: 'No data passed in request body!!!',
				});
			} else if (!req.body._id) {
				reject({
					code: 400,
					msg: '_id missing!!!',
				});
			} else {
				let data = req.body;
				Product.findOne({_id:ObjectID(req.body._id)}).then(find=>{
					if(find){
						req.body.images = find.images.concat(req.body.images);
						const toUpdate = (({ _id,userid, ...o }) => o)(req.body);
						Product.update({_id:req.body._id},toUpdate).then(x=>{
							resolve({
								code: 200,
								msg: "Product updated successfully",
							});
						}).catch(err=>{
							reject({
								code: 400,
								Error: `${err}`,
							});
						})
					}else{
						resolve({
							code:201,
							msg:`no data found`
						})
					}
				}).catch(err=>{
					reject({
						code:400,
						msg:`${err}`
					})
				})
				
			}
		});
	}

	deleteProduct(req) {
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
			} else if (!req.body.productid) {
				reject({
					code: 400,
					msg: 'ProductId missing!!!',
				});
			} else {
				let query = {
					_id: req.body.productid,
					userid: req.body.userid,
				};
				Product.findOne(query)
					.then((data) => {
						if (!data) {
							resolve({
								code: 204,
								msg: 'No product found!!!',
							});
						} else {
							Product.deleteOne({
								_id: data._id,
							})
								.then(() => {
									resolve({
										code: 200,
										result: 'Product removed!!!',
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

	filterCategory(req) {
		return new Promise((resolve, reject) => {
			if (!req.query.filter || this.products.length == 0) {
				Product.find({})
					.then((data) => {
						if (data.length == 0) {
							resolve({
								code: 204,
								msg: 'No product found!!!',
							});
						} else {
							this.products = data;

							if (req.query.filter) {
								let matches = this.products.filter((x) => {
									const regex = new RegExp(`^${req.query.filter}`, 'gi');
									return x.category.match(regex);
								});

								resolve({
									code: 200,
									result:
										matches && matches.length ? matches : 'No match found!!!',
								});
							} else {
								resolve({
									code: 200,
									result: data,
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
			} else {
				let matches = this.products.filter((x) => {
					const regex = new RegExp(`^${req.query.filter}`, 'gi');
					return x.category.match(regex);
				});

				resolve({
					code: 200,
					result: matches && matches.length ? matches : 'No match found!!!',
				});
			}
		});
	}

	getProductByCategory(req) {
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
			} else {
				let query = { userid: req.body.userid };
				// console.log('query', query);

				Product.aggregate([
					{
						'$match': {
						  'userid': ObjectID(req.body.userid)
						}
					  }, {
						'$group': {
						  '_id': '$category', 
						  'products': {
							'$push': '$$ROOT'
						  }
						}
					  }, {
						'$project': {
						  '_id': 0, 
						  'category': '$_id', 
						  'products': 1
						}
					  }
				]).exec((err, data) => {
					if (err) {
						reject({
							code: 500,
							msg: `${err}`,
						});
					} else {
						// console.log('data', data);
						if (data.length == 0) {
							resolve({
								code: 204,
								msg: 'No product found!!!',
							});
						} else {
							// console.log('data', data)
							const temp = [];
							for(let i = 0; i < data.length; i++){
								let x = data[i];
								let obj = {};
								obj.category = x.category;
								obj.products = [];
								x.products.map(y => {
									obj.products.push({
										...y,
										saved: y.mrp - y.sellingPrice,
									});
								})
								temp.push(obj);
							}
							resolve({
								code: 200,
								result: temp,
							});
						}
					}
				});
			}
		});
	}
}

module.exports = new ProductController();
