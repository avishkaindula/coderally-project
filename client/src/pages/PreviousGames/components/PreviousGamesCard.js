import { Grid } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  STORY_PAGE,
  VIEW_STORY_PAGE,
} from "../../../constants/routes.constants";

const MAX_DESCRIPTION_LENGTH = 350;

const AchievementCard = ({ previousGame }) => {
  const navigate = useNavigate();

  const continueClick = () => {
    sessionStorage.setItem("storyId", previousGame._id);
    navigate(STORY_PAGE);
  };

  const viewClick = () => {
    sessionStorage.setItem("viewId", previousGame._id);
    sessionStorage.setItem("viewTitle", previousGame.game_title);
    sessionStorage.setItem("viewStory", previousGame.main_story);
    sessionStorage.setItem("viewImage", previousGame.environment_image);
    navigate(VIEW_STORY_PAGE);
  };

  const truncatedDescription =
    previousGame.story_beginning.length > MAX_DESCRIPTION_LENGTH
      ? `${previousGame.story_beginning.slice(0, MAX_DESCRIPTION_LENGTH)}...`
      : previousGame.story_beginning;
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
            src={previousGame.environment_image}
            alt="previousGame"
          />
          <h1
            style={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontWeight: "bold",
              marginTop: "20px",
              fontSize: "25px",
            }}
          >
            {previousGame.game_title}
          </h1>
          <p className="text-sm pt-4">{truncatedDescription}</p>
          <button
            className="w-[422px] bg-gray-300 h-11 mt-6 rounded-t-lg hover:bg-gray-400"
            onClick={() => {
              viewClick();
            }}
          >
            View
          </button>
          <button
            className="bg-[#19A7CE] text-white h-11 w-[422px] rounded-b-lg hover:bg-[#158eae]"
            onClick={() => {
              continueClick();
            }}
          >
            Continue
          </button>
        </div>
      </Grid>
    </React.Fragment>
  );
};

export default AchievementCard;
