import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponse from "../gemini.js";
import moment from "moment";
import { Error } from "../config/error.js";

export const getCurrentUser = async (req, res) => {
  console.log(req.userId);
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("getCurrentUser error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAssistant = async (req, res) => {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;

    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    return res.status(200).json(user);
  } catch (error) {
    console.error("updateAssistant error:", error.message);
    return res.status(400).json({ message: "Updation of user failed!" });
  }
};

export const askGeminiAssistant = async (req, res) => {
  try {
    const { command } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return Error(res, 404, "User not found!");
    }

    user.history.push(command);
    user.save();

    const { name: userName, assistantName } = user;

    const result = await geminiResponse(command, assistantName, userName);

    let geminiResult;
    try {
      const jsonMatch = result.match(/{[\s\S]*}/);
      if (!jsonMatch) {
        return res.status(400).json({ response: "Sorry, I can't understand" });
      }
      geminiResult = JSON.parse(jsonMatch[0]);
    } catch (err) {
      return res.status(400).json({ response: "Invalid response format" });
    }

    let type = geminiResult.type?.toLowerCase().replace(/[_\s]/g, "-");

    const typeMap = {
      "get-date": "get-date",
      date: "get-date",
      "get-time": "get-time",
      time: "get-time",
      "get-day": "get-day",
      day: "get-day",
      "get-month": "get-month",
      month: "get-month",
      "google-search": "google_search",
      "youtube-search": "youtube_search",
      "youtube-play": "youtube_play",
      "calculator-open": "calculator_open",
      "instagram-open": "instagram_open",
      "facebook-open": "facebook_open",
      "weather-show": "weather_show",
      general: "general",
    };

    type = typeMap[type] || type;

    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput: geminiResult.userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });

      case "get-time":
        return res.json({
          type,
          userInput: geminiResult.userInput,
          response: `Current time is ${moment().format("hh:mm A")}`,
        });

      case "get-day":
        return res.json({
          type,
          userInput: geminiResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });

      case "get-month":
        return res.json({
          type,
          userInput: geminiResult.userInput,
          response: `Current month is ${moment().format("MMMM")}`,
        });

      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather_show":
      case "general":
        return res.json({
          type,
          userInput: geminiResult.userInput,
          response: geminiResult.response,
        });

      default:
        return res
          .status(400)
          .json({ response: "I didn't understand the command." });
    }
  } catch (error) {
    console.error("Assistant Error:", error);
    return res.status(500).json({ response: "Assistant Error." });
  }
};
