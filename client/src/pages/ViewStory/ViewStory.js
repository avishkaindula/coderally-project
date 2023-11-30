import { LoadingButton } from "@mui/lab";
import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { STORY_PAGE } from "../../constants/routes.constants";

export default function ViewStory() {
  const navigate = useNavigate();

  const [storyId, setStoryId] = useState("");
  const [storyImage, setStoryImage] = useState("");
  const [storyTitle, setStoryTitle] = useState("");
  const [storyContent, setStoryContent] = useState("");

  useEffect(() => {
    initPage();
  }, []);

  const continueClicked = () => {
    sessionStorage.setItem("storyId", storyId);
    navigate(STORY_PAGE);
  };

  const initPage = async () => {
    const storyId = sessionStorage.getItem("viewId");
    const storyImage = sessionStorage.getItem("viewImage");
    const storyTitle = sessionStorage.getItem("viewTitle");
    const storyContent = sessionStorage.getItem("viewStory");

    setStoryId(storyId);
    setStoryImage(storyImage);
    setStoryTitle(storyTitle);
    setStoryContent(storyContent);
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid item md={12} container justifyContent="center">
          <h1
            style={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 30,
              marginTop: 40,
            }}
          >
            {storyTitle}
          </h1>
        </Grid>
        <Grid
          item
          md={12}
          container
          justifyContent="center"
          alignItems="center"
        >
          <img
            src={storyImage}
            alt={"Environment"}
            style={{
              borderRadius: "20px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              width: "300px",
              marginBottom: 40,
              marginTop: "20px",
            }}
          />
        </Grid>
        <Grid
          item
          md={12}
          container
          justifyContent="center"
          alignItems="center"
        >
          <LoadingButton
            variant="contained"
            sx={{
              textTransform: "none",
              width: "25%",
              height: "50px",
              fontSize: "18px",
              backgroundColor: "#19A7CE",
              "&:hover": {
                backgroundColor: "#158eae",
              },
              marginBottom: 1,
            }}
            onClick={continueClicked}
          >
            Continue
          </LoadingButton>
        </Grid>
        <Grid item md={12} container justifyContent="center">
          <p
            style={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontSize: 15,
              marginTop: 20,
              marginLeft: 60,
              marginRight: 60,
            }}
          >
            {storyContent}
          </p>
        </Grid>
      </Grid>
      <br />
    </React.Fragment>
  );
}
