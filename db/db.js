const mongoose = require("mongoose");

class Mongoose {
  constructor() {
    try {
      mongoose.connect("mongodb+srv://vishvel:QzrZgPpCBKEIBoJU@cluster0.uq44rzt.mongodb.net/vishvel", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
      console.log("DB Connection Successfully.. Checking...")
      return mongoose;
    } catch (err) {
      console.log("Mongo Error: \n", err);
    }
  }
}

module.exports = new Mongoose();
