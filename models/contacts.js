const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;

const contactSchema = mongoose.Schema({
  userid: {
    type: ObjectId,
    required: true,
    unique: true
  },
  contacts: [String],

  blocked:[String]
});

const contact = mongoose.model("contacts", contactSchema);

module.exports = contact;
