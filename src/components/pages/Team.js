import React, { useState } from "react";
import Footer from "../layouts/Footer";
import Nav from "../layouts/NewNav";
import TeamLayout from "../layouts/TeamLayout";
import AnimationRevealPage from "../layouts/AnimationRevealPage";
import Sidebar from "react-sidebar";
import { isBrowser, isMobile, isTablet } from "react-device-detect";
import { SideLinks, SideLinksShort } from "../layouts/SideLinks";
import { css } from "styled-components/macro"; //eslint-disable-line

const Team = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  function onSetSidebarOpen(open) {
    setSidebarOpen(!sidebarOpen);
  }

  return (
		  <div className="leftNav">
    <Sidebar
      sidebar={SideLinks}
      open={sidebarOpen}
      onSetOpen={onSetSidebarOpen}
      styles={
        isBrowser
          ? { sidebar: { background: "#111", zIndex: 40 } }
          : { sidebar: { background: "#111", zIndex: 50 } }
      }
      docked={!isTablet && !isMobile ? sidebarOpen : false}
    >
      <Sidebar
        sidebar={SideLinksShort}
        open={!isTablet && !isMobile ? !sidebarOpen : false}
        onSetOpen={onSetSidebarOpen}
        styles={{ sidebar: { background: "#111", zIndex: 30 } }}
        docked={!isTablet && !isMobile ? !sidebarOpen : false}
      >
        <AnimationRevealPage disabled>
          <Nav onSetSidebarOpen={onSetSidebarOpen} />
          <TeamLayout />
          <Footer />
        </AnimationRevealPage>
      </Sidebar>
    </Sidebar>
  </div>);
};

export default Team;
