import React from "react";
import Home from "./components/pages/Home";
import Logout from "./components/pages/Logout";
// import Signup from "./components/pages/Signup";
// import Login from "./components/pages/Login";
// import PersonalDetails from "./components/pages/PersonalDetails";
// import Address from "./components/pages/Address";
import UploadPage from "./components/pages/Contest/UploadPage";
// import Video from "./components/pages/Video";
// import Landing from "./components/pages/Landing";
import ContestRegister from "./components/pages/Contest/ContestRegister";
import UnderAgeContest from "./components/pages/Contest/UnderAgeContest";
import Team from "./components/pages/Team";
// import UserDashboard from "./components/pages/UserDashboard";
import About from "./components/pages/About";
import Support from "./components/pages/Support";
import Feedback from "./components/pages/Feedback";
import Trending from "./components/pages/Trending";
import Terms from "./components/pages/Terms";
import Privacy from "./components/pages/Privacy";
import Advertising from "./components/pages/Advertising";

export const routes = {
  "/": () => <Home />,
  "/logout": () => <Logout />,
  "/contest": () => <ContestRegister />,
  "/contest/underage": () => <UnderAgeContest />,
  "/contest/upload": () => <UploadPage />,
  "/team": () => <Team />,
  "/about": () => <About />,
  "/privacy": () => <Privacy />,
  "/policy": () => <Privacy />,
};

export const guestRoutes = {
  "/": () => <Home />,
  "/about": () => <About />,

  // "/login": () => <Login />,
  // "/signup": () => <Signup />,
  // "/details": () => <PersonalDetails />,
  // "/address": () => <Address />,
  // "/v": () => <Video />,
  // "/landing": () => <Landing />,
  "/contest": () => <ContestRegister />,
  "/contest/underage": () => <UnderAgeContest />,
  "/contest/upload": () => <UploadPage />,
  // "/upload": () => <UploadPage />,
  "/team": () => <Team />,
  "/support": () => <Support />,
  "/feedback": () => <Feedback />,
  "/trending": () => <Trending />,
  "/terms": () => <Terms />,
  "/privacy": () => <Privacy />,
  "/policy": () => <Privacy />,
  "/advertising": () => <Advertising />,
  // "/profile": () => <UserDashboard />
};
