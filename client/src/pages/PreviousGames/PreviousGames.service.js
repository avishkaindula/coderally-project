import axios from "axios";
import { portLink } from "../../port/port";

const apiUrl = portLink();

export const getPreviousGames = async () => {
  try {
    const results = await axios.get(`${apiUrl}/save/get-previous-games`);
    return results;
  } catch (err) {
    return err.response;
  }
};
