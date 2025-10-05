import express from "express";
import { LogIn, LogOut, signUp } from "../controllers/auth.controllers.js";
import { validateSignUp } from "../middlewares/validateSignup.middleware.js";
import { validateLogin } from "../middlewares/validateLogin.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", validateSignUp, signUp);
authRouter.post("/login", validateLogin, LogIn);
authRouter.get("/logout", LogOut);

export default authRouter;
