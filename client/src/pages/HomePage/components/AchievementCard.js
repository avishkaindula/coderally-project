import { Grid } from "@mui/material";
import React from "react";

const MAX_DESCRIPTION_LENGTH = 350;

const AchievementCard = ({ achievement }) => {
  const truncatedDescription =
    achievement.achievement_description.length > MAX_DESCRIPTION_LENGTH
      ? `${achievement.achievement_description.slice(
          0,
          MAX_DESCRIPTION_LENGTH
        )}...`
      : achievement.achievement_description;
  return (
    <React.Fragment>
      <Grid
        item
        md={4}
        container
        justifyContent="center"
        alignItems="center"
        marginTop={4}
      >
        <div className="w-[420px]">
          <img
            className="w-[422px] h-[300px] rounded-xl"
            src={achievement.achievement_image}
            alt="achievement"
          />
          <p className="text-sm pt-4">{truncatedDescription}</p>
          <button
            className="w-[422px] bg-gray-300 h-11 mt-6 rounded-t-lg"
            disabled
          >
            {achievement.achievement_title}
          </button>
          <button
            className="bg-[#19A7CE] text-white h-11 w-[422px] rounded-b-lg"
            disabled
          >
            {achievement.game_title}
          </button>
        </div>
      </Grid>
    </React.Fragment>
  );
};

export default AchievementCard;
