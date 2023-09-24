const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema = mongoose.Schema({
  mob_no: {
    type: String,
    required: true,
  },
  exists: {
    type: Boolean,
    required: true,
  },
  isdeleted: {
    type: Boolean,
    required: false,
    default: false
  },
  

});

const user = mongoose.model("users", userSchema);

module.exports = user;
