import { LoadingButton } from "@mui/lab";
import {
  Grid,
  CircularProgress,
  Box,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import * as storyGenerationService from "./Story.service.js";
import {
  BATTLE_PAGE_V2,
  BATTLE_PAGE_V3,
} from "../../constants/routes.constants.js";

const Story = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [combatChoice, setCombatChoice] = useState(false);
  const [firstChoice, setFirstChoice] = useState("");
  const [secondChoice, setSecondChoice] = useState("");
  const [continuation, setContinuation] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [image, setImage] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  const [enemyAppearance, setEnemyAppearance] = useState("");
  const [fightingEnvironment, setFightingEnvironment] = useState("");
  const [enemyType, setEnemyType] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    initPage();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const initPage = async () => {
    setIsLoading(true);
    const storyId = sessionStorage.getItem("storyId");

    const obj = {
      id: storyId,
    };
    try {
      const res = await storyGenerationService.generateContinuation(obj);
      setFirstChoice(res.data.body.first_choice);
      setSecondChoice(res.data.body.second_choice);
      setContinuation(res.data.body.continuation);
      setImage(res.data.body.environment_image);
      setGameTitle(res.data.body.game_title);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const choiceSelected = async (choice) => {
    setButtonLoading(true);
    const storyId = sessionStorage.getItem("storyId");
    const obj = {
      id: storyId,
      choice: choice,
    };
    try {
      const res = await storyGenerationService.storyChoice(obj);
      setContinuation(res.data.body.continuation);
      setEnemyAppearance(res.data.body.enemy_appearance);
      setFightingEnvironment(res.data.body.environment);
      setEnemyType(res.data.body.enemy_type);
    } catch (error) {
      console.log(error);
    } finally {
      setButtonLoading(false);
      setCombatChoice(true);
    }
  };

  const attackClicked = async () => {
    setButtonLoading(true);
    setOpenSnackbar(true);
    setSnackbarMessage("Please be patient. This may take more than a minute.");
    const storyId = sessionStorage.getItem("storyId");
    const obj = {
      id: storyId,
      enemy_appearance: enemyAppearance,
      fighting_environment: fightingEnvironment,
      continuation: continuation,
    };
    try {
      const res = await storyGenerationService.attackEnemy(obj);
    } catch (error) {
      console.log(error);
    } finally {
      setButtonLoading(false);
      if (enemyType === "heard") {
        window.location.href = BATTLE_PAGE_V3;
      } else if (enemyType === "single") {
        window.location.href = BATTLE_PAGE_V2;
      }
    }
  };

  const walkAwayClicked = async () => {
    setButtonLoading(true);
    const storyId = sessionStorage.getItem("storyId");
    const obj = {
      id: storyId,
      continuation: continuation,
    };
    try {
      const res = await storyGenerationService.walkAway(obj);
      setContinuation(res.data.body.continuation);
      setFirstChoice(res.data.body.first_choice);
      setSecondChoice(res.data.body.second_choice);
    } catch (error) {
      console.log(error);
    } finally {
      setButtonLoading(false);
      setCombatChoice(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <React.Fragment>
          <Grid
            item
            md={12}
            container
            justifyContent="center"
            alignItems="center"
            marginTop={10}
          >
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          </Grid>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <h1
            style={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontWeight: "bold",
              marginTop: "20px",
              fontSize: "27px",
            }}
          >
            {gameTitle}
          </h1>
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
          <br />
          <Grid container>
            <Grid
              item
              md={12}
              container
              justifyContent="center"
              alignItems="center"
            >
              <img
                src={image}
                alt={"Environment"}
                style={{
                  borderRadius: "20px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  width: "300px",
                  marginBottom: "20px",
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
                value={continuation}
                disabled
              />
            </Grid>
            {combatChoice ? (
              <React.Fragment>
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
                      height: "70px",
                      fontSize: "18px",
                      backgroundColor: "#19A7CE",
                      "&:hover": {
                        backgroundColor: "#158eae",
                      },
                    }}
                    onClick={walkAwayClicked}
                    loading={buttonLoading}
                  >
                    Walk Away
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
                      height: "70px",
                      fontSize: "18px",
                      backgroundColor: "#19A7CE",
                      "&:hover": {
                        backgroundColor: "#158eae",
                      },
                    }}
                    onClick={attackClicked}
                    loading={buttonLoading}
                  >
                    Attack
                  </LoadingButton>
                </Grid>
              </React.Fragment>
            ) : (
              <React.Fragment>
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
                      height: "70px",
                      fontSize: "18px",
                      backgroundColor: "#19A7CE",
                      "&:hover": {
                        backgroundColor: "#158eae",
                      },
                    }}
                    onClick={() => choiceSelected(firstChoice)}
                    loading={buttonLoading}
                  >
                    {firstChoice}
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
                      height: "70px",
                      fontSize: "18px",
                      backgroundColor: "#19A7CE",
                      "&:hover": {
                        backgroundColor: "#158eae",
                      },
                    }}
                    onClick={() => choiceSelected(secondChoice)}
                    loading={buttonLoading}
                  >
                    {secondChoice}
                  </LoadingButton>
                </Grid>
              </React.Fragment>
            )}
          </Grid>
        </React.Fragment>
      )}
      <br />
    </div>
  );
};

export default Story;
