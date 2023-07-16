const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = mongoose.Schema({
  userid: {
    type: ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  category_image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  images: {
    type: Array,
    required: true,
  },
  mrp: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  }
});

const product = mongoose.model("products", productSchema);

module.exports = product;
