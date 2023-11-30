import axios from "axios";
import { portLink } from "../../port/port";

const apiUrl = portLink();

export const generateNewStory = async () => {
  try {
    const results = await axios.get(`${apiUrl}/generate/new-story`);
    return results;
  } catch (err) {
    return err.response;
  }
};

export const generateGamingAssets = async (dataParams) => {
  try {
    const results = await axios.post(
      `${apiUrl}/generate/save-new-story`,
      dataParams
    );
    return results;
  } catch (err) {
    return err.response;
  }
};

export const saveNewStory = async (dataParams) => {
  try {
    const results = await axios.post(
      `${apiUrl}/save/initial-story-data`,
      dataParams
    );
    return results;
  } catch (err) {
    return err.response;
  }
};
