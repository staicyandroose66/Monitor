  
const express = require("express");
const app = express();

const cors = require('cors');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
//importing Routes
const businessRoute = require('../api/routes/business.routes');
const availabilityRoute = require('./routes/availability');
//both edit profile and password changings in routes/changepassword.js
//const editingsRoutes = require('./routes/changepassword');
const registerRoutes = require('./routes/register');
const listRoutes = require('./routes/register');
//const walletRoutes = require('./routes/addingWallet'); 
const corsConfig = {
  origin: 'http://localhost:3001',
  credentials: true,
};

app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser())

const url =
"mongodb+srv://staice:staice2010@cluster1.jgugv.mongodb.net/monitoring?retryWrites=true&w=majority";
 
mongoose
  .connect(url, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true , useFindAndModify: false })
  .then(() => {
    console.log("connected.....");
  });


  app.use('/business', businessRoute);
  app.use('/testavailability',availabilityRoute);
  //app.use('/settings/changepassword', changepwdRoutes);
//   app.use('/settings', editingsRoutes);
  app.use('/register',registerRoutes);
 // app.use('/',walletRoutes);
 
module.exports = app;