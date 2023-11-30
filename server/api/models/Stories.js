import mongoose from "mongoose";
import { storyMode } from "../constants/modes.constants.js";

const storiesSchema = mongoose.Schema({
  main_story: {
    type: String,
  },
  game_title: {
    type: String,
  },
  protagonist_name: {
    type: String,
  },
  story_beginning: {
    type: String,
  },
  character_appearance: {
    type: String,
  },
  ambience: {
    type: String,
  },
  environment_image: {
    type: String,
  },
  protagonist_image: {
    type: String,
  },
  projectile_image: {
    type: String,
  },
  enemy_image: {
    type: String,
  },
  music_type: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  current_story_mode: {
    type: String,
    default: storyMode.BEGINNING,
  },
});

const Stories = mongoose.model("stories", storiesSchema);

export default Stories;
