const jwtAuthService = require("../services/auth.service");

exports.jwtsignup = async (req, res) => {
    console.log("jwt auth controller sighup called");

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

        const response = await jwtAuthService.login(username, password);

        console.log("login response in controller", response.user.userId, response.user.username);

        res.status(201).json({
            token: response.token,
            userId: response.user.userId,
            username: response.user.username
        });

    }

    catch(error) {
        res.status(400).json({message:error.message});
    }
}