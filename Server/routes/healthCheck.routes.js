const express = require("express");
const healthCheckRouter = express.Router();
const {validate} = require("../services/auth.middleware");
const healthController = require("../controllers/healthCheck.controller");


healthCheckRouter.get("/healthCheck", healthController.getHealth);

module.exports = healthCheckRouter;