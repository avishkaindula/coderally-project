import React, { useEffect, useState } from "react";
import { Snackbar, Grid, TextField, Alert } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import * as storyService from "./StartNewStory.service.js";
import { useNavigate } from "react-router-dom";
import { STORY_PAGE } from "../../constants/routes.constants.js";

const StartNewStory = () => {
  const navigate = useNavigate();

  const [gameTitle, setGameTitle] = useState("");
  const [protagonistName, setProtagonistName] = useState("");
  const [story, setStory] = useState("");
  const [characterAppearance, setCharacterAppearance] = useState("");
  const [ambience, setAmbience] = useState("");
  const [isGamingAssetsButtonEnabled, setIsGamingAssetsButtonEnabled] =
    useState(false);
  const [isNewStoryButtonEnabled, setIsNewStoryButtonEnabled] = useState(true);
  const [isGeneratingAssets, setIsGeneratingAssets] = useState(false);
  const [newStoryButtonLoading, setNewStoryButtonLoading] = useState(false);
  const [generateAssetsButtonLoading, setGenerateAssetsButtonLoading] =
    useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [environmentImage, setEnvironmentImage] = useState("");
  const [protagonistImage, setProtagonistImage] = useState("");
  const [projectileImage, setProjectileImage] = useState("");
  const [musicType, setMusicType] = useState("");

  useEffect(() => {
    handleInputChange();
  }, [gameTitle, protagonistName, story, characterAppearance, ambience]);

  const handlePlayClick = async () => {
    try {
      const obj = {
        game_title: gameTitle,
        protagonist_name: protagonistName,
        story,
        character_appearance: characterAppearance,
        ambience,
        environment_image: environmentImage,
        protagonist_image: protagonistImage,
        projectile_image: projectileImage,
        music_type: musicType,
      };

      const res = await storyService.saveNewStory(obj);
      sessionStorage.setItem("storyId", res.data.body._id);
    } catch (error) {
      console.error(error);
    } finally {
      navigate(STORY_PAGE);
    }
  };

  const onGenerateGamingAssets = async () => {
    try {
      setIsNewStoryButtonEnabled(false);
      setGenerateAssetsButtonLoading(true);
      setSnackbarMessage(
        "Please be patient. This may take more than a minute."
      );
      setOpenSnackbar(true);
      const obj = {
        story,
        game_title: gameTitle,
        ambience,
        character_name: protagonistName,
        character_appearance: characterAppearance,
      };
      const res = await storyService.generateGamingAssets(obj);
      const environmentImage = res.data.body.environmentUrl.url;
      const protagonistImage = res.data.body.protagonistUrl.url;
      const projectileImage = res.data.body.projectileUrl.url;

      setEnvironmentImage(environmentImage);
      setProtagonistImage(protagonistImage);
      setProjectileImage(projectileImage);
      setMusicType(res.data.body.music);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingAssets(true);
      setGenerateAssetsButtonLoading(false);
    }
  };

  const handleInputChange = () => {
    if (
      gameTitle.trim() &&
      protagonistName.trim() &&
      story.trim() &&
      characterAppearance.trim() &&
      ambience.trim()
    ) {
      setIsGamingAssetsButtonEnabled(true);
    } else {
      setIsGamingAssetsButtonEnabled(false);
    }
  };

  const generateNewStoryClick = async () => {
    try {
      setNewStoryButtonLoading(true);
      setIsGamingAssetsButtonEnabled(false);
      setSnackbarMessage("This may take a while.");
      setOpenSnackbar(true);
      const res = await storyService.generateNewStory();
      setGameTitle(res.data.body.game_title);
      setProtagonistName(res.data.body.character_name);
      setStory(res.data.body.story);
      setAmbience(res.data.body.ambience);
      setCharacterAppearance(res.data.body.character_appearance);
      setIsGamingAssetsButtonEnabled(true);
    } catch (error) {
      console.error(error);
    } finally {
      setNewStoryButtonLoading(false);
      setIsGamingAssetsButtonEnabled(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <div>
      <h1
        style={{
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontWeight: "bold",
          marginTop: "40px",
          fontSize: "18px",
        }}
      >
        Describe the beginning of the story, environment or anything you want
        your adventure to have or click the button below to generate a new
        story.
      </h1>
      <br />
      <Grid container>
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
              width: "20%",
              height: "50px",
              fontSize: "18px",
              backgroundColor: "#19A7CE",
              "&:hover": {
                backgroundColor: "#158eae",
              },
              display: isGeneratingAssets ? "block" : "none",
            }}
            disabled={generateAssetsButtonLoading}
            onClick={handlePlayClick}
          >
            Play
          </LoadingButton>
        </Grid>
        {isGeneratingAssets && (
          <React.Fragment>
            <Grid item md={12} container>
              <Grid container spacing={2} marginLeft={5} marginRight={5}>
                <Grid
                  item
                  md={4}
                  container
                  justifyContent="center"
                  alignItems="center"
                  sx={{ marginTop: 5 }}
                >
                  <Grid container>
                    <Grid item md={12} container justifyContent="center">
                      <h1
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                          marginBottom: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        Environment
                      </h1>
                    </Grid>
                    <Grid item md={12} container justifyContent="center">
                      <img
                        src={environmentImage}
                        alt={"Environment"}
                        style={{
                          borderRadius: "20px",
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                          maxWidth: "100%",
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  md={4}
                  container
                  justifyContent="center"
                  alignItems="center"
                  sx={{ marginTop: 5 }}
                >
                  <Grid container>
                    <Grid item md={12} container justifyContent="center">
                      <h1
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                          marginBottom: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        Protagonist
                      </h1>
                    </Grid>
                    <Grid item md={12} container justifyContent="center">
                      <img
                        src={protagonistImage}
                        alt={"Protagonist"}
                        style={{
                          borderRadius: "20px",
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                          maxWidth: "100%",
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  md={4}
                  container
                  justifyContent="center"
                  alignItems="center"
                  sx={{ marginTop: 5 }}
                >
                  <Grid container>
                    <Grid item md={12} container justifyContent="center">
                      <h1
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          textAlign: "center",
                          marginBottom: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        Projectile
                      </h1>
                    </Grid>
                    <Grid item md={12} container justifyContent="center">
                      <img
                        src={projectileImage}
                        alt={"Projectile"}
                        style={{
                          borderRadius: "20px",
                          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                          maxWidth: "100%",
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item md={12} container marginLeft={"5%"} marginTop={5}>
              <h1
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                Story Type:{" "}
                <span style={{ fontWeight: "bold" }}>{musicType}</span>
              </h1>
            </Grid>
          </React.Fragment>
        )}
        <Grid item md={6} container justifyContent="center" alignItems="center">
          <TextField
            sx={{
              marginBottom: "10px",
              marginTop: "40px",
              width: "80%",
              backgroundColor: "white",
            }}
            label="Game Title"
            onChange={(e) => {
              setGameTitle(e.target.value);
              handleInputChange();
            }}
            disabled={
              isGeneratingAssets ||
              newStoryButtonLoading ||
              generateAssetsButtonLoading
            }
            value={gameTitle}
          />
        </Grid>
        <Grid item md={6} container justifyContent="center" alignItems="center">
          <TextField
            sx={{
              marginBottom: "10px",
              marginTop: "40px",
              width: "80%",
              backgroundColor: "white",
            }}
            label="Protagonist's Name"
            onChange={(e) => {
              setProtagonistName(e.target.value);
              handleInputChange();
            }}
            disabled={
              isGeneratingAssets ||
              newStoryButtonLoading ||
              generateAssetsButtonLoading
            }
            value={protagonistName}
          />
        </Grid>
        <Grid
          item
          md={12}
          container
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            sx={{
              marginBottom: "10px",
              marginTop: "10px",
              width: "90%",
              backgroundColor: "white",
            }}
            multiline
            rows={7}
            label="Story"
            onChange={(e) => {
              setStory(e.target.value);
              handleInputChange();
            }}
            disabled={
              isGeneratingAssets ||
              newStoryButtonLoading ||
              generateAssetsButtonLoading
            }
            value={story}
          />
        </Grid>
        <Grid item md={6} container justifyContent="center" alignItems="center">
          <TextField
            sx={{
              marginBottom: "10px",
              marginTop: "10px",
              width: "80%",
              backgroundColor: "white",
            }}
            multiline
            rows={5}
            label="Character Appearance"
            onChange={(e) => {
              setCharacterAppearance(e.target.value);
              handleInputChange();
            }}
            disabled={
              isGeneratingAssets ||
              newStoryButtonLoading ||
              generateAssetsButtonLoading
            }
            value={characterAppearance}
          />
        </Grid>
        <Grid item md={6} container justifyContent="center" alignItems="center">
          <TextField
            sx={{
              marginBottom: "10px",
              marginTop: "10px",
              width: "80%",
              backgroundColor: "white",
            }}
            multiline
            label="Ambience"
            rows={5}
            onChange={(e) => {
              setAmbience(e.target.value);
              handleInputChange();
            }}
            disabled={
              isGeneratingAssets ||
              newStoryButtonLoading ||
              generateAssetsButtonLoading
            }
            value={ambience}
          />
        </Grid>
        <Grid
          item
          md={6}
          container
          justifyContent="center"
          alignItems="center"
          sx={{ marginTop: "10px" }}
        >
          <LoadingButton
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
            disabled={!isNewStoryButtonEnabled}
            onClick={generateNewStoryClick}
            loading={newStoryButtonLoading}
          >
            Generate New Story
          </LoadingButton>
        </Grid>
        <Grid
          item
          md={6}
          container
          justifyContent="center"
          alignItems="center"
          sx={{ marginTop: "10px" }}
        >
          <LoadingButton
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
            disabled={!isGamingAssetsButtonEnabled}
            onClick={onGenerateGamingAssets}
            loading={generateAssetsButtonLoading}
          >
            Generate Gaming Assets
          </LoadingButton>
        </Grid>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={8000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert onClose={handleClose} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Grid>
      <br />
      <br />
    </div>
  );
};

export default StartNewStory;
