// Authentication controller without jwt
const authService = require("../services/auth.service");

exports.signup = (req, res) => {
    console.log("signup api called");
    const {username, password} = req.body;

    try {
        const newUser = authService.signup(username, password);
        res.status(201).json({message: "User created successfully", user: newUser});    
    } catch (error) {
        res.status(400).json({message: error.message});     
    }
}

exports.login = (req, res) => {
    const {username, password} = req.body;

    try {
        const user = authService.login(username, password);
        res.status(200).json({message: "login successfully " , user: user});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
}

