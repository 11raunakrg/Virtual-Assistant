import { Error } from "../config/error.js";

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email?.trim()) return Error(res, 400, "Please enter email");
  if (!password?.trim()) return Error(res, 400, "Please enter valid password");

  next();
};
