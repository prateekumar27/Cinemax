import Booking from "../Models/Booking.model.js";
import Show from "../Models/Show.model.js";
import { clerkClient, getAuth } from "@clerk/express";
import User from "../Models/User.model.js";

export const isAdmin = async (req, res) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ success: false, error: "Unauthorized - no userId" });
    }

    const user = await clerkClient.users.getUser(userId);

    res.json({ success: true, isAdmin: user.privateMetadata.role === "admin" });
  } catch (error) {
    console.error("❌ isAdmin error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    const booking = await Booking.find({ isPaid: true });

    const activeShow = await Show.find({
      showDateTime: { $gte: new Date() },
    }).populate("movie");

    const totalUser = await User.countDocuments();

    const dashboardData = {
      totalBookings: booking.length,
      totalRevenue: booking.reduce((acc, curr) => acc + booking.amount, 0),
      activeShow,
      totalUser,
    };
    res.json({ success: true, dashboardData });
  } catch (error) {
    res.json({ success: false, error: error.message });
    console.log(error);
  }
};

export const getAllShows = async (req, res) => {
  try {
    await Show.find({ showDatetime: { $gte: new Date() } })
      .populate("movie")
      .sort({ showDateTime: 1 });
    res.json({ success: true, shows });
  } catch (error) {
    res.json({ success: false, error: error.message });
    console.log(error);
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user")
      .populate({
        path: "show",
        populate: {
          path: "movie",
        }.sort({ showDateTime: -1 }),
      });
    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, error: error.message });
    console.log(error);
  }
};
