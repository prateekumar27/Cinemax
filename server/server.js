import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/dbconnect.js";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import { inngest, functions } from "./Inggest/index.js";

const server = express();

const port = 3000;

server.use(clerkMiddleware());

await connectDB();

//Middleware
server.use(express.json());
server.use(cors());

//Routes
server.get("/", (req, res) => {
  res.send("server is running");
});
app.use("/api/inngest", serve({ client: inngest, functions }));

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
