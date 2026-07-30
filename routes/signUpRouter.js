const express = require("express");
const signUpRouter = express.Router();
const authController = require("../controllers/authController");

const validateSignUp = require("../validators/signUpValidator");

signUpRouter.get("/", authController.getSignUpPage);
signUpRouter.post("/", validateSignUp, authController.postSignUp);

module.exports = signUpRouter;
