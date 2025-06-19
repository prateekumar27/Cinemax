import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/Cinemax`);
    console.log("Database connected");
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
