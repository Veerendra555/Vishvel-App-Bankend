const mongoose = require('../db/db');
var ObjectId = mongoose.Schema.Types.ObjectId;

const { constants } = require("../config/constants");

const orderSchema = mongoose.Schema({
	customerId: {
		type: ObjectId,
		required: true,
	},
	ownerId: {
		type: ObjectId,
		required: true,
	},
	address: {
		type: String,
		required: true,
	},
	product: {
		type: Object,
		required: true,
	},
	orderStatus: {
		type: String,
		required: true,
        default: constants.ORDER.STATUS.PLACED
	},
	placedAt: {
		type: Date,
		default: new Date(),
	},
	orderAccepted: {
		type: Boolean,
		default: false,
	},
	chatCompleted: {
		type: Boolean,
		default: false,
	},
	orderCancelled: {
		type: Boolean,
		default: false,
	},
});

const otp = mongoose.model('order', orderSchema);

module.exports = otp;
