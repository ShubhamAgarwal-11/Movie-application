const mongoose = require("mongoose")

const connectDB = async()=>{
    await mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("DB connection is sucessfully")
    })
    .catch((error)=>{
        console.log("error while connecting to DB")
        console.log(error)
    })
}

module.exports = connectDB;