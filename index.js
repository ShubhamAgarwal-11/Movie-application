require('dotenv').config({path : './.env'})
const express = require('express')
const PORT = process.env.PORT || 4000
const app = express();
const db  = require("./db/db");
const path = require('path')
db();
const cookieParser = require('cookie-parser');

app.set('view engine' , 'ejs')
app.set('views',path.resolve('./views'))
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use("/",require('./routers/index'))



app.listen(PORT,()=>{
    console.log("Server is running on port",PORT)
})