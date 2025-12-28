const jwt = require("jsonwebtoken");

exports.validate = (req, res, next) => {
    try {
         // fetch the autherisation header
         const authHeader = req.headers.authorization;

         if(!authHeader) {
            return res.status(401).json({message : "authorization header missing "});
         }

         // seprate the token from header
         const token = authHeader.split(" ")[1];

         if(!token){
            return res.status(401).json({message : "missing token"});
         }

         // check whether the token is valid or not using jwt 
         const decoded = jwt.verify(token, process.env.JWT_SECRET);

         // attach trusted user id to requested user id 
         req.userId = decoded.userId;

         next();
    }
    catch(error) {
        return res.status(401).json({message : "invalid or expired token "});
    }
};