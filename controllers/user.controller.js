

const User = require("../models/user.model")
const axios = require('axios');
const jwt = require('jsonwebtoken')
const Movie = require('../models/movie.model')

// exports.searchMovies = async(req,res)=>{
//     try {
//         const {name} = req.body;
//         const newMovie= await Movie.create({
//             name 
//         })
    
//         // const user = await User.findOne(req.user.email);
//         const updatedUser = await User.findByIdAndUpdate({_id : req.user.id},{$push : {movieName : newMovie.id}}, {new : true})
//         res.status(200).json({
//             success : true,
//             User : updatedUser
//         })
    
//     } catch (error) {
//         return res.status(500).json({
//             success : false,
//             error : error.message
//         })
//     }
// }

exports.searchMovie = async(req,res)=>{
    try {
        const name = req.query.searchBox;
        // if(!name){
        //     return res.render('home',{
        //         user : false
        //     })
        // }
        // console.log(req.cookies["token"])
        let user;
        if(!req.cookies["token"]){
            user = false
        }else{
            const token = req.cookies['token'];
            const decoded = jwt.verify(token,process.env.SECRET_KEY);
            user = await User.findById(decoded.id);
        }
        
        axios.get(`http://www.omdbapi.com/?apikey=df4e2019&t=${name}`)
        .then((response)=>{
            // console.log(user)
            res.status(200).render('search',{
                data : response.data,
                user : user
            })
        })
    } catch (error) {
        res.status(500).json({
            error : error.message
        })
    }
}

exports.addMovie = async(req,res)=>{
    try {
        const name = req.query.name;
        // const {name} = req.body;
        const email = req.user.email;
        const user = await User.findOne({email}).populate('movieID')
        
        let size = user.movieID.length;
        let flag = false;
        // console.log('size of the movie array:- ',size)
        for (let index = 0; index < size; index++) {
            if(user.movieID[index].name == name)
                flag = true;
        }

        if(name != undefined && flag != true){
            axios.get(`http://www.omdbapi.com/?apikey=df4e2019&t=${name}`)
            .then(async(response)=>{
            // console.log(response.data.imdbID)

            const movieObj = new Movie({
                name : response.data.Title,
                poster: response.data.Poster,
                year : response.data.Year,
                rating : response.data.imdbRating,
                time : response.data.Runtime,
                genre : response.data.Genre,
                director : response.data.Director,
                language : response.data.Language,
                actors : response.data.Actors,
                country : response.data.Country,
                plot : response.data.Plot
            })
            const savedMovie = await movieObj.save()

            let updatedUser = await User.findByIdAndUpdate({_id : req.user.id},{$push : {movieID : savedMovie.id}}, {new : true}).populate("movieID") 

            return res.status(201).render('home',{
                success : true,
                user : updatedUser,
                data : false
            })

        })
        .catch((error)=>{
            console.log('error while fecting data from api.')
        })
    
        } else{
            return res.status(400).render('home',{
                success : false,
                message : "please give the name",
                user : user
            })
        }
    }
    catch (error) {
    return res.status(500).json({
        success : false,
        error : error.message,
    })
}
}

// exports.getMovieInfo = async(req,res)=>{
//     try {
//         console.log('here')
//         // const user= await User.findById(req.user.id)
//         const id = req.query.item; 
//         axios.get(`http://www.omdbapi.com/?apikey=df4e2019&i=${id}`)
//         .then((response)=>{
//             return res.status(200).json({
//                 success : true,
//                 movie : response.data
//             })
//         })
//         .catch((error)=>{
//             message : "error while fetching data from api."
//         })
//     } catch (error) {
//         return res.status(500).json({
//             success : false,
//             error : error.message
//         })
//     }
// }

exports.movieDetails = async(req,res)=>{
    try {
        const name = req.query.movieName;
        const movieObj = await Movie.find({name : name});
        let user;
        if(!req.cookies['token']){
            user = false;
        }else{
            const token = req.cookies['token'];
            user = jwt.verify(token,process.env.SECRET_KEY);

        }
        //  console.log(movieObj)
        return res.render('movieInfo',{
            movie : movieObj[0],
            user : user
        })

    } catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}