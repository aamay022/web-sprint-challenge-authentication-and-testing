const { JWT_SECRET } = require("../secrets");
const jwt = require('jsonwebtoken')
const {
  findBy
} = require('../auth/users-model')


const checkUsernameExists = async (req, res, next) => {
 try{
   const [user] = await findBy({username: req.body.username})
   if(!user){
     next({status:401, message: "Invalid credentials"})
   }else{
     req.user = user
     next()
   }
 }catch(err){
   next(err)
 }
}

function checkAccountPayload(req, res, next){
  const error = {status:400}
  const {username, password} = req.body

  if(username === undefined || password === undefined){
    error.message = "username and password required"
  }

  if(error.message){
    next(error)
  }else{
    next()
  }
}

const restricted = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    return next({ status: 401, message: "token required" })
  }
  jwt.verify(token, JWT_SECRET, (err, decoded)=> {
    if (err) {
      return next({ status: 401, message: "token invalid" })
    }
    req.decodedjwt = decoded
    next()
  })
}

module.exports = {
  checkUsernameExists, checkAccountPayload, restricted
}
