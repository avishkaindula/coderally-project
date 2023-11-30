import axios from "axios";
import { portLink } from "../../port/port";

const apiUrl = portLink();

export const getAssets = async (dataParams) => {
  try {
    const results = await axios.post(
      `${apiUrl}/save/battle-assets`,
      dataParams
    );
    return results;
  } catch (err) {
    return err.response;
  }
};

export const playerWon = async (dataParams) => {
  try {
    const results = await axios.post(
      `${apiUrl}/generate/player-won`,
      dataParams
    );
    return results;
  } catch (err) {
    return err.response;
  }
};

export const playerLost = async (dataParams) => {
  try {
    const results = await axios.post(
      `${apiUrl}/generate/player-lost`,
      dataParams
    );
    return results;
  } catch (err) {
    return err.response;
  }
};

export const battleWonSave = async (dataParams) => {
  try {
    const results = await axios.post(
      `${apiUrl}/save/battle-won-save`,
      dataParams
    );
    return results;
  } catch (err) {
    return err.response;
  }
};

export const battleLostSave = async (dataParams) => {
  try {
    const results = await axios.post(
      `${apiUrl}/save/battle-lost-save`,
      dataParams
    );
    return results;
  } catch (err) {
    return err.response;
  }
};
