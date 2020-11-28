import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line 
import { Container as ContainerBase } from "./Layouts.js";
import logo from "../../images/logo_black.jpg";
import FacebookIcon from "../../images/facebook-icon.png";
import InstagramIcon from "../../images/instagram-icon.png";
import TwitterIcon from "../../images/twitter-icon.png";
import YoutubeIcon from "../../images/youtube-icon.png";

const Container = tw(ContainerBase)`max-w-screen bg-primary-900 text-gray-100`;
const Content = tw.div`max-w-screen-xl mx-auto py-8`;

const Row = tw.div`flex items-center justify-center flex-col px-8`;

const LogoContainer = tw.div`flex items-center justify-center md:justify-start`;
const LogoImg = tw.img`w-56 mb-2`;

const LinksContainer = tw.div`font-medium flex flex-wrap justify-center items-center flex-col sm:flex-row`;
const Link = tw.a`border-b-2 border-transparent hocus:text-gray-300 hocus:border-gray-300 pb-1 transition duration-300 mt-2 mx-4 text-sm md:text-base`;

const CopyrightText = tw.p`text-center mt-5 font-medium tracking-wide text-xs md:text-sm text-gray-500`;

const SocialLinksContainer = tw.div`mt-5`;
const SocialLink = styled.a`
  ${tw`cursor-pointer inline-block text-gray-100 hover:text-gray-500 transition duration-300 mx-4`}
  svg {
    ${tw`w-5 h-5`}
  }
`;

export default () => {
  return (
    <Container>
      <Content>
        <Row>
          <LogoContainer>
            <LogoImg src={logo} />
          </LogoContainer>
          <LinksContainer>
            <Link href="/about">About</Link>
            <Link href="/news">News</Link>
            <Link href="/advertising">Advertising</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/support">Support</Link>
          </LinksContainer>
          <SocialLinksContainer>
            <SocialLink
              href="https://www.facebook.com/MobiWood-Entertainment-107346937756581"
              target="_blank"
            >
              <img src={FacebookIcon} alt="Facebook" tw="h-5" />
            </SocialLink>
            <SocialLink
              href="https://www.instagram.com/mobiwoodentertainment"
              target="_blank"
            >
              <img src={InstagramIcon} alt="Instagram" tw="h-5" />
            </SocialLink>
            <SocialLink href="https://twitter.com/MobiwoodE" target="_blank">
              <img src={TwitterIcon} alt="Twitter" tw="h-5" />
            </SocialLink>
			<SocialLink href="https://www.youtube.com/channel/UCHIDY2PMNb7Czfck_dARl-w" target="_blank">
              <img src={YoutubeIcon} alt="Youtube" tw="h-5" />
            </SocialLink>
          </SocialLinksContainer>
          <CopyrightText>
            &copy; Copyright {new Date().getFullYear()} &bull; Mobiwood - All
            Rights Reserved
            <div>
              Powered By -{" "}
              <a href="https://samairawebsolutions.in/" target="_blank">
                Samaira Web Solutions
              </a>
            </div>
          </CopyrightText>
        </Row>
      </Content>
    </Container>
  );
};
