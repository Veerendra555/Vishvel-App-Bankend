const mongoose = require('../db/db');
var ObjectId = mongoose.Schema.Types.ObjectId;

const templateSchema = mongoose.Schema({
	userid: {
		type: ObjectId,
		required: true,
	},
	selected: {
		type: ObjectId,
		required: true,
		ref: 'templates',
	},
	name: {
		type: String,
		required: false,
	},
	designation: {
		type: String,
		required: false,
	},
	mob_no: {
		type: String,
		required: false,
	},
	website: {
		type: String,
		required: false,
	},
});

const template = mongoose.model('selectedtemplate', templateSchema);

module.exports = template;
