const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;

const tandcSchema = mongoose.Schema({
  userid: {
    type: ObjectId,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
},{
  timestamps:true
});

const tandc = mongoose.model("termsandconditions", tandcSchema);

module.exports = tandc;
