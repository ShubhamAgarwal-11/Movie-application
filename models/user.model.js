const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    movieID : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Movie",    
        unique : true
    }]
})

module.exports = mongoose.model("User" , userSchema)