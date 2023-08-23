const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;
const dealSchema = mongoose.Schema({
  userid: {
    type : Schema.Types.ObjectId,
    ref : "userdetails" 
 },
  deal_image: {
    type: String,
    required: true,
  },
   date:{
     type : Date,
      default : Date.now()
   },
  is_active:{
     type : Boolean,
     default : true
  }
},{
  timestamps: true
});

const deal = mongoose.model("deal", dealSchema);

module.exports = deal;
