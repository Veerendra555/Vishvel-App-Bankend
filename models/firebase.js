const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;

const firebaseSchema = mongoose.Schema({
  userid: {
    type: ObjectId,
    required: true,
  },
  title: {
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

const firebase = mongoose.model("firebase", firebaseSchema);

module.exports = firebase;
