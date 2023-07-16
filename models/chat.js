const mongoose = require('../db/db');
var ObjectId = mongoose.Schema.Types.ObjectId;

const chatSchema = mongoose.Schema({
	fromId: {
		type: ObjectId,
		required: true,
	},
	toId: {
		type: ObjectId,
		required: true,
	},
	orderId: {
		type: ObjectId,
		required: true,
		ref: 'orders',
	},
	msg: {
		type: String,
		required: true,
	},
	sentAt: {
		type: Date,
		default: new Date(),
	},
});

const otp = mongoose.model('chat', chatSchema);

module.exports = otp;
