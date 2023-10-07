const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

const reportContactSchema = mongoose.Schema({
  reportedBy : {
    type : Schema.Types.ObjectId,
         ref : "userdetails"  
     },
     reported :
    {
     type : Schema.Types.ObjectId,
      ref:"userdetails"  
    },  
    reason :  {
      type : String,
    },
    isActive:{
      type:Boolean, 
      default:true
  }

},{
  timestamps: true
});

const contact = mongoose.model("reportcontacts", reportContactSchema);

module.exports = contact;
