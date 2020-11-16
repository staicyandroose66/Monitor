const express = require('express');
const router=express.Router();
var request = require('request');
const cron = require('node-cron');
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// Require Business model in our routes module
let Monitor = require('../models/availability.model');
const { route } = require('./business.routes');



router.post('/',(req, res, next) => {
     const url_to_test = req.body.url;
     //const username = req.headers.cookie.username;
     const expected_time = req.body.expected_time;
     console.log('url to test : ' + url_to_test)
     console.log('expected time: ' +  expected_time)
      
     console.log("cookies: " + req.cookies.token) 
     const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY)
     const username = decoded.username;
   console.log('decode:' + decoded )
     request.get({url : url_to_test, time: true}, (err, response)=> {
        if(response){
           
            status_code = response.statusCode;
            console.log(status_code);
            url_uptime = response.elapsedTime;
            console.log('time' + url_uptime);
            
            if(response.statusCode == 200){
            
                const url_to_monitor = new Monitor({
                    _id: new mongoose.Types.ObjectId(),
                    url: req.body.url,
                    status: status_code,
                    uptime : url_uptime,
                    username: username
                  });
                 
                  url_to_monitor.save()
                    .then(result => {
                
                      res.send({
                        message: 'Available',
                        data: result,
                        expected_time : true
                      })
                
                    })
                    .catch(err => {
                      res.json({
                        message: 'an error occured!!',
                        error: err
                      })
                    })
                 
            }
           else{
            const url_to_monitor = new Monitor({
                _id: new mongoose.Types.ObjectId(),
                url: req.body.url,
                uptime : 0,
                status: status_code,
                username : username
              });
            
              url_to_monitor.save()
                .then(result => {
            
                  res.json({
                    message: 'Not available',
                    datas: result,
                  })
            
                })
                .catch(error => {
                  res.json({
                    message: 'an error occured!!',
                    err: error
                  })
                })     
           }
        }
        else{
          const url_to_monitor = new Monitor({
            _id: new mongoose.Types.ObjectId(),
            url: req.body.url,
            uptime : 0,
            status: 404,
            username : username
          });
        
          url_to_monitor.save()
            .then(result => {
        
              res.json({
                message: 'Not available',
                datas: result,
                status : 404
              })
        
            })
            .catch(error => {
              res.json({
                message: 'an error occured!!',
                err: error
              })
            })
        }
    })    
}
)


router.post('/time', (req, res, next) => {
    const url_to_test = req.body.url;
     console.log( url_to_test)
     request.get({url : url_to_test, time: true}, (err, response)=> {
         console.log('time' + response.elapsedTime);
        if(response){
            res.send('response time :  ' + response.timings)
        }
        else{
            res.send('not available')
        }
} 
)
})


router.get('/' , (req,res,next) => {
  
  /* Monitor.find() */
  console.log("cookies: " + req.cookies.token) 
  const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY)
  const username = decoded.username;
console.log('decode:' + decoded )

  Monitor.find({username:username}).sort({_id : -1}).limit(1)
  .then(lists_of_data =>{
    res.json({
      data:lists_of_data
    })
  })
  .catch(err =>{
    console.log(err)
  })
})


router.get('/recent' , (req,res,next) => {

  console.log("cookies: " + req.cookies.token) 
const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY)
const username = decoded.username;
console.log('decode:' + decoded )

  /* Monitor.find() */
  Monitor.find({username:username}).sort({_id : -1}).limit(5)
  .then(lists_of_data =>{
    res.json({
      data:lists_of_data
    })
  })
  .catch(err =>{
    console.log(err)
  })
})

router.get('/status' , (req,res,next) => {

  /* Monitor.find() */
  Monitor.collection.distinct("born_in_city").sort({_id : -1}).limit(10)
  .then(lists_of_data =>{
    res.json({
      data:lists_of_data
    })
  })
  .catch(err =>{
    console.log(err)
  })
})

router.get('/delete/:id', (req, res)=> {
  Monitor.findByIdAndRemove({ _id: req.params.id }, function (err, aurl) {
    if (err) res.json(err);
    else res.json('Successfully removed');
    
  });
});

module.exports = router;