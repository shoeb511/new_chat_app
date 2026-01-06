const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const jwtAuthController = require("../controllers/jwtAuth.controller");
const authMiddleware = require("../services/auth.middleware")

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/jwtsignup", jwtAuthController.jwtsignup);
router.post("/jwtlogin", jwtAuthController.jwtlogin);

// token validation middleware route
// router.get("/validate", authMiddleware.validate);
router.get(
  "/validate",
  authMiddleware.validate,
  (req, res) => {
    res.status(200).json({
      message: "token is valid",
      userId: req.userId
    });
  }
);


// // message handler routes
// const mh_controller = require("../controllers/messageHandler.cntroller");

// router.get("/mhtest", mh_controller.messagehandler);


module.exports = router;