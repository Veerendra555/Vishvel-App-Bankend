const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

const templateSchema = mongoose.Schema({
  userid: {
    type : Schema.Types.ObjectId,
         ref : "user"  
  },
  template: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
  },
  isActive:{
    type: Boolean,
    default : true,
  }
},
{
  timestamps: true
});

const template = mongoose.model("templates", templateSchema);



module.exports = template;
