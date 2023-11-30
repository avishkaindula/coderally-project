import axios from "axios";
import { portLink } from "../../port/port";

const apiUrl = portLink();

export const generateContinuation = async (id) => {
  try {
    const results = await axios.post(
      `${apiUrl}/generate/story-continuation`,
      id
    );
    return results;
  } catch (err) {
    return err.response;
  }
};

export const storyChoice = async (dataParams) => {
  try {
    const results = await axios.post(
      `${apiUrl}/generate/story-choice`,
      dataParams
    );
    return results;
  } catch (err) {
    return err.response;
  }
};

export const walkAway = async (dataParams) => {
  try {
    const results = await axios.post(
      `${apiUrl}/generate/walk-away`,
      dataParams
    );
    return results;
  } catch (err) {
    return err.response;
  }
};

export const attackEnemy = async (dataParams) => {
  try {
    const results = await axios.post(
      `${apiUrl}/generate/attack-enemy`,
      dataParams
    );
    return results;
  } catch (err) {
    return err.response;
  }
};
