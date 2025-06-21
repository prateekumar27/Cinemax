import express from "express";
import {
  getNowPlayingMovies,
  addShow,
  getShows,
  getShow,
} from "../Controllers/Show.controller.js";
import { protectAdmin } from "../Middleware/auth.middleware.js";

const ShowRouter = express.Router();

ShowRouter.get("/now-playing", getNowPlayingMovies);
ShowRouter.post("/add", protectAdmin, addShow);

ShowRouter.get("/all", getShows);
ShowRouter.get("/:movieId", getShow);

export default ShowRouter;
