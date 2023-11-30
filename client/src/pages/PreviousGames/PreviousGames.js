import { Grid } from "@mui/material";
import * as previousGamesService from "./PreviousGames.service.js";
import PreviousGamesCard from "./components/PreviousGamesCard";
import React, { useEffect, useState } from "react";

export default function PreviousGames() {
  const [previousGames, setPreviousGames] = useState([]);

  useEffect(() => {
    initPage();
  }, []);

  const initPage = async () => {
    try {
      const res = await previousGamesService.getPreviousGames();
      console.log(res.data.body);
      setPreviousGames(res.data.body);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
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
        Previous Games
      </h1>
      <Grid container>
        {previousGames.map((previousGame, index) => (
          <PreviousGamesCard key={index} previousGame={previousGame} />
        ))}
      </Grid>
      <br />
    </React.Fragment>
  );
}
