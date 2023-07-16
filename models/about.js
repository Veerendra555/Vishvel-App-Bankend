const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;

const aboutSchema = mongoose.Schema({
  userid: {
    type: String,
    required: true,
  },
  aboutus: {
    type: String,
    required: false,
  },
  experience: {
    type: String,
    required: false,
  },
  achievements: {
    type: String,
    required: false,
  },
  education: {
    type: String,
    required: false,
  },
  skills: {
    type: String,
    required: false,
  },
  other: {
    type: String,
    required: false,
  }
});

const about = mongoose.model("aboutus", aboutSchema);

module.exports = about;
