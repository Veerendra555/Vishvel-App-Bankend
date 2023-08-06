const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;

const templateSchema = mongoose.Schema({
  icon_color: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  template: {
    type: String,
    required: true,
  },
  template_type: {
    type: String,
    required: true,
  }
});

const template = mongoose.model("templates", templateSchema);

module.exports = template;
