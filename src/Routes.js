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

export const routes = {
  "/": () => <Home />,
  "/logout": () => <Logout />,
  "/contest": () => <ContestRegister />,
  "/contest/underage": () => <UnderAgeContest />,
  "/contest/upload": () => <UploadPage />,
  "/team": () => <Team />,
};

export const guestRoutes = {
  "/": () => <Home />,
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
  // "/profile": () => <UserDashboard />
};
