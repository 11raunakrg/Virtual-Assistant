import express from "express";
import {
  askGeminiAssistant,
  getCurrentUser,
  updateAssistant,
} from "../controllers/user.controllers.js";
import Auth from "../middlewares/Auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";

const userRouter = express.Router();

userRouter.get("/currentuser", Auth, getCurrentUser);
userRouter.post(
  "/updateuser",
  Auth,
  upload.single("assistantImage"),
  updateAssistant
);
userRouter.post("/askassistant", Auth, askGeminiAssistant);

export default userRouter;
