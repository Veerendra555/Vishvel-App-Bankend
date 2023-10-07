const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;
const contactLogTypeSchema = mongoose.Schema({
  userid: {
    type : Schema.Types.ObjectId,
    ref : "users"  
  },
  businessid: {
    type : Schema.Types.ObjectId,
    ref : "userdetails"  
  },
  contactLogType :{
    type : String,
    default: 'phonebook'
  },
    fav_status: {
      type : Boolean,
      default : true
    },
  contactTime: {
    type : Date,
    default : Date.now(),
  },
},{
  timestamps: true
});

const contact = mongoose.model("contactlog", contactLogTypeSchema);

module.exports = contact;
