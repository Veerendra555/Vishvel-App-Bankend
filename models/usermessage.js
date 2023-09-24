const mongoose = require("../db/db");
var ObjectId = mongoose.Schema.Types.ObjectId;
// const bcrypt = require('bcrypt');

// let saltRounds = 10;

const MessageSchema = mongoose.Schema({
        message: {
          text: { type: String, required: true },
        },
        users: Array,
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "userdetails",
          required: true,
        },
      },
      {
        timestamps: true,
      });

const message = mongoose.model("Messages", MessageSchema);

module.exports = message;

