import express from "express";
import {
  getUserBooking,
  updateFavorite,
  getFavorites,
} from "../Controllers/User.controller.js";

const UserRouter = express.Router();

UserRouter.get("/booking", getUserBooking);
UserRouter.post("/update-favorite", updateFavorite);
UserRouter.get("/favorites", getFavorites);

export default UserRouter;
