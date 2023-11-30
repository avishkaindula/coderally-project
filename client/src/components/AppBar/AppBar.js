import React from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, Box } from "@mui/material";
import {
  ABOUT_PAGE,
  HOME_PAGE,
  PREVIOUS_GAMES,
  START_NEW_STORY,
} from "../../constants/routes.constants";

const NavBar = () => {

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "#FFFFFF" }}>
      <Toolbar>
        <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Tabs value={0} indicatorColor="#19a5cc">
            <Tab
              label={
                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "none",
                    color: "#0a3543",
                  }}
                >
                  New Story
                </Typography>
              }
              onClick={() => {
                window.location.replace(START_NEW_STORY);
              }}
            />
            <Tab
              label={
                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "none",
                    color: "#0a3543",
                  }}
                >
                  Home
                </Typography>
              }
              sx={{ marginLeft: "80px" }}
              onClick={() => {
                window.location.replace(HOME_PAGE);
              }}
            />
            <Tab
              label={
                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    fontSize: 25,
                    marginLeft: "100px",
                    marginRight: "100px",
                    width: "100%",
                    color: "#06252d",
                  }}
                >
                  DevtronX: Alfai Odyssey
                </Typography>
              }
              onClick={() => {
                window.location.replace(HOME_PAGE);
              }}
              sx={{ marginLeft: "100px", marginRight: "100px" }}
            />
            <Tab
              label={
                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "none",
                    color: "#0a3543",
                  }}
                >
                  Previous Games
                </Typography>
              }
              sx={{ marginRight: "80px" }}
              onClick={() => {
                window.location.replace(PREVIOUS_GAMES);
              }}
            />
            <Tab
              label={
                <Typography
                  variant="h6"
                  sx={{
                    textTransform: "none",
                    color: "#0a3543",
                  }}
                >
                  About
                </Typography>
              }
              onClick={() => {
                window.location.replace(ABOUT_PAGE);
              }}
            />
          </Tabs>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
