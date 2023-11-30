import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import Stories from "../models/Stories.js";
import { storyMode } from "../constants/modes.constants.js";

dotenv.config();
const openAi = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
  })
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const generateNewStoryService = async () => {
  try {
    const response = await openAi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            Generate a story for a RPG game and describe how the character looks shortly. 
            The game follows a step wise flow so the user should be able to continue the story afterwards.
            response should be in the following JSON format
            {
              story: "a CLOB of story",
              game_title: "A name for the game",
              character_name: "name of the main character",
              character_appearance: "concise and short description of game's main character's appearance. Character's weapon of choice should be a sword",
              ambience: "concise and short description of the ambience"
            }
          `,
        },
      ],
    });

    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const storyContinuationService = async (dataParams) => {
  const { id } = dataParams;
  try {
    const storyDoc = await Stories.findById(id);
    if (storyDoc.current_story_mode === storyMode.BEGINNING) {
      const response = await openAi.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
              We are creating a tabletop role-playing game style story. The initial story is as follows:
              Game Title: ${storyDoc.game_title},
              Protagonist Name: ${storyDoc.protagonist_name},
              Story Beginning: ${storyDoc.story_beginning},
              Now you need to continue the story. And then, you need to create two choices for the user to choose from
              which will decide the progression of the story.
              Please reply ONLY as a JSON in the format below.
              {
                continuation: "The continuation of the story",
                first_choice: "First choice for the user to choose from",
                second_choice: "Second choice for the user to choose from"
              }
            `,
          },
        ],
      });

      const parsedContent = JSON.parse(
        response.data.choices[0].message.content
      );

      const appendedStoryBlock = `The Story goes as follows. ${storyDoc.story_beginning},
        The protagonists name is ${storyDoc.protagonist_name},
        The protagonist looks like this. ${storyDoc.character_appearance},
        The ambience is something like this. ${storyDoc.ambience},
        This is the continuation of the story. ${parsedContent.continuation}
        `;

      const updatedStoryDoc = await Stories.findByIdAndUpdate(
        id,
        {
          current_story_mode: storyMode.CONTINUE,
          main_story: appendedStoryBlock,
        },
        { new: true }
      );

      const obj = {
        continuation: parsedContent.continuation,
        first_choice: parsedContent.first_choice,
        second_choice: parsedContent.second_choice,
        environment_image: storyDoc.environment_image,
        game_title: storyDoc.game_title,
      };

      return obj;
    } else if (storyDoc.current_story_mode === storyMode.CONTINUE) {
      const response = await openAi.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
              We are creating a tabletop role-playing game style story. The current story is as follows:
              Game Story: ${storyDoc.main_story},
              Now you need to continue the story. And then, you need to create two choices for the user to choose from
              which will decide the progression of the story.
              Please reply ONLY as a JSON in the format below.
              {
                continuation: "The continuation of the story",
                first_choice: "First choice for the user to choose from",
                second_choice: "Second choice for the user to choose from"
              }
            `,
          },
        ],
      });

      const parsedContent = JSON.parse(
        response.data.choices[0].message.content
      );

      const appendedStoryBlock = `${storyDoc.main_story}. And this is how the story continues. ${parsedContent.continuation}`;

      const updatedStoryDoc = await Stories.findByIdAndUpdate(
        id,
        {
          current_story_mode: storyMode.CONTINUE,
          main_story: appendedStoryBlock,
        },
        { new: true }
      );

      const obj = {
        continuation: parsedContent.continuation,
        first_choice: parsedContent.first_choice,
        second_choice: parsedContent.second_choice,
        environment_image: storyDoc.environment_image,
        game_title: storyDoc.game_title,
      };

      return obj;
    }
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const storyChoiceService = async (dataParams) => {
  const { id, choice } = dataParams;
  try {
    const storyDoc = await Stories.findById(id);
    const response = await openAi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
              We are creating a tabletop role-playing game style story. The initial story is as follows:
              Main Story: ${storyDoc.main_story},             
              And this is what the protagonist chooses to do. ${storyDoc.choice},
              Now you need to create a continuation for the story where the protagonist is facing a single enemy or a heard of enemies. And mention in the continuation that the
              protagonist is about to decide whether to attack the enemy or not. 
              Please reply ONLY as a JSON in the format below.
              {
                continuation: "The continuation of the story",
                enemy_appearance: "The appearance of the enemy",
                environment: "Description of the environment where the protagonist is facing the enemy",
                enemy_type: "This should return one of this 2 values: heard, single"
              }
            `,
        },
      ],
    });

    const parsedContent = JSON.parse(response.data.choices[0].message.content);

    const appendedStoryBlock = `${storyDoc.main_story},             
    And this is what the protagonist chooses to do. ${storyDoc.choice}
        `;

    const updatedStoryDoc = await Stories.findByIdAndUpdate(
      id,
      {
        current_story_mode: storyMode.CONTINUE,
        main_story: appendedStoryBlock,
      },
      { new: true }
    );

    const obj = {
      continuation: parsedContent.continuation,
      enemy_appearance: parsedContent.enemy_appearance,
      environment: parsedContent.environment,
      enemy_type: parsedContent.enemy_type,
    };

    return obj;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const walkAwayService = async (dataParams) => {
  const { id, continuation } = dataParams;
  try {
    const storyDoc = await Stories.findById(id);
    const response = await openAi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            We are creating a tabletop role-playing game style story. The current story is as follows:
            Game Story: ${storyDoc.main_story}, And the protagonist faces an enemy like this: ${continuation},
            Now you need to continue the story. The protagonist has decided to walk away from the fight.
            You need to create a continuation for the story while mentioning that the protagonist
            has decided to walk away from the fight. And then, you need to create two choices for the user to choose from
            which will decide the progression of the story.
            Please reply ONLY as a JSON in the format below.
            {
              continuation: "The continuation of the story while mentioning that the protagonist has decided to walk away from the fight",
              first_choice: "First choice for the user to choose from",
              second_choice: "Second choice for the user to choose from"
            }
          `,
        },
      ],
    });

    const parsedContent = JSON.parse(response.data.choices[0].message.content);

    const appendedStoryBlock = `${storyDoc.main_story}. And the protagonist faces an enemy like this: ${continuation},
    And this is how the story continues. The protagonist decide to walk away from the fight. And this is what happens next. ${parsedContent.continuation}`;

    const updatedStoryDoc = await Stories.findByIdAndUpdate(
      id,
      {
        current_story_mode: storyMode.CONTINUE,
        main_story: appendedStoryBlock,
      },
      { new: true }
    );

    const obj = {
      continuation: parsedContent.continuation,
      first_choice: parsedContent.first_choice,
      second_choice: parsedContent.second_choice,
    };

    return obj;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const attackEnemyService = async (dataParams) => {
  const { id, enemy_appearance, fighting_environment, continuation } =
    dataParams;
  try {
    const environmentPrompt = `create a gaming environment based on this description: ${fighting_environment}`;
    const enemyPrompt = `create a character model based on this description. Only the character model should be in the picture without any background: ${enemy_appearance}`;

    const environmentResponse = await openAi.createImage({
      prompt: environmentPrompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const enemyResponse = await openAi.createImage({
      prompt: enemyPrompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const environmentImageB64 = environmentResponse.data.data[0].b64_json;
    const environmentString = `data:image/jpeg;base64,${environmentImageB64}`;
    const environmentUrlDetails = await cloudinary.uploader.upload(
      environmentString
    );

    const enemyImageB64 = enemyResponse.data.data[0].b64_json;
    const enemyString = `data:image/jpeg;base64,${enemyImageB64}`;
    const enemyUrlDetails = await cloudinary.uploader.upload(enemyString);

    const environmentImageUrl = environmentUrlDetails.url;
    const enemyImageUrl = enemyUrlDetails.url;

    const storyDoc = await Stories.findById(id);

    const appendedStoryBlock = `${storyDoc.main_story}. And the protagonist faces an enemy like this: ${continuation},
    And this is how the story continues. The protagonist decide to fight with the enemy.`;

    const updatedStoryDoc = await Stories.findByIdAndUpdate(
      id,
      {
        current_story_mode: storyMode.CONTINUE,
        main_story: appendedStoryBlock,
        environment_image: environmentImageUrl,
        enemy_image: enemyImageUrl,
      },
      { new: true }
    );

    return updatedStoryDoc;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const playerWonService = async (dataParams) => {
  const { id } = dataParams;
  try {
    const storyDoc = await Stories.findById(id);
    const gameTitle = storyDoc.game_title;
    const response = await openAi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            We are creating a tabletop role-playing game style story. The current story is as follows:
            Game Story: ${storyDoc.main_story}, And the protagonist faced an enemy and he has won the fight.
            Now you need to create a continuation of the story. Mention what happened after he won the battle.
            And then, you need to create a suitable title for his achievement. And then you need to create a
            prompt that I could send to DALL-E to generate an image that represents the achievement.
            Please reply ONLY as a JSON in the format below.
            {
              continuation: "The continuation of the story after the protagonist won the battle",
              achievement_title: "First choice for the user to choose from",
              achievement_prompt: "Prompt to generate an image that represents the achievement"
            }
          `,
        },
      ],
    });

    const parsedContent = JSON.parse(response.data.choices[0].message.content);

    const continuation = parsedContent.continuation;
    const achievementTitle = parsedContent.achievement_title;
    const achievementPrompt = parsedContent.achievement_prompt;

    const achievementResponse = await openAi.createImage({
      prompt: achievementPrompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const achievementImageB64 = achievementResponse.data.data[0].b64_json;
    const achievementString = `data:image/jpeg;base64,${achievementImageB64}`;
    const achievementUrlDetails = await cloudinary.uploader.upload(
      achievementString
    );

    const achievementImageUrl = achievementUrlDetails.url;

    const obj = {
      continuation,
      achievementTitle,
      achievementImageUrl,
      gameTitle,
    };

    return obj;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const playerLostService = async (dataParams) => {
  const { id } = dataParams;
  try {
    const storyDoc = await Stories.findById(id);
    const gameTitle = storyDoc.game_title;
    const response = await openAi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            We are creating a tabletop role-playing game style story. The current story is as follows:
            Game Story: ${storyDoc.main_story}, And the protagonist faced an enemy and he has lst the fight.
            Now you need to create a continuation of the story. Mention what happened after he lost the battle.
            Please reply ONLY as a JSON in the format below.
            {
              continuation: "The continuation of the story after the protagonist lost the battle"
            }
          `,
        },
      ],
    });

    const parsedContent = JSON.parse(response.data.choices[0].message.content);

    const continuation = parsedContent.continuation;

    const obj = {
      continuation,
    };

    return obj;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

export const saveNewStoryService = async (story) => {
  try {
    const response = await openAi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `
            I'm trying to generate a conceptual gaming environment and a main protagonist image for a game.
            I need you to create a prompt that I could send to DALL-E to generate a gaming environment image based on
            the following information about the story and the ambience of the game.
            The story is: ${story.story}
            The game title is: ${story.game_title}
            The ambience is: ${story.ambience}
            And then I need you to create another prompt that I could send to DALL-E to generate a single protagonist image
            based on the following information about the protagonist.
            The protagonist's appearance is: ${story.character_appearance}
            Please note that the protagonist's weapon of choice should be a Projectile Weapon. 
            So I need to select a projectile from the following list based on the description of the protagonist.:
            a bullet, an arrow, a laser beam, a fireball, a magic speller, a ball, a sphere
            And I'm going to use this protagonist image and the projectile image as a gaming asset. And I'm planning to add an music to the story also. But I'm only using 5 different types of music. 
            Those 5 types are: "sci_fi", "medieval", "mysterious", "calm", "fantasy".
            So I need you to select the appropriate type of music for the story from those 5 types. And you should send the selected type along with
            the DALL-E prompts for creating the gaming environment, protagonist image and the projectile image. And your reply should be a JSON response
            containing the selected type of music and the DALL-E prompts for creating the gaming environment, protagonist image and the projectile image.
            Also note that these 3 prompts will be used separately. So your prompts should be unique and
            should have the ability to create gaming assets by themselves without relying on previous information. Please reply ONLY as a JSON in the format below.
            {
              environment: "The prompt to create the gaming environment",
              protagonist: "The prompt to create the protagonist. It should be a description of the protagonist's appearance and it should only contain 10 to 20 words.",
              projectile: "You should only output one of this values: a bullet, an arrow, a laser beam, a fireball, a magic speller, a ball, a sphere",
              music: "The selected type of music. This should only return one of this 5 values: sci_fi, medieval, mysterious, calm, fantasy"
            }
            `,
        },
      ],
    });

    const parsedData = JSON.parse(response.data.choices[0].message.content);

    const environmentPrePrompt = parsedData.environment;
    const protagonistPrePrompt = parsedData.protagonist;
    const projectilePrePrompt = parsedData.projectile;

    const environmentPrompt = `create a gaming environment based on this description: ${environmentPrePrompt}`;
    const protagonistPrompt = `create a character model based on this description. Only the character model should be in the picture without any background: ${protagonistPrePrompt}`;
    const projectilePrompt = `create a projectile based on this description. Only the projectile should be in the picture without any background: ${projectilePrePrompt}`;
    const music = parsedData.music;

    const environmentResponse = await openAi.createImage({
      prompt: environmentPrompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const protagonistResponse = await openAi.createImage({
      prompt: protagonistPrompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const projectileResponse = await openAi.createImage({
      prompt: projectilePrompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const environmentImageB64 = environmentResponse.data.data[0].b64_json;
    const environmentString = `data:image/jpeg;base64,${environmentImageB64}`;
    const environmentUrl = await cloudinary.uploader.upload(environmentString);

    const protagonistImageB64 = protagonistResponse.data.data[0].b64_json;
    const protagonistString = `data:image/jpeg;base64,${protagonistImageB64}`;
    const protagonistUrl = await cloudinary.uploader.upload(protagonistString);

    const projectileImageB64 = projectileResponse.data.data[0].b64_json;
    const projectileString = `data:image/jpeg;base64,${projectileImageB64}`;
    const projectileUrl = await cloudinary.uploader.upload(projectileString);

    const obj = {
      environmentUrl,
      protagonistUrl,
      projectileUrl,
      music,
    };

    return obj;
  } catch (error) {
    console.log(error);
    return error.message;
  }
};
