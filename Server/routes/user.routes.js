const express = require("express");
const user_router = express.Router();
const userController = require("../controllers/user.controller");

user_router.get("/allUsers", userController.getAllUsers);

module.exports = user_router;