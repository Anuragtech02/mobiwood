import React from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import HeaderBase, {
  LogoLink as LogoLinkBase,
  NavLinks,
  NavLink as NavLinkBase,
  PrimaryLink as PrimaryLinkBase,
} from "./light.js";
import logoImageSrc from "../../images/logo.png";
import { Content2Xl } from "./Layouts";

const PrimaryBackgroundContainer = tw.div`px-8 h-auto bg-white text-gray-900`;
const Header = tw(HeaderBase)`max-w-none -mt-8 py-8 -mx-8 px-8`;
const NavLink = tw(
  NavLinkBase
)`lg:text-gray-700 lg:hocus:text-gray-900 lg:hocus:border-gray-400`;
const LogoLink = tw(LogoLinkBase)`text-gray-700 hocus:text-gray-900`;
const PrimaryLink = tw(
  PrimaryLinkBase
)`shadow-raised lg:bg-primary-400 lg:hocus:bg-primary-500`;

const Nav = () => {
  const logoLink = (
    <LogoLink href="/">
      <img src={logoImageSrc} alt="Logo" tw="min-h-0 object-contain" />
    </LogoLink>
  );
  const navLinks = [
    <NavLinks key={1}>
      <NavLink href="/login">Login</NavLink>
      <PrimaryLink href="/signup">Signup</PrimaryLink>
    </NavLinks>,
  ];
  return (
    <PrimaryBackgroundContainer>
      <Content2Xl>
        <Header logoLink={logoLink} links={navLinks} />
      </Content2Xl>
    </PrimaryBackgroundContainer>
  );
};

export default Nav;
