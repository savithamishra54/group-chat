const User = require("../models/user");

const Group = require("../models/group");

const userGroup = require("../models/user-group");

exports.addUser = (req, res, next) => {
  const groupid = req.params.id;
  const name = req.body.name;
  const userId = req.body.userid
  if (name == undefined || name.length == 0) {
    return res.status(400).json({ message: "Paramaters missing" });
  }
  User.findOne({ where: { name: name } })
   .then((user) => {
    
    console.log("hey hey hey hey hey hey",user)
      userGroup.create({
        isadmin: false,
        userId: user.id,
        groupId: groupid,
      });

      res.status(201).json({ message: "User added to group", success: true });
    })

    .catch((err) =>
      res.status(500).json({ message: "Something went wrong", success: false })
    );
};

exports.removeUser = (req, res, next) => {
  const groupid = req.params.id;
  const userId = req.body.userid;
  userGroup
    .destroy({ where: { userId: userId, groupId: groupid } })
    .then((response) => {
      res.status(200).json({ message: "User Removed", success: true });
    })
    .catch((err) => {
      res.status(500).json({ message: "Something Went wrong", success: false });
    });
};

exports.makeAdmin = (req, res, next) => {
  const groupid = req.params.id;
  const userId = req.body.userid;
  userGroup
    .update({ isadmin: true }, { where: { userId: userId, groupId: groupid } })
    .then((response) => {
      res.status(200).json({ message: "Successfull", success: true });
    })
    .catch((err) => {
      res.status(500).json({ message: "Something Went wrong", success: false });
    });
};

exports.removeAdmin = (req,res,next)=>{
  const groupid = req.params.id;
  const userId = req.body.userid;
  userGroup
    .update({ isadmin: false }, { where: { userId: userId, groupId: groupid } })
    .then((response) => {
      res.status(200).json({ message: "Successfull", success: true });
    })
    .catch((err) => {
      res.status(500).json({ message: "Something Went wrong", success: false });
    });
}
