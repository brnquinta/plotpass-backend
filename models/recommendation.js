const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    poster_path: {
      type: String,
      default: "",
    },
    vote_average: {
      type: Number,
      default: 0,
    },
    release_date: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const recommendationSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 500,
      trim: true,
    },
    movie: {
      type: movieSchema,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "read"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recommendation", recommendationSchema);