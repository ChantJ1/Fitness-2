const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const setSchema = new Schema(
  {
    reps: {
      type: Number,
      required: true,
    },
    load: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
); // Specify _id: false to prevent MongoDB from creating separate IDs for sets

const workoutSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    sets: [setSchema], // An array of sets
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workout", workoutSchema);
