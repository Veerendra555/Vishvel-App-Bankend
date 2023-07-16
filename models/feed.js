const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;

const feedSchema = mongoose.Schema({
  userid: {
    type: ObjectId,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  businesslogo: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  }
});

const feed = mongoose.model("feeds", feedSchema);

module.exports = feed;
