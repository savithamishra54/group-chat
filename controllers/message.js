const Message = require("../models/message");

const User = require("../models/user");

const Group = require('../models/group')

exports.sendmsg = (req, res, next) => {
  let groupid = req.params.id
  console.log(groupid)
  const { message } = req.body;
  console.log(req.body)
  if (message == undefined || message.length === 0) {
    return res.status(400).json({ err: "Parameters Missing" });
  } else {
    Message.create({ message, userId: req.user.id,groupId:groupid})
      .then((result) => {
        res.status(201).json({ message: "Message Sent", success: true });
      })
      .catch((err) => {
        res.status(500).json({ err: "Something went wrong" });
      });
  }
};

exports.retrievemsg = (req, res, next) => {
  let groupid = req.params.id
  Message.findAll({where:{groupId:groupid},
    include: [
      {
        model: User,
        required: false,
      },
    ],
    
  })
    .then((response) => {
      res.status(200).json({ data: response, success: true });
    })
    .catch((err) => {
      res.status(500).json({message:'Something Went Wrong',err})
    }
    );
};
