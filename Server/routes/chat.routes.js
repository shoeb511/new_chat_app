const express = require("express");
const chatRouter = express.Router();
const {validate} = require("../services/auth.middleware");
const chatController = require("../controllers/chat.controller");

chatRouter.get("/loadChats/:userId", validate, chatController.getAllChatsOfUsertoUser);

module.exports = chatRouter;
