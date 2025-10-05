import { Error } from "../config/error.js";
import generateToken from "../config/token.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    const token = generateToken(user._id);
    if (!token) return Error(res, 404, "Token not generated, please try again");

    res.cookie("token", token, {
      httpOnly: true, // frontend cannot access it via JS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "None", 
      secure: true, 
    });

    const { password: pass, ...userWithoutPassword } = user._doc;

    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    return Error(res, 500, error.message || "Sign Up Error");
  }
};

export const LogIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return Error(res, 404, "Email or Password is incorrect");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return Error(res, 404, "Email or Password is incorrect");
    }

    const token = generateToken(user._id);

    if (!token) {
      return Error(res, 404, "Login Failed");
    }

    res.cookie("token", token, {
      httpOnly: true, // frontend cannot access it via JS
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
     sameSite: "None", 
      secure: true,
    });

    const { password: pass, ...userWithoutPassword } = user._doc;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    return Error(res, 500, error.message || "Log In Failed");
  }
};

export const LogOut = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return Error(res, 401, "You are not logged in");

  try {
    res.clearCookie("token", {
      httpOnly: true,
     sameSite: "None", 
      secure: true,
    });

    return res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    return Error(res, 400, error.message || "Logout failed!");
  }
};
