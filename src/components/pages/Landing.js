import React, { useState } from "react";
import Nav from "../layouts/NewNav";
import AnimationRevealPage from "../layouts/AnimationRevealPage";
import LeftImage from "../layouts/LeftImage";
import RightImage from "../layouts/RightImage";
import DesignIllustration from "../../images/contest_image.svg";
import DesignIllustration2 from "../../images/login.jpg";
import Sidebar from "react-sidebar";
import { ReactComponent as CloseIcon } from "feather-icons/dist/icons/x.svg";
import transLogo from "../../images/logo_tm.png";
import tw from "twin.macro";
import styled from "styled-components";
import {css} from "styled-components/macro"; //eslint-disable-line
import Footer from "../layouts/Footer";

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

const Landing = () => {
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
        <LeftImage
          image={DesignIllustration}
          heading="Here is a very captivating heading!"
          content="We posted this competition for you all and we would like for you to take part in it!"
        />
        <RightImage
          image={DesignIllustration2}
          heading="Here is another captivating heading!"
          content="We we post more info about the competition to make you take part in it!"
        />
        <Footer />
      </AnimationRevealPage>
    </Sidebar>
  );
};

export default Landing;
