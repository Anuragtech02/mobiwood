import React, { useState } from "react";
import Nav from "../layouts/NewNav";
import VideoPlayer from "../layouts/VideoPlayer";
import AnimationRevealPage from "../layouts/AnimationRevealPage";
import Footer from "../layouts/Footer";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import Sidebar from "react-sidebar";
import { ReactComponent as CloseIcon } from "feather-icons/dist/icons/x.svg";
import transLogo from "../../images/logo_tm.png";

const SidebarContainer = tw.div`bg-prim-200 text-white`;
const SidebarHeading = tw.div`bg-prim-200 p-6 flex mt-2`;
const HeadingText = styled.div`
  ${(props) => `background-image: url("${props.imageSrc}");`}
  ${tw`w-40 h-10 -mt-3 mr-12 bg-contain bg-no-repeat`}
`;
const CloseButton = tw.div`cursor-pointer`;
const SidebarContentContainer = tw.div`p-6`;
const SidebarContentFirst = tw.div`cursor-pointer pb-4 border-b border-gray-500`;
const SidebarContent = tw.div(SidebarContentFirst)`py-4`;

const Video = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  function onSetSidebarOpen(open) {
    setSidebarOpen(open);
  }
  function closeSidebar() {
    setSidebarOpen(false);
  }

  const SideLinks = (
    <SidebarContainer>
      <SidebarHeading>
        <HeadingText imageSrc={transLogo}></HeadingText>
        <CloseButton onClick={closeSidebar}>
          <CloseIcon />
        </CloseButton>
      </SidebarHeading>
      <SidebarContentContainer>
        <a href="/">
          <SidebarContentFirst>Home</SidebarContentFirst>
        </a>
        <a href="/contest">
          <SidebarContent>Contests</SidebarContent>
        </a>
        <a href="/artist">
          <SidebarContent>Artist Registration</SidebarContent>
        </a>
        <a href="/supplier">
          <SidebarContent>Supplier Registration</SidebarContent>
        </a>
        <SidebarContent>Notifications</SidebarContent>
        <SidebarContent>Profile</SidebarContent>
        <SidebarContent>Dashboard</SidebarContent>
        <SidebarContent>Invite Friends</SidebarContent>
        <SidebarContent>Settings & Privacy </SidebarContent>
        <SidebarContent>Logout</SidebarContent>
        <SidebarContent>Help & Support</SidebarContent>
        <SidebarContent>Feedback</SidebarContent>
        <SidebarContent>Near by MobiWood user</SidebarContent>
      </SidebarContentContainer>
    </SidebarContainer>
  );
  return (
    <Sidebar
      sidebar={SideLinks}
      open={sidebarOpen}
      onSetOpen={onSetSidebarOpen}
      styles={{ sidebar: { background: "#111", zIndex: 50 } }}
    >
      <AnimationRevealPage disabled>
        <Nav onSetSidebarOpen={onSetSidebarOpen} />
        <VideoPlayer />
        <Footer />
      </AnimationRevealPage>
    </Sidebar>
  );
};

export default Video;
