const express = require('express')
const router = express.Router();
const authController = require('../controllers/auth.controller')
const userController = require("../controllers/user.controller")
const auth = require('../middleware/auth')

// router.get('/',authController.home)

router.get('/',authController.getLogin)
router.get('/signup',authController.getSignup)
router.get('/logout',authController.logout)

router.post('/signupUser',authController.postSignup)
router.post('/loginUser',authController.postLogin)

router.get('/search',userController.searchMovie)
router.get('/addMovie',auth.auth,userController.addMovie)
router.get('/home',auth.auth,authController.home)
router.get('/movieDetails',userController.movieDetails)

// router.get("/test",userController.test)

module.exports = router;