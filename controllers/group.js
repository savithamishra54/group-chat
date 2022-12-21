const Message = require("../models/message");

const User = require("../models/user");

const Group = require('../models/group')

const userGroup = require('../models/user-group')

exports.createGroup = (req,res,next)=>{
    const {name} = req.body
    if (name == undefined || name.length === 0) {
        return res.status(400).json({ err: "Parameters Missing" });
      } else {
        console.log(req.user)
        let user = req.user
        // user.createGroup({name:name})
        Group.create({name:name})
        .then(group=>{
          userGroup.create({isadmin:true,userId:req.user.id,groupId:group.id})
          .then(response=>{
              res.status(201).json({message:'Group Created',success:true})
          })
           })
      .catch(err=>{
          res.status(500).json({message:'Something went wrong',err})
      })
      }
}

exports.fetchgroup = (req,res,next)=>{
  const groupid = req.params.id
  userGroup.findAll({where:{userId:req.user.id,}, include: [
    {
      model: Group,
      required: false,
    },
  ],})
  .then(response=>{
    res.status(200).json({data:response,success:true})
  })
  .catch(err=>{
    res.status(500).json({message:'something went wrong',err})
  })
}

exports.getgroupmembers = (req,res,next)=>{
  const groupid = req.params.id
  userGroup.findAll({where:{groupid:groupid}, include: [
    {
      model: User,
      required: false,
    },
  ]})
  .then(response=>{
    res.status(200).json({data:response,success:true,myuser:req.user})
  })
  .catch(err=>res.status(500).json({message:'Something went wrong'}))
}