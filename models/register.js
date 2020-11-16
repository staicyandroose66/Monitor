const mongoose = require("mongoose");

const adminRegSchema = mongoose.Schema({
 username:String,
 password:String
  
});
module.exports = mongoose.model("users", adminRegSchema);