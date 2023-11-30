import React from "react";
import Grid from "@mui/material/Grid";
import { Button, TextField } from "@mui/material";
import GameV1 from "../../game-v1/GameV1";

const BattlePage = () => {
  const setPlayerWin = (winStatus) => {
    console.log("Player won: " + winStatus);
  };

  return (
    <div>
      <Grid container>
        <Grid
          item
          md={12}
          container
          justifyContent="center"
          alignItems="center"
        >
          <TextField
            sx={{ marginBottom: "10px", marginTop: "10px", width: "80%" }}
            multiline
            rows={5}
          />
        </Grid>
        <Grid item md={6} container justifyContent="center" alignItems="center">
          <Button variant="contained">Help</Button>
        </Grid>
        <Grid item md={6} container justifyContent="center" alignItems="center">
          <Button variant="contained">Walk Away</Button>
        </Grid>
      </Grid>
      <br />
      <GameV1 setPlayerWin={setPlayerWin} />
    </div>
  );
};

export default BattlePage;
