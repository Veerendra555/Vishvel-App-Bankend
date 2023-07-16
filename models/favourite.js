const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;

const favouriteSchema = mongoose.Schema({
  userid: {
    type: ObjectId,
    required: true,
  },
  favourite: {
    type: ObjectId,
    required: true,
  }
});

const favourite = mongoose.model("favourites", favouriteSchema);

module.exports = favourite;
