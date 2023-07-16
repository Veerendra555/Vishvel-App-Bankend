const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;

const reportContactSchema = mongoose.Schema({
  contact:String,
  report:String,
  byuser:String
});

const contact = mongoose.model("reportcontacts", reportContactSchema);

module.exports = contact;
