const User = require('../models/user.js')
const bcrypt = require('bcrypt')
const userGroup = require('../models/user-group')
const token = require('jsonwebtoken')

exports.signup = (req,res,next)=>{
    const {name,email,number,password} = req.body
    if(name == undefined || name.length === 0 
        || email == undefined || email.length === 0
        || number == undefined || number.length === 0
        || password == undefined || password.length === 0)
        {
            return res.status(400).json({err:'Parameters Missing'})
        }
        
        User.findAll()
        .then(users=>{ 
                bcrypt.hash(password, 10 , async(err,hash)=>{
                    console.log(err)
                    await User.create({name,email,number,password:hash})
                    .then(res.status(201).json({message:'User Successfully Created'}))
                    .catch(err=>res.status(500).json({message:'Something went wrong'}))
                })
               
            
        })
        .catch(err=>res.status(500).json({err:'Something Went wrong'}))
   
}

function generateToken(id) {
    return token.sign({userId:id}, 'secretkey')
}


exports.login=(req,res,next) =>{
    const{email,password} = req.body
    if(email == undefined || email.length === 0
        || password == undefined || password.length === 0)
        {
            return res.status(400).json({err:'Email Id or Password Missing',success:false})
        }
        User.findAll({where:{email}})
        .then(async(user)=>{
           
           let usergroup = await userGroup.findAll({where:{userId:user[0].id}})
            if(user.length>0){
                bcrypt.compare(password, user[0].password, (err,result)=>{
                    if(err) {
                        res.status(400).json({message:'Something went wrong'})
                    }
                    if(result === true){
                        res.status(200).json({message:'Successfully logged in', success:true,
                         token:generateToken(user[0].id),user:user,usergroup:usergroup})
                    } else {
                        res.status(400).json({message: 'Password did not match', success:false})
                    }
                })
               
            } else {
                res.status(404).json({message:'User does not exist'})
            }
        })

        .catch(err=>{
            console.log(err)
            res.status(500).json({message:err, success:false})
        })
}