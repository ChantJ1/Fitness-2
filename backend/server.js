require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/user");
const friendRoutes = require("./routes/friendRoutes"); // Add this line
const cors = require("cors"); // If you're planning to use CORS

// express app
const app = express();

// middleware
app.use(express.json());

// Optional: Configure CORS Middleware if your frontend is hosted on a different origin
app.use(
  cors({
    // Adjust the origin according to where your frontend is hosted
    origin: "http://localhost:3000", // For development, you might use '*' for allowing any origin or specify your frontend app's URL for production
    methods: ["GET", "POST", "DELETE", "PUT"], // Add any other HTTP methods your app uses
  })
);

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// routes
app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);
app.use("/api/friends", friendRoutes); // Use friend routes

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen for requests
    app.listen(process.env.PORT, () => {
      console.log("connected to db & listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
