const userService = require("../services/user.service");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(201).json(users);
    }
    catch(err) {
        res.status(500).json({
            message: err.message || "users not found"
        });
    }
}
