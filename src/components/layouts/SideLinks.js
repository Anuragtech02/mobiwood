import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import transLogo from "../../images/logo_black.jpg";
import slogo from "../../images/slogo.png";
import { ReactComponent as HomeIcon } from "feather-icons/dist/icons/home.svg";
import { ReactComponent as FilmIcon } from "feather-icons/dist/icons/film.svg";
import { ReactComponent as UserIcon } from "feather-icons/dist/icons/user.svg";
import { ReactComponent as StarIcon } from "feather-icons/dist/icons/star.svg";
import { ReactComponent as MusicIcon } from "feather-icons/dist/icons/music.svg";
import { ReactComponent as SettingsIcon } from "feather-icons/dist/icons/settings.svg";
import { ReactComponent as HelpIcon } from "feather-icons/dist/icons/help-circle.svg";
import { ReactComponent as SmileIcon } from "feather-icons/dist/icons/smile.svg";
import { ReactComponent as UserAddIcon } from "feather-icons/dist/icons/user-plus.svg";
import { ReactComponent as TargetIcon } from "feather-icons/dist/icons/target.svg";
import {css} from "styled-components/macro"; //eslint-disable-line
import { navigate } from "hookrouter";
import styles from '../css/master.css'; 

const SidebarContainer = tw.div`bg-prim-200 text-white`;
const SidebarHeading = tw.div`bg-prim-200 p-6 flex pb-6 pt-4`;
const HeadingText = styled.div`
  ${(props) => `background-image: url("${props.imageSrc}");`}
  ${tw`w-40 h-10 -mt-3 mr-12 bg-contain bg-no-repeat`}
`;
const ShortHeadingText = styled.div`
  ${(props) => `background-image: url("${props.imageSrc}");`}
  ${tw`w-5 h-10 bg-contain bg-no-repeat`}
`;
const SidebarContentContainer = tw.div`p-6 py-0`;
const SidebarContentFirst = tw.div`cursor-pointer flex flex-row pb-4 text-sm border-gray-500`;
const SidebarContent = tw.div(SidebarContentFirst)`py-4 flex flex-row text-sm`;

const handleClick = () => {
  navigate("/contest");
};

const mystyle = {
  
    };

export const SideLinks = (
						  
  <SidebarContainer>
    <SidebarHeading>
      <HeadingText imageSrc={transLogo}></HeadingText>
    </SidebarHeading>
    <SidebarContentContainer>
      <a href="/">
        <SidebarContentFirst>
          <HomeIcon height="20" width="20" tw="mr-4" />
          Home
        </SidebarContentFirst>
      </a>
	  <a href="/trending">
	  <SidebarContent>
        <StarIcon height="20" width="20" tw="mr-4" />
        Trending
      </SidebarContent>
	  </a>
      <div onClick={handleClick}>
        <SidebarContent>
          <FilmIcon height="20" width="20" tw="mr-4" />
          Contests
        </SidebarContent>
      </div>
      <a href="/profile">
        <SidebarContent>
          <UserIcon height="20" width="20" tw="mr-4" />
          Profile
        </SidebarContent>
      </a>
      
      <SidebarContent>
        <MusicIcon height="20" width="20" tw="mr-4" />
        Notifications
      </SidebarContent>
      <SidebarContent>
        <UserAddIcon height="20" width="20" tw="mr-4" />
        Invite Friends
      </SidebarContent>
      <SidebarContent>
        <SettingsIcon height="20" width="20" tw="mr-4" />
        Settings
      </SidebarContent>
	  <a href="/support" title="Help">
      <SidebarContent>
        <HelpIcon height="20" width="20" tw="mr-4" />
        Support
      </SidebarContent>
	  </a>
	  <a href="/feedback">
      <SidebarContent>
        <SmileIcon height="20" width="20" tw="mr-4" />
        Feedback
      </SidebarContent>
	  </a>
      <SidebarContent tw="hidden">
        <TargetIcon height="20" width="20" tw="mr-4" />
        Near by MobiWood user
      </SidebarContent>
    </SidebarContentContainer>
  </SidebarContainer>
);

export const SideLinksShort = (
  <SidebarContainer>
    <SidebarHeading>
      <ShortHeadingText imageSrc={slogo}></ShortHeadingText>
    </SidebarHeading>
    <SidebarContentContainer>
      <a href="/" title="Home" tw="block">
        <SidebarContentFirst>
          <HomeIcon height="20" width="20" />
        </SidebarContentFirst>
      </a>
	  <a href="/dashboard" title="Trending">
      <SidebarContent>
        <StarIcon height="20" width="20" />
      </SidebarContent>
	  </a>
      <div onClick={handleClick} title="Contests">
        <SidebarContent>
          <FilmIcon height="20" width="20" />
        </SidebarContent>
      </div>
      <a href="/profile" title="Profile">
        <SidebarContent>
          <UserIcon height="20" width="20" />
        </SidebarContent>
      </a>
	  
	  <a href="/notification" title="Notification">
      <SidebarContent>
        <MusicIcon height="20" width="20" />
      </SidebarContent>
	  </a>
	  <a href="/invite-friends" title="Invite Friends">
      <SidebarContent>
        <UserAddIcon height="20" width="20" />
      </SidebarContent>
	  </a>
	  <a href="/settings" title="Settings">
      <SidebarContent>
        <SettingsIcon height="20" width="20" />
      </SidebarContent>
	  </a>
	  <a href="/support" title="Help">
      <SidebarContent>
        <HelpIcon height="20" width="20" />
      </SidebarContent>
	  </a>
	  <a href="/feedback" title="Feedback">
      <SidebarContent>
        <SmileIcon height="20" width="20" />
      </SidebarContent>
	  </a>
	  <a href="/nearby-friends" title="Nearby Mobiwood User" tw="hidden">
      <SidebarContent>
        <TargetIcon height="20" width="20" />
      </SidebarContent>
	  </a>
    </SidebarContentContainer>
  </SidebarContainer>
);

export default SideLinks;
