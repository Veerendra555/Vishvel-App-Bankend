const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;

const adminSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
  },
  mob_no:{
    type: String,
    required: true,
  },
  isActive:{
     type: Boolean,
     default : true
  },
  password:{
    type: String,
    required: true,
 }
},{
  timestamps:true
});

const admin = mongoose.model("admin", adminSchema);

module.exports = admin;
