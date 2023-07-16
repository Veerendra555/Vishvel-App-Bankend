const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;

const otpSchema = mongoose.Schema({
  userid: {
    type: ObjectId,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  isverified: {
    type: Boolean,
    required: false,
    default: false
  }
});

const otp = mongoose.model("otps", otpSchema);

module.exports = otp;
