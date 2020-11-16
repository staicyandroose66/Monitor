const mongoose = require('mongoose');


  const EntrySchema = mongoose.Schema({
      url: String,
      status: Number,
      uptime : Number,
      username : String
  }, {
      timestamps: true
  });
  
  module.exports = mongoose.model('Entry', EntrySchema);


