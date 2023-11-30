import Stories from "../models/Stories.js";
import Achievements from "../models/Achievements.js";

export const saveInitialStoryDataService = async (dataParams) => {
  const {
    game_title,
    protagonist_name,
    story,
    character_appearance,
    ambience,
    environment_image,
    protagonist_image,
    projectile_image,
    music_type,
  } = dataParams;
  try {
    const gameStory = await Stories.create({
      game_title,
      protagonist_name,
      story_beginning: story,
      character_appearance,
      ambience,
      environment_image,
      protagonist_image,
      projectile_image,
      music_type,
    });

    return gameStory;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const getBattleAssetsService = async (dataParams) => {
  const { id } = dataParams;
  console.log(id);
  try {
    const storyDoc = await Stories.findById(id);

    return storyDoc;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const battleWonSaveService = async (dataParams) => {
  const { id, achievementImageUrl, gameTitle, achievementTitle, continuation } =
    dataParams;

  try {
    const achievement = await Achievements.create({
      game_title: gameTitle,
      achievement_title: achievementTitle,
      achievement_image: achievementImageUrl,
      achievement_description: continuation,
    });

    const storyDoc = await Stories.findById(id);
    const mainStory = storyDoc.main_story;

    const updatedStory = `${mainStory} And this is how the story continues after the protagonist won the battle.
    ${continuation}`;

    const updatedDoc = await Stories.findByIdAndUpdate(
      id,
      { main_story: updatedStory },
      { new: true }
    );

    return updatedDoc;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const battleLostSaveService = async (dataParams) => {
  const { id, continuation } = dataParams;

  try {
    const storyDoc = await Stories.findById(id);
    const mainStory = storyDoc.main_story;

    const updatedStory = `${mainStory} And this is how the story continues after the protagonist lost the battle.
    ${continuation}`;

    const updatedDoc = await Stories.findByIdAndUpdate(
      id,
      { main_story: updatedStory },
      { new: true }
    );

    return updatedDoc;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const getAchievementsService = async () => {
  try {
    const achievements = await Achievements.find({});

    return achievements;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const getPreviousGamesService = async () => {
  try {
    const previousGames = await Stories.find({});

    return previousGames;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};
