const express=require('express');
const mongoose = require("mongoose");
const router=express.Router();
const cookieParser = require('cookie-parser');
const User=require('../models/register')
const Monitor= require('../models/availability.model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');




//register
router.post('/' ,(req,res,next)=>
{
User.find({username:req.body.username})
    .exec()
    .then(user=>{
      if(user.length>=1)
      {
        return res.json({
          message:"User with this name/password already exists"
        })
      }
      else
      {
        bcrypt.hash(req.body.password,10,function(err,hashedPass)
        {
            if(err)
            {
                 res.json({
               error:err                  
                   })                         
            }  
            console.log(req.file); 
            
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              username:req.body.username,
            password:hashedPass,
            });
            
             
            user.save()
            .then(result=>{
              console.log(result);
              res.json({
                message:"User registered successfully",
                output : result
                })              
            })
            .catch(err=>{ 
                   console.log(err)
                   res.status(500).json({
                     error:err
                   })  
            } )                              
        })     
      }
    })
})

//user login
router.post('/login', (req, res, next) => {
    User.findOne({ 'username': req.body.username })
      .exec().then(user => {
        if (!user) {
            return res.status(401).json({ message: 'Auth failed' });
          }

        console.log('users:' + user)
        
        if (user.length < 1) {
          return res.status(401).json({ message: 'Username doesnot exist' });
        }
        if (user) {
          console.log('vfv' + user.password)
          bcrypt.compare(req.body.password, user.password, (err, result) => {
            if (err) {
              return res.status(401).json({ message: 'Password doesnot match' })
            }
              const token = jwt.sign({
                username: user.username, userId: user._id
              }, process.env.JWT_KEY,
                {
                  expiresIn: "1h"
                })
              res.cookie('token', token, { maxAge: 3600})
              res.status(200).json({ message: 'Login successful', token: token})
              res.end()
            })
         
        }
        
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Please enter a valid username' })
      })
  })
  
//listing all urls a user is monitoring
 router.get('/lists', (req,res,next) => {
//const username = req.cookies.token.username;
console.log("cookies: " + req.cookies.token) 
const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY)
const username = decoded.username;
console.log('decode:' + decoded )

Monitor.find({username:username}).then( data => {
  res.send(data)
}
)
 })
 
//user logout
router.get('/logout', (req,res,next)=>{
  res.clearCookie("token");
  res.send('Logged out')

})


module.exports = router;