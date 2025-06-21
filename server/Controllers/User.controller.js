import { clerkClient } from "@clerk/express";
import Booking from "../Models/Booking.model.js";
import Movie from "../Models/Movie.model.js";


export const getUserBooking = async (req, res) => {
  try {
    const user = req.auth().userId;

    const userBookings = await Booking.find({ user: user })
      .populate({
        path: "show",
        populate: {
          path: "movie",
        },
      })
      .sort({ createdAt: -1 });

    res.json({ success: true, userBookings });
  } catch (error) {
    res.json({ success: false, error: error.message });
    console.log(error);
  }
};

export const updateFavorite = async (req, res) => {
  try {
    const { movieId } = req.body;
    const { userId } = req.auth().userId;

    const user = await clerkClient.users.getUser(userId);

    if (!user.privateMetadata.favorites) {
      user.privateMetadata.favorites = [movieId];
    }

    if (!user.privateMetadata.favorites.includes(movieId)) {
      user.privateMetadata.favorites.push(movieId);
    } else {
      user.privateMetadata.favorites = user.privateMetadata.favorites.filter(
        (item) => item !== movieId
      );
    }

    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: user.privateMetadata,
    });

    res.json({ success: true, message: "Favorite updated" });
  } catch (error) {
    res.json({ success: false, error: error.message });
    console.log(error);
  }
};

export const getFavorites = async (req, res) => {
  try {
    const user = await clerkClient.users.getUser(req.auth().userId);
    const favorites = user.privateMetadata.favorites;

    const movies = await Movie.find({ _id: { $in: favorites } });

    res.json({ success: true, movies });
  } catch (error) {
    res.json({ success: false, error: error.message });
    console.log(error);
  }
};
