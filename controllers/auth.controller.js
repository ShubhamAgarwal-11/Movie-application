const axios = require('axios')
const bcrypt = require('bcrypt')
const User = require('../models/user.model')
const jwt = require('jsonwebtoken')
const Movie = require('../models/movie.model')
const mongoose = require('mongoose')

exports.postSignup = async (req, res) => {
  try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all the details"
        });
        }

        // Check if the user already exists
        const existedUser = await User.findOne({ email });
        if (existedUser) {
        return res.status(401).render("signin", {
            user: false,
            msg: "User already exists... please login!!"
        });
        }

        // Hash the password
        let securePassword;
        try {
        securePassword = await bcrypt.hash(password, 10);
        } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error while hashing the password."
        });
        }

        // Create a new user with the random movie IDs
        const userObj = new User({
        name,
        email,
        password: securePassword,
        movieID: new mongoose.Types.ObjectId()
        });

        const savedUser = await userObj.save();
        // Respond with success
        return res.status(201).render("signin", {
            message: "User successfully created!!",
            user: false,
            data: false
        });

    } catch (error) {
        console.error('Error in postSignup:', error);
        return res.status(500).json({
        success: false,
        message: "Error while creating new user",
        error: error.message
        });
      }
};

exports.postLogin = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            res.status(400).json({
                success : false,
                message : "Please fill all the details"
            })
        }

        const user = await User.findOne({email}).populate('movieID')
        if(!user){
            return res.status(404).render("signup",{
                message : "user not registered.",
                user : false
            })
        }

        const payload = {
            id : user._id,
            email : user.email,
            name : user.name
        }

        if(await bcrypt.compare(password , user.password)){
            const token = await jwt.sign(payload,process.env.SECRET_KEY,{ expiresIn: '1h' })
            // user = user.toObject();
            // console.log(`token: ${token}`)
            user.password = undefined

            // res.cookie("token",token,{httpOnly : true}).status(200).json({
            //     success : true,
            //     user : user,
            //     message : "user login successfully"
            // })
            res.cookie("token",token,{httpOnly : true}).status(200).render("home",{
                user : user,
                data : false,
            })

        }else{
            res.status(400).json({
                success : false,
                message : "Password incorrect"
            })
        }
        
    } catch (error) {
        res.json({
            success : false,
            error : error.message
        })
    }
}

exports.getLogin = async(req,res)=>{
    res.render("signin",{
        user : false
    });
}
exports.getSignup = async(req,res)=>{
    res.render("signup",{
        user : false
    });
}
exports.logout = async(req,res)=>{
    res.clearCookie("token").render('signin',{
        user : false
    })
}

exports.home = async(req,res)=>{
    const id = req.user.id;
    const user = await User.findById({_id : id}).populate("movieID")
    // console.log("id:- ",user)
    return res.render('home',{
        user : user
    })
}