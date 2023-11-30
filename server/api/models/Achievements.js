import mongoose from "mongoose";

const achievementsSchema = mongoose.Schema({
  game_title: {
    type: String,
  },
  achievement_title: {
    type: String,
  },
  achievement_description: {
    type: String,
  },
  achievement_image: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
});

const Achievements = mongoose.model("achievements", achievementsSchema);

export default Achievements;
