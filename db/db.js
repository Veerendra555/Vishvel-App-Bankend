const mongoose = require("mongoose");

class Mongoose {
  constructor() {
    try {
     //"mongodb+srv://vishvel:QzrZgPpCBKEIBoJU@cluster0.uq44rzt.mongodb.net/vishvel"
      mongoose.connect("mongodb+srv://24ed1ae9ed:QXlNEkMyJoW2qhOc@cluster0.bzfz6tv.mongodb.net/vishvel", {
        useNewUrlParser: true,
        // useCreateIndex: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
      });
      console.log("DB Connection Successfully.. Checking...")
      return mongoose;
    } catch (err) {
      console.log("Mongo Error: \n", err);
    }
  }
}

module.exports = new Mongoose();
