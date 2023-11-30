import express from "express";
import {
  generateNewStory,
  saveNewStory,
  storyContinuation,
  storyChoice,
  walkAway,
  attackEnemy,
  playerWon,
  playerLost,
} from "../../controllers/generate.controller.js";

const router = express.Router();

router.get("/new-story", generateNewStory);
router.post("/save-new-story", saveNewStory);
router.post("/story-continuation", storyContinuation);
router.post("/story-choice", storyChoice);
router.post("/walk-away", walkAway);
router.post("/attack-enemy", attackEnemy);
router.post("/player-won", playerWon);
router.post("/player-lost", playerLost);

export default router;
