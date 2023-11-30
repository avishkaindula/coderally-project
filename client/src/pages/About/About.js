import { LoadingButton } from "@mui/lab";
import { Grid, Link } from "@mui/material";
import React from "react";

export default function About() {
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
              marginTop: "40px",
              fontSize: "18px",
            }}
          >
            This project was created for the CodeRally 4.0 hackathon by team
            DevtronX from Informatics Institute of Technology, Sri Lanka.
          </h1>
        </Grid>
        <Grid item md={12} container justifyContent="center">
          <h1
            style={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontSize: 25,
              fontWeight: "bold",
              marginTop: 40,
              marginLeft: 60,
              marginRight: 60,
            }}
          >
            Team Members
          </h1>
        </Grid>
        <Grid item md={12} container justifyContent="center">
          <h1
            style={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontSize: 25,
              marginTop: 40,
              marginLeft: 60,
              marginRight: 60,
            }}
          >
            Avishka Indula Rajapaksha
          </h1>
        </Grid>
        <Grid item md={12} container justifyContent="center">
          <h1
            style={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontSize: 18,
              marginTop: 5,
              fontWeight: "bold",
              marginLeft: 60,
              marginRight: 60,
            }}
          >
            Leader / Full Stack Developer
          </h1>
        </Grid>
        <Grid item md={12} container justifyContent="center">
          <a
            href="https://github.com/avishkaindula"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
              marginTop: 5,
            }}
          >
            https://github.com/avishkaindula
          </a>
        </Grid>
        <Grid item md={12} container justifyContent="center">
          <h1
            style={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontSize: 25,
              marginTop: 60,
              marginLeft: 60,
              marginRight: 60,
            }}
          >
            Isira Herath
          </h1>
        </Grid>
        <Grid item md={12} container justifyContent="center">
          <h1
            style={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontSize: 18,
              marginTop: 5,
              fontWeight: "bold",
              marginLeft: 60,
              marginRight: 60,
            }}
          >
            Game Developer / Prompt Engineer
          </h1>
        </Grid>
        <Grid item md={12} container justifyContent="center">
          <a
            href="https://github.com/SL-Pirate"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
              marginTop: 5,
            }}
          >
            https://github.com/SL-Pirate
          </a>
        </Grid>
        <Grid item md={12} container justifyContent="center">
          <h1
            style={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontSize: 25,
              marginTop: 60,
              marginLeft: 60,
              marginRight: 60,
            }}
          >
            Thejan Nimsara
          </h1>
        </Grid>
        <Grid item md={12} container justifyContent="center">
          <h1
            style={{
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              fontSize: 18,
              marginTop: 5,
              fontWeight: "bold",
              marginLeft: 60,
              marginRight: 60,
            }}
          >
            Front-End Developer
          </h1>
        </Grid>
        <Grid item md={12} container justifyContent="center">
          <a
            href="https://github.com/ThejanNim"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "blue",
              textDecoration: "underline",
              cursor: "pointer",
              marginTop: 5,
            }}
          >
            https://github.com/ThejanNim
          </a>
        </Grid>
      </Grid>
      <br />
    </React.Fragment>
  );
}
