import * as generateService from "../services/generate.service.js";

export const generateNewStory = async (req, res) => {
  try {
    const story = await generateService.generateNewStoryService();
    res.send({ message: "success", body: story });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

export const storyContinuation = async (req, res) => {
  try {
    const story = await generateService.storyContinuationService(req.body);
    res.send({ message: "success", body: story });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

export const walkAway = async (req, res) => {
  try {
    const story = await generateService.walkAwayService(req.body);
    res.send({ message: "success", body: story });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

export const attackEnemy = async (req, res) => {
  try {
    const story = await generateService.attackEnemyService(req.body);
    res.send({ message: "success", body: story });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

export const playerWon = async (req, res) => {
  try {
    const story = await generateService.playerWonService(req.body);
    res.send({ message: "success", body: story });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

export const playerLost = async (req, res) => {
  try {
    const story = await generateService.playerLostService(req.body);
    res.send({ message: "success", body: story });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

export const saveNewStory = async (req, res) => {
  try {
    const story = await generateService.saveNewStoryService(req.body);
    res.send({ message: "success", body: story });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};

export const storyChoice = async (req, res) => {
  try {
    const story = await generateService.storyChoiceService(req.body);
    res.send({ message: "success", body: story });
  } catch (error) {
    res.status(400).send({ message: error });
  }
};
