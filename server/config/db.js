import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("✅ Databse Connected to backend");
  } catch (error) {
    console.log(
      "❌ An error occured while connecting database, ",
      error.message
    );
  }
};

export default connectDB;
