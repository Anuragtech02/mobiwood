import React from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line
import HeaderBase, {
  LogoLink as LogoLinkBase,
  NavLinks,
  NavLink as NavLinkBase,
  PrimaryLink as PrimaryLinkBase,
} from "./lightnew.js";
import { ReactComponent as MenuIcon } from "feather-icons/dist/icons/menu.svg";
import firebase from "firebase";
import { auth } from "../../firebase.config";

const PrimaryBackgroundContainer = tw.div`mt-3 px-2 h-auto  bg-primary-900 text-gray-900 z-40 sticky top-0`;
const Header = tw(HeaderBase)`-mt-4 py-3 mr-2 pl-2 sticky top-0`;
const NavLink = tw(
  NavLinkBase
)`text-gray-100 hocus:text-gray-400 hocus:border-gray-400 font-normal cursor-pointer`;
const LogoLink = tw(
  LogoLinkBase
)`text-gray-100 hocus:text-gray-400 cursor-pointer`;
const PrimaryLink = tw(
  PrimaryLinkBase
)`shadow-raised bg-button-200 hocus:bg-button-100 font-normal cursor-pointer`;

const logout = () => {
  localStorage.clear();
}

const Nav = ({ onSetSidebarOpen, onClickSignup, onClickLogin }) => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const logoLink = (
    <LogoLink onClick={onSetSidebarOpen}>
      <MenuIcon />
    </LogoLink>
  );
  const navLinks = loggedIn
    ? [
      <NavLinks key={1}>
        <PrimaryLink onClick={() => {logout(); auth.signOut()}}>Logout</PrimaryLink>
      </NavLinks>
    ]
    : [
        <NavLinks key={1}>
          <NavLink href="#" onClick={onClickLogin} tw="w-12 inline-block">Login</NavLink>
          <PrimaryLink hred="#" onClick={onClickSignup}>Signup</PrimaryLink>
        </NavLinks>,
      ];

  const onAuthStateChanged = (u) => {
    if (localStorage.getItem('username') || (u && u.uid)) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  };

  React.useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return (
    <PrimaryBackgroundContainer>
      <Header logoLink={logoLink} links={navLinks} />
    </PrimaryBackgroundContainer>
  );
};

export default Nav;
