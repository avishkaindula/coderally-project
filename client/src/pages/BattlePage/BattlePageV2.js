import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import GameV2 from "../../game-v2/GameV2";
import { LoadingButton } from "@mui/lab";
import * as battleService from "./BattlePage.service.js";
import { STORY_PAGE } from "../../constants/routes.constants";

const BattlePageV3 = () => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resultReceived, setResultReceived] = useState(false);
  const [initialGameLoading, setInitialGameLoading] = useState(true);
  const [enemyImage, setEnemyImage] = useState("");
  const [projectileImage, setProjectileImage] = useState("");
  const [protagonistImage, setProtagonistImage] = useState("");
  const [environmentImage, setEnvironmentImage] = useState("");
  const [continuation, setContinuation] = useState("");
  const [achievementImage, setAchievementImage] = useState("");
  const [gameTitle, setGameTitle] = useState("");
  const [achievementTitle, setAchievementTitle] = useState("");
  const [winStatus, setWinStatus] = useState("");
  const [winBoolean, setWinBoolean] = useState(false);

  useEffect(() => {
    initPage();
  }, []);

  const initPage = async () => {
    setInitialGameLoading(true);
    const storyId = sessionStorage.getItem("storyId");

    const obj = {
      id: storyId,
    };
    try {
      const res = await battleService.getAssets(obj);
      console.log(res);
      setEnemyImage(res.data.body.enemy_image);
      setProjectileImage(res.data.body.projectile_image);
      setProtagonistImage(res.data.body.protagonist_image);
      setEnvironmentImage(res.data.body.environment_image);
    } catch (error) {
      console.log(error);
    } finally {
      setInitialGameLoading(false);
    }
  };

  const setPlayerWin = async (winStatus) => {
    setResultReceived(true);
    setIsLoading(true);
    const storyId = sessionStorage.getItem("storyId");

    const obj = {
      id: storyId,
    };

    if (winStatus === true) {
      try {
        setWinStatus("Player won!");
        setWinBoolean(true);
        const res = await battleService.playerWon(obj);
        setContinuation(res.data.body.continuation);
        setAchievementImage(res.data.body.achievementImageUrl);
        setGameTitle(res.data.body.gameTitle);
        setAchievementTitle(res.data.body.achievementTitle);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    } else if (winStatus === false) {
      try {
        setWinStatus("Player lost!");
        setWinBoolean(false);
        const res = await battleService.playerLost(obj);
        setContinuation(res.data.body.continuation);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const continueClicked = async () => {
    const storyId = sessionStorage.getItem("storyId");
    setButtonLoading(true);
    if (winBoolean === true) {
      const obj = {
        achievementImageUrl: achievementImage,
        gameTitle: gameTitle,
        achievementTitle: achievementTitle,
        continuation: continuation,
        id: storyId,
      };

      try {
        const res = await battleService.battleWonSave(obj);
      } catch (error) {
        console.log(error);
      } finally {
        window.location.replace(STORY_PAGE);
      }
    } else if (winBoolean === false) {
      const obj = {
        continuation: continuation,
        id: storyId,
      };

      try {
        const res = await battleService.battleLostSave(obj);
      } catch (error) {
        console.log(error);
      } finally {
        window.location.replace(STORY_PAGE);
      }
    }
  };

  return (
    <div>
      {initialGameLoading ? (
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
          {resultReceived ? (
            <React.Fragment>
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
                  <Grid container>
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
                          width: "80%",
                        }}
                        multiline
                        rows={5}
                        disabled
                        value={continuation}
                      />
                    </Grid>
                    <Grid
                      item
                      md={6}
                      container
                      justifyContent="center"
                      alignItems="center"
                    >
                      <LoadingButton
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          width: "60%",
                          height: "50px",
                          fontSize: "18px",
                          backgroundColor: "#19A7CE",
                          "&:hover": {
                            backgroundColor: "#158eae",
                          },
                        }}
                        onClick={() => {
                          window.location.reload(false);
                        }}
                        loading={buttonLoading}
                      >
                        Rematch
                      </LoadingButton>
                    </Grid>
                    <Grid
                      item
                      md={6}
                      container
                      justifyContent="center"
                      alignItems="center"
                    >
                      <LoadingButton
                        variant="contained"
                        sx={{
                          textTransform: "none",
                          width: "60%",
                          height: "50px",
                          fontSize: "18px",
                          backgroundColor: "#19A7CE",
                          "&:hover": {
                            backgroundColor: "#158eae",
                          },
                        }}
                        onClick={continueClicked}
                        loading={buttonLoading}
                      >
                        Continue
                      </LoadingButton>
                    </Grid>
                  </Grid>
                </React.Fragment>
              )}
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
                Fight
              </h1>
              <p
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  marginTop: "20px",
                  fontSize: "20px",
                }}
              >
                Use WASD to control the protagonist and press Q to attack. Use
                IJKL to control the enemy and press U to attack.
              </p>
              <p
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  marginTop: "20px",
                  fontSize: "20px",
                }}
              >
                Press and hold Q or U for a power attack. Press and hold WASD or
                IJKL to fly.
              </p>
            </React.Fragment>
          )}
          <br />
          {resultReceived ? (
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
                {winStatus}
              </h1>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <GameV2
                setPlayerWin={setPlayerWin}
                enemyImage={enemyImage}
                projectileImage={projectileImage}
                protagonistImage={protagonistImage}
                environmentImage={environmentImage}
              />
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default BattlePageV3;
