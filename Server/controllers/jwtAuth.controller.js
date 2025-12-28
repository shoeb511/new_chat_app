const jwtAuthService = require("../services/auth.service");

exports.jwtsignup = async (req, res) => {
    console.log("jwt auth controller called");

    try{
        const {username, password} = req.body;

        const user = await jwtAuthService.signup(username, password);

        res.status(201).json(user);
    }
    catch(error) {
        res.status(400).json({message: error.message});
    }
}


exports.jwtlogin = async (req, res) => {
    console.log("jwt auth controller login called");

    try {
        const {username, password} = req.body;

        const user = await jwtAuthService.login(username, password);

        res.status(201).json(user);
    }

    catch(error) {
        res.status(400).json({message:error.message});
    }
}