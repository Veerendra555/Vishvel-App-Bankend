const Messages = require("../models/usermessage");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json({	code: 200, msg: "Message added successfully." , result:projectedMessages});
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
    console.log("user",req.body)
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({	code: 200, msg: "Message added successfully." });
    else return res.json({	code: 500, msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};