import express from "express";
import {
  saveInitialStoryData,
  getBattleAssets,
  battleWonSave,
  battleLostSave,
  getAchievements,
  getPreviousGames,
} from "../../controllers/save.controller.js";

const router = express.Router();

router.post("/initial-story-data", saveInitialStoryData);
router.post("/battle-assets", getBattleAssets);
router.post("/battle-won-save", battleWonSave);
router.post("/battle-lost-save", battleLostSave);
router.get("/get-achievements", getAchievements);
router.get("/get-previous-games", getPreviousGames);

export default router;
