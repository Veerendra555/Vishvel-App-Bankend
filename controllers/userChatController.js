const Messages = require("../models/usermessage");
const userDetails = require("../models/userdetail");

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
        date: msg.updatedAt
      };
    });
    res.json({	code: 200, msg: "Message added successfully." , result:projectedMessages});
  } catch (ex) {
    next(ex);
  }
};

module.exports.getAllMembersMessages = async (req, res, next) => {
  try {
    const  from  = req.params.userid;
    
    const userList = await userDetails.find({}).exec();
    const finalList=[];
    for(let i=0;i<userList.length;i++)
    {
      console.log("========>",from, userList[i]._id,from != userList[i]._id)
      if(from != userList[i]._id)
      {
      await Messages.findOne({
        users: {
          $all: [from, userList[i]._id.toString()],
        },
        }).sort({ updatedAt: -1 }).then((data)=>{
          console.log("Message Deta",data);
          if(data)
          {
            finalList.push({
            userDetails:{
             name: userList[i].name,
             businesslogo : userList[i].businesslogo,
             _id : userList[i]._id,
            },
            message : data.message.text,
            date: data.updatedAt
          })
         }
        }).catch(err=>{
          console.log(err);
        })
       }
    }
    
    // const projectedMessages = messages && messages.map((msg) => {
    //   return {
    //     fromSelf: msg.sender.toString() === from,
    //     message: msg.message.text,
    //     date: msg.updatedAt
    //   };
    // });
    res.json({	code: 200, msg: "Message added successfully." , result:finalList});
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