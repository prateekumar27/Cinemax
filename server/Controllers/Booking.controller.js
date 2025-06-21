import { inngest } from "../Inggest/index.js";
import Booking from "../Models/Booking.model.js";
import Show from "../Models/Show.model.js";

import dotenv from "dotenv";
import Stripe from "stripe";

dotenv.config();

const checkSeatsAvailability = async (showId, selectesdSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats;

    const isAnySeatTaken = selectesdSeats.some((seat) => occupiedSeats[seat]);

    return !isAnySeatTaken;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const { origin } = req.headers;

    const isAvailable = await checkSeatsAvailability(showId, selectedSeats);

    if (!isAvailable) {
      return res
        .status(400)
        .json({ success: false, error: "Selected seats are already taken" });
    }

    const showData = await Show.findById(showId).populate("movie");

    const newBooking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats,
    });

    selectedSeats.map((seat) => {
      showData.occupiedSeats[seat] = userId;
    });

    showData.markModified("occupiedSeats");
    await showData.save();

    //Stripe

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: showData.movie.title,
          },
          unit_amount: Math.floor(Booking.amount) * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-bookings`,
      cancel_url: `${origin}/my-bookings`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        bookingId: booking._id.toString(),
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    newBooking.paymentLink = session.url;
    await newBooking.save();


await inngest.send({
  name: "app/checkpayment",
  data: {
    bookingId: newBooking._id.toString(),
  },
});


    res.json({ success: true, url: session.url });
  } catch (error) {
    res.json({ success: false, error: error.message });
    console.log(error);
  }
};

export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);
    const occupiedSeats = Object.keys(showData.occupiedSeats);

    res.json({ success: true, occupiedSeats: showData.occupiedSeats });
  } catch (error) {
    res.json({ success: false, error: error.message });
    console.log(error);
  }
};
