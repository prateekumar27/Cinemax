import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/dbconnect.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./Inggest/index.js";
import ShowRouter from "./Routes/Show.route.js";
import BookingRouter from "./Routes/Booking.route.js";
import AdminRouter from "./Routes/Admin.route.js";
import UserRouter from "./Routes/User.route.js";
import { stripeWebhook } from "./Controllers/StripeWebhook.js";

dotenv.config();

const server = express();

const port = 3000;

server.use(clerkMiddleware());

await connectDB();

//Stripe Route

server.use(
  "/api/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

//Middleware
server.use(express.json());
server.use(cors());

//Routes
server.get("/", (req, res) => {
  res.send("server is running");
});
server.use("/api/inngest", serve({ client: inngest, functions }));

server.use("/api/show", ShowRouter);
server.use("/api/booking", BookingRouter);
server.use("/api/admin", AdminRouter);
server.use("/api/user", UserRouter);

server.use((err, req, res, next) => {
  console.error("Unhandled error:", err); // 💥
  res
    .status(500)
    .json({ success: false, error: err.message || "Internal Server Error" });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
