const jwt = require("jsonwebtoken");

const  generateRefreshToken = (id)=> {
    return jwt.sign({id},process.env.SECRET,{expiresIn:"1d"});
    };
module.exports={generateRefreshToken}