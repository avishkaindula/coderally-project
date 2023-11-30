import React from "react";
import { Route, Routes } from "react-router-dom";
import StartNewStory from "./pages/StartNewStory/StartNewStory";
import {
  ABOUT_PAGE,
  BATTLE_PAGE_V1,
  BATTLE_PAGE_V2,
  BATTLE_PAGE_V3,
  HOME_PAGE,
  PREVIOUS_GAMES,
  START_NEW_STORY,
  STORY_PAGE,
  VIEW_STORY_PAGE,
} from "./constants/routes.constants";
import NavBar from "./components/AppBar/AppBar";
import PreviousGames from "./pages/PreviousGames/PreviousGames";
import BattlePage from "./pages/BattlePage/BattlePage";
import BattlePageV2 from "./pages/BattlePage/BattlePageV2";
import { HomePage } from "./pages/HomePage/HomePage";
import About from "./pages/About/About";
import BattlePageV3 from "./pages/BattlePage/BattlePageV3";
import Story from "./pages/Story/Story";
import ViewStory from "./pages/ViewStory/ViewStory";

function App() {
  return (
    <React.Fragment>
      <div>
        <NavBar />
      </div>
      <div>
        <Routes>
          <Route path={HOME_PAGE} element={<HomePage />} />
          <Route path={START_NEW_STORY} element={<StartNewStory />} />
          <Route path={PREVIOUS_GAMES} element={<PreviousGames />} />
          <Route path={BATTLE_PAGE_V1} element={<BattlePage />} />
          <Route path={BATTLE_PAGE_V2} element={<BattlePageV2 />} />
          <Route path={BATTLE_PAGE_V3} element={<BattlePageV3 />} />
          <Route path={ABOUT_PAGE} element={<About />} />
          <Route path={STORY_PAGE} element={<Story />} />
          <Route path={VIEW_STORY_PAGE} element={<ViewStory />} />
        </Routes>
      </div>
    </React.Fragment>
  );
}

export default App;
