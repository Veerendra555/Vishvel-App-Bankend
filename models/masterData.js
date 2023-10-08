const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;

const masterData = mongoose.Schema({
  userid: {
    type: ObjectId,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
},{
  timestamps:true
});

const masterDetails = mongoose.model("master", masterData);

module.exports = masterDetails;
