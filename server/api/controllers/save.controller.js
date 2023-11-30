import * as saveService from "../services/save.service.js";

export const saveInitialStoryData = async (req, res) => {
  try {
    const story = await saveService.saveInitialStoryDataService(req.body);
    res.send({ message: "success", body: story });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

export const getBattleAssets = async (req, res) => {
  try {
    const assets = await saveService.getBattleAssetsService(req.body);
    res.send({ message: "success", body: assets });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

export const battleWonSave = async (req, res) => {
  try {
    const save = await saveService.battleWonSaveService(req.body);
    res.send({ message: "success", body: save });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

export const battleLostSave = async (req, res) => {
  try {
    const save = await saveService.battleLostSaveService(req.body);
    res.send({ message: "success", body: save });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

export const getAchievements = async (req, res) => {
  try {
    const achievements = await saveService.getAchievementsService();
    res.send({ message: "success", body: achievements });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

export const getPreviousGames = async (req, res) => {
  try {
    const previousGames = await saveService.getPreviousGamesService();
    res.send({ message: "success", body: previousGames });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};
