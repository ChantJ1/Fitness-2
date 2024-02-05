const Workout = require("../models/workoutModel");
const mongoose = require("mongoose");

// get all workouts
const getWorkouts = async (req, res) => {
  const user_id = req.user._id;

  const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 });

  res.status(200).json(workouts);
};

// get a single workout
const getWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such workout" });
  }

  const workout = await Workout.findById(id);

  if (!workout) {
    return res.status(404).json({ error: "No such workout" });
  }

  res.status(200).json(workout);
};

// create new workout
const createWorkout = async (req, res) => {
  const { title, sets } = req.body;

  if (!title || !sets || sets.length === 0) {
    return res
      .status(400)
      .json({ error: "Please provide a title and at least one set" });
  }

  try {
    const user_id = req.user._id;
    const workout = await Workout.create({ title, sets, user_id });
    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a workout
const deleteWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such workout" });
  }

  const workout = await Workout.findOneAndDelete({ _id: id });

  if (!workout) {
    return res.status(400).json({ error: "No such workout" });
  }

  res.status(200).json(workout);
};

// update a workout
const updateWorkout = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such workout" });
  }

  const { title, sets } = req.body;

  if (!title || !sets || sets.length === 0) {
    return res
      .status(400)
      .json({ error: "Please provide a title and at least one set" });
  }

  try {
    const workout = await Workout.findByIdAndUpdate(
      id,
      { title, sets },
      { new: true }
    );

    if (!workout) {
      return res.status(400).json({ error: "No such workout" });
    }

    res.status(200).json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getWorkouts,
  getWorkout,
  createWorkout,
  deleteWorkout,
  updateWorkout,
};
