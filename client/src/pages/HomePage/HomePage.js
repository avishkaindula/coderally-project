import { Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  PREVIOUS_GAMES,
  START_NEW_STORY,
} from "../../constants/routes.constants";
import AchievementCard from "./components/AchievementCard";
import * as homePageService from "./HomePage.service.js";
import { useEffect, useState } from "react";

export function HomePage() {
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    initPage();
  }, []);

  const initPage = async () => {
    try {
      const res = await homePageService.getAchievements();
      setAchievements(res.data.body);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <br />
      <br />
      <Grid container>
        <Grid item md={6} container justifyContent="center" alignItems="center">
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              width: "80%",
              height: "50px",
              fontSize: "18px",
              backgroundColor: "#19A7CE",
              "&:hover": {
                backgroundColor: "#158eae",
              },
            }}
            onClick={() => {
              navigate(START_NEW_STORY);
            }}
          >
            Start A New Story
          </Button>
        </Grid>
        <Grid item md={6} container justifyContent="center" alignItems="center">
          <Button
            variant="contained"
            sx={{
              textTransform: "none",
              width: "80%",
              height: "50px",
              fontSize: "18px",
              backgroundColor: "#19A7CE",
              "&:hover": {
                backgroundColor: "#158eae",
              },
            }}
            onClick={() => {
              navigate(PREVIOUS_GAMES);
            }}
          >
            View Previous Games
          </Button>
        </Grid>
      </Grid>
      <h1
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 40,
          marginTop: 50,
        }}
      >
        Achievements
      </h1>
      <Grid container>
        {achievements.map((achievement, index) => (
          <AchievementCard key={index} achievement={achievement} />
        ))}
      </Grid>
      <br />
    </div>
  );
}
