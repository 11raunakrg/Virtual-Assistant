import { Error } from "../config/error.js";
import { User } from "../models/user.model.js";

export const validateSignUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name?.trim()) return Error(res, 400, "Please enter valid name");
  if (!email?.trim()) return Error(res, 400, "Please enter valid email");
  if (!password || password.length < 6)
    return Error(res, 400, "Password should be of atleast 6 characters");

  const isEmailPresent = await User.findOne({ email });

  if (isEmailPresent) return Error(res, 400, "This email already exists");

  next();
};
