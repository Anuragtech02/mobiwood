import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line

import logo from "../../images/logo_black.jpg";

const Header = tw.header`flex justify-between items-center mx-auto`;

export const NavLinks = tw.div`inline-block`;

/* hocus: stands for "on hover or focus"
 * hocus:bg-primary-700 will apply the bg-primary-700 class on hover or focus
 */
export const NavLink = tw.a`
  text-sm  my-0
  font-semibold tracking-wide transition duration-300
   border-b-2 border-transparent hover:border-primary-500 hocus:text-primary-500
`;

export const PrimaryLink = tw(NavLink)`
  mx-0
  px-4 py-2 text-sm rounded bg-primary-500 text-gray-100
  hocus:bg-primary-700 hocus:text-gray-200 focus:shadow-outline
  border-b-0
`;

export const LogoLink = styled(NavLink)`
  ${tw`flex items-center font-black border-b-0 text-2xl!`};

  img {
    ${tw`w-32`}
  }
`;

export const MobileNavLinksContainer = tw.nav`flex flex-1 items-center justify-between z-40`;

export const DesktopNavLinks = tw.nav`
  flex flex-1 justify-between items-center
`;

export default ({
  roundedHeaderButton = false,
  logoLink,
  links,
  className,
  mLogo,
  collapseBreakpointClass = "lg",
}) => {
  /*
   * This header component accepts an optionals "links" prop that specifies the links to render in the navbar.
   * This links props should be an array of "NavLinks" components which is exported from this file.
   * Each "NavLinks" component can contain any amount of "NavLink" component, also exported from this file.
   * This allows this Header to be multi column.
   * So If you pass only a single item in the array with only one NavLinks component as root, you will get 2 column header.
   * Left part will be LogoLink, and the right part will be the the NavLinks component you
   * supplied.
   * Similarly if you pass 2 items in the links array, then you will get 3 columns, the left will be "LogoLink", the center will be the first "NavLinks" component in the array and the right will be the second "NavLinks" component in the links array.
   * You can also choose to directly modify the links here by not passing any links from the parent component and
   * changing the defaultLinks variable below below.
   * If you manipulate links here, all the styling on the links is already done for you. If you pass links yourself though, you are responsible for styling the links or use the helper styled components that are defined here (NavLink)
   */
  const defaultLinks = [
    <NavLinks key={1}>
      <NavLink href="/#">About</NavLink>
      <NavLink href="/#">Blog</NavLink>
      <NavLink href="/#">Pricing</NavLink>
      <NavLink href="/#">Contact Us</NavLink>
      <NavLink href="/#" tw="lg:ml-12!">
        Login
      </NavLink>
      <PrimaryLink css={roundedHeaderButton && tw`rounded-full`} href="/#">
        Sign Up
      </PrimaryLink>
    </NavLinks>,
  ];

  const defaultLogoLink = (
    <LogoLink href="/">
      <img src={logo} alt="logo" />
      MobiWood
    </LogoLink>
  );

  const midLogo = (
    <LogoLink href="/" tw="m-0 p-0 -ml-12 -mt-2">
      <img src={logo} alt="logo" tw="m-auto" />
    </LogoLink>
  );

  logoLink = logoLink || defaultLogoLink;
  links = links || defaultLinks;
  mLogo = midLogo;

  return (
    <Header className={className || "header-light"}>
      <DesktopNavLinks>
        {logoLink}
        {mLogo}
        {links}
      </DesktopNavLinks>
    </Header>
  );
};
