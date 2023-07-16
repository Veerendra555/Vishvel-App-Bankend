const mongoose = require('../db/db');
var ObjectId = mongoose.Schema.Types.ObjectId;

const otpSchema = mongoose.Schema({
	userid: {
		type: ObjectId,
		required: true,
	},
	productid: {
		type: ObjectId,
		required: true,
		ref: 'products',
	},
	quantity: {
		type: Number,
		required: true,
	},
});

const otp = mongoose.model('cart', otpSchema);

module.exports = otp;
