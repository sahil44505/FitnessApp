const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name :{
        type:String,
        required:true,
    },
    email :{
        type: String,
        required : true,
    },
  
   nickname:{
    type:String,
    required:true,
   },
    
});
const User = new mongoose.model('User',userSchema);
module.exports = User;