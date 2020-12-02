import React, { useState } from "react";
import AnimationRevealPage from "../layouts/AnimationRevealPage";
import Nav from "../layouts/NewNav";
import tw from "twin.macro";
import styled from "styled-components";
import { isBrowser, isMobile, isTablet } from "react-device-detect";
import Sidebar from "react-sidebar";
import { auth, firestore } from "../../firebase.config";
import { navigate } from "hookrouter";
import { SideLinks, SideLinksShort } from "../layouts/SideLinks";
import logo from "../../images/logo_tm.png";
import { ReactComponent as MapPin } from "feather-icons/dist/icons/map-pin.svg";
import { ReactComponent as AwardIcon } from "feather-icons/dist/icons/award.svg";
import { ReactComponent as LikeIcon } from "feather-icons/dist/icons/thumbs-up.svg";
import { ReactComponent as DollarIcon } from "feather-icons/dist/icons/dollar-sign.svg";
import { ReactComponent as EyeIcon } from "feather-icons/dist/icons/eye.svg";
import { ReactComponent as ShareIcon } from "feather-icons/dist/icons/send.svg";
import { ReactComponent as GraphIcon } from "feather-icons/dist/icons/trending-up.svg";
import { ReactComponent as Comment } from "feather-icons/dist/icons/message-square.svg";
import Footer from "../layouts/Footer";
import { css } from "styled-components/macro"; //eslint-disable-line

const Content = tw.div`flex flex-col lg:flex-row pt-6 px-2 sm:px-6 overflow-x-hidden bg-purple-100 block`;
const LeftContent = tw.div`w-full lg:w-2/3 m-auto`;
const RightContent = tw.div`w-full lg:w-1/2`;
const ProfileInfo = tw.div`flex flex-col sm:flex-row justify-between`;
const ProfileLeft = tw.div`flex flex-col sm:flex-row`;
const OtherInfo = tw.div`flex flex-col m-2 sm:mx-4`;
const ProfileName = tw.div`font-semibold text-3xl`;
const Location = tw.div`flex flex-row text-sm ml-1 mt-2`;
const Age = tw.div`text-sm m-2 ml-1`;
const AwardInfo = tw.div`my-2 w-full flex flex-col sm:flex-row justify-between border-b border-gray-400`;
const Award = tw.div`sm:w-1/3 my-3 flex flex-row justify-between sm:justify-start`;
const AwardText = tw.div`mr-2 text-right sm:text-left sm:ml-4`;
const Line1 = tw.div`font-semibold`;
const Line2 = tw.div``;

const ProfileRight = tw.div`sm:m-2 flex flex-row`;
const Button = tw.div`mx-2 px-5 text-white hocus:bg-button-200 cursor-pointer rounded-full py-2 bg-button-100 h-8 text-xs`;

const ProfileImage = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`bg-cover bg-center h-28 w-28 rounded-full mx-2`,
]);

const Flex = tw.div`flex flex-col lg:flex-row border-gray-400  last:border-b-0`;

const Data = tw.div`py-5`;
const DataHeading = tw.div`sm:mx-4 mb-4 mt-2 flex flex-row font-bold text-gray-900`;
const DataTable = tw.div` flex flex-col shadow sm:mx-4`;
const Row = tw.div`p-3 flex first:border-t border-b flex-row justify-between`;
const Col = tw.div`text-xs`;

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  function onSetSidebarOpen(open) {
    setSidebarOpen(!sidebarOpen);
  }

  const [loginModal, setLoginModal] = useState(false);
  function onClickLogin() {
    setLoginModal(true);
  }

  const [signupModal, setSignupModal] = useState(false);
  function onClickSignup() {
    setSignupModal(true);
  }

  if (!auth.currentUser) {
    navigate("/");
  }

  // React.useEffect(() => {
  //   if (!auth.currentUser) {
  //     setTimeout(() => {
  //       // navigate("/");
  //     }, 500);
  //   }
  //   console.log(auth.currentUser);
  // }, [auth.currentUser]);

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
        docked={isBrowser ? sidebarOpen : false}
      >
        <Sidebar
          sidebar={SideLinksShort}
          open={isBrowser ? !sidebarOpen : false}
          onSetOpen={onSetSidebarOpen}
          styles={{ sidebar: { background: "#111", zIndex: 30 } }}
          docked={isBrowser ? !sidebarOpen : false}
        >
          <AnimationRevealPage disabled>
            <Nav
              onSetSidebarOpen={onSetSidebarOpen}
              onClickLogin={onClickLogin}
              onClickSignup={onClickSignup}
            />
            <Content>
              <LeftContent tw="lg:p-4">
                <ProfileInfo>
                  <ProfileLeft>
                    <ProfileImage
                      imageSrc={
                        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=3.25&w=512&h=512&q=80"
                      }
                    />
                    <OtherInfo>
                      <ProfileName>Christina Justin</ProfileName>
                      <Location >
                      <span tw="mr-5"><strong>0</strong> Posts</span>  <span tw="mr-5"><strong>0</strong> Followers</span> <span><strong>0</strong> Following</span>
                      </Location>
                    </OtherInfo>
                  </ProfileLeft>
                  <ProfileRight>
                    <Button tw="bg-gray-600">Edit</Button> <Button>Follow</Button>
                  </ProfileRight>
                </ProfileInfo>
                </LeftContent>
                
              <div tw="clear-both"></div>
              <div class="profile-grid">Under Construction</div>
              </Content>
              
            <Footer />
          </AnimationRevealPage>
        </Sidebar>
      </Sidebar>
    </div>
  );
};

export default UserDashboard;
