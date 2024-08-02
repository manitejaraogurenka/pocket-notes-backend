import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import colors from "colors";
import groupRoutes from "./routes/groupRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import errorHandlers from "./middleware/errorMiddleware.js";
import { Server } from "socket.io";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

connectDB();

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`.yellow.bold);
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/api", groupRoutes);
app.use("/api", noteRoutes);

app.use(errorHandlers.notFound);
app.use(errorHandlers.errorHandler);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});
