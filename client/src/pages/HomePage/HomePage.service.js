import axios from "axios";
import { portLink } from "../../port/port";

const apiUrl = portLink();

export const getAchievements = async () => {
  try {
    const results = await axios.get(`${apiUrl}/save/get-achievements`);
    return results;
  } catch (err) {
    return err.response;
  }
};
