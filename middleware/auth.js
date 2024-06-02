const jwt = require('jsonwebtoken')

exports.auth = async(req,res,next)=>{
    try {
        // console.log(req.cookies)
        const token = req.cookies["token"];
        // const token = req.header('Authorization').replace('Bearer ', '')
        console.log(token)
        if(!token){
            return res.render('signin',{
                success : false,
                message : "token not found",
                user : false,
            })
        }
        try {
            const decoded = jwt.verify(token,process.env.SECRET_KEY)
            console.log(decoded)
            req.user = decoded;
            
        } catch (error) {
            return res.status(500).json({
                success : false,
                message : "something went wrong while verifying the token"
            })
        }
        next();
    } catch (error) {
        res.status(500).json({
            success : false,
            message : "invalid token",
            error : error.message
        })
    }
}
