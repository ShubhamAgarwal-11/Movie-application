const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    poster: {
        type : String
    },
    year: {
        type : Number,
        required : true
    },
    rating:{
        type : Number,
        required : true
    },
    time : {
        type: String,
        required: true
    },
    genre: {
        type : String
    },
    language: {
        type : String,
    },
    director: {
        type : String
    },
    actors:{
        type : String
    },
    country:{
        type : String,
        required : true
    },
    plot:{
        type : String,
    }
})

module.exports = mongoose.model("Movie" , movieSchema);