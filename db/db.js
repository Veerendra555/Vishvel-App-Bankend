const mongoose = require("mongoose");

class Mongoose {
  constructor() {
    try {
      mongoose.connect("mongodb://localhost:27017/vishvel", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
      return mongoose;
    } catch (err) {
      console.log("Mongo Error: \n", err);
    }
  }
}

module.exports = new Mongoose();
