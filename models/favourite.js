const mongoose = require("../db/db");
var Schema = mongoose.Schema;
const favouriteSchema = mongoose.Schema({
  userid: {
    type : Schema.Types.ObjectId,
    ref : "users" ,
    required: true,
  },
  favourite: {
    type : Schema.Types.ObjectId,
    ref : "users" ,
    required: true,
  }
});

const favourite = mongoose.model("favourites", favouriteSchema);

module.exports = favourite;
