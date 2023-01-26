const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ability: {
    type: Boolean,
    required: true,
  },
  startDate: {
    type: String,
  },
  suitColors: {
    type: String,
    required: true,
  },
  startingPower: {
    type: Number,
    required: true,
  },
  currentPower: {
    type: Number,
  },
  img: {
    type: String,
  },
  remainingPowerUp: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Hero = mongoose.model("Hero", heroSchema);

module.exports = Hero;
