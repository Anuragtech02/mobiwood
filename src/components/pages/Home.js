import React, { useState, useEffect, useRef } from "react";
import Nav from "../layouts/NewNav";
import VideoGrid from "../layouts/TrendingSlider";
import AnimationRevealPage from "../layouts/AnimationRevealPage";
import Footer from "../layouts/Footer";
import Sidebar from "react-sidebar";
import { ReactComponent as CloseIcon } from "feather-icons/dist/icons/x.svg";
import { ReactComponent as SearchIcon } from "feather-icons/dist/icons/search.svg";
import { ReactComponent as TrendingIcon } from "feather-icons/dist/icons/trending-up.svg";
import { ReactComponent as MenuIcon } from "feather-icons/dist/icons/menu.svg";
import { ReactComponent as CircleCheckIcon } from "feather-icons/dist/icons/check.svg";
import tw from "twin.macro";
import ImageGrid from "../layouts/ImageGrid";
import { auth, firestore } from "../../firebase.config";
import googleIconImageSrc from "../../images/google-icon.png";
import twitterIconImageSrc from "../../images/twitter-icon.png";
import facebookIconImageSrc from "../../images/facebook-icon.png";

import { isBrowser, isMobile, isTablet } from "react-device-detect";
import { SideLinks, SideLinksShort } from "../layouts/SideLinks";
import { useFormik } from "formik";
import { navigate } from "hookrouter";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import sampleImage from "../../images/image5.jpeg";
import sampleImage2 from "../../images/image3.jpeg";
import sampleImage3 from "../../images/image5.jpg";
import sampleImage4 from "../../images/image4.jpeg";
import sampleImage5 from "../../images/image2.jpeg";

const GridContent = tw.div` mx-auto pb-4`;
const ThreeColumn = tw.div`flex items-center flex-row flex-wrap`;
const Column = tw.div`flex mt-5 w-full sm:w-1/3 justify-center`;
const Card = tw.div`flex justify-center mx-2 py-2 border rounded-md w-full`;

const Actions = styled.div`
  ${tw`relative mt-6 mb-2 px-4 text-center mx-auto`}
  input {
    ${tw`sm:pr-48 pl-3 py-3 rounded-md border-2 w-full font-normal placeholder-gray-800 text-sm focus:outline-none transition duration-300 bg-gray-300`}
  }
  button {
    ${tw`absolute right-0 top-0 bottom-0 bg-gray-300 text-gray-800 opacity-75 my-2 sm:my-2 rounded-full py-4 flex items-center justify-center w-12 sm:leading-none focus:outline-none transition mr-6 duration-300`}
  }
`;

const TrendingSearchOptions = tw.div`flex flex-col sm:flex-row mb-4 mx-4 text-xs justify-between`;
const TrendingNames = tw.div`flex flex-row flex-wrap justify-start`;
const TrendingName = tw.div`hover:font-semibold hover:underline cursor-pointer`;
const Categories = tw.div`flex flex-row sm:justify-start justify-center border bg-black sm:bg-white text-white sm:text-black py-2 sm:py-0 sm:border-0 cursor-pointer`;

// const BottomNavigation = tw.div`flex justify-center mb-6`;
// const NavLink = tw.div`px-2 sm:px-4 lg:px-10 py-3 border-gray-500 sm:mx-2 mx-1 lg:mx-4 border rounded text-gray-800 text-xs sm:text-base font-semibold`;

const OutNav = tw.div`font-display text-secondary-500 block overflow-hidden`;
const Content = tw.div`flex mx-4 flex-col lg:flex-row `;
const ContentLeft = tw.div`w-full lg:w-9/12 overflow-hidden lg:pr-4`;
const ContentRight = tw.div`w-full lg:w-3/12`;
const SliderContainer = tw.div`w-full flex-col`;

const ModalContainer = tw.div`justify-center m-4 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none`;
const OutModal = tw.div`opacity-75 fixed inset-0 z-40 bg-black`;
const ModalContent = tw.div`relative w-auto my-auto mx-auto max-w-3xl`;

const FormContainer = tw.div`w-full flex flex-col sm:flex-row`;

const Form = tw.form`mx-auto`;
const Input = tw.input`w-full p-4 rounded-sm shadow font-medium text-gray-900 bg-white border border-gray-400 placeholder-gray-900 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide bg-black text-sm text-white w-full py-4 rounded hover:opacity-75 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;

const ErrorMessage = tw.div`text-red-600 -mb-2 mt-3 text-sm`;

const validate = (values) => {
  const errors = {};
  if (values.signup) {
    if (!values.name) {
      errors.name = "Please Enter Name";
    }

    if (!values.email) {
      errors.email = "Please Enter Email";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!values.username) {
      errors.username = "Please Enter Username";
    } else {
      firestore
        .collection("username")
        .doc(values.username)
        .get()
        .then(function (details) {
          if (details.exists) {
            alert("Username Exists");
          }
        });
    }

    if (!values.password) {
      errors.password = "Please Enter Password";
    }
  } else {
    if (!values.username) {
      errors.loginUsername = "Please Enter Username";
    }

    if (!values.password) {
      errors.loginPassword = "Please Enter Password";
    }
  }

  return errors;
};

// Main Function

const Home = ({
  socialButtons = [
    {
      iconImageSrc: facebookIconImageSrc,
      text: "Sign Up With Facebook",
      bg: "#3b5998",
    },
    {
      iconImageSrc: googleIconImageSrc,
      text: "Sign Up With Google",
      url: "https://google.com",
      bg: "#dc4e41",
    },
    {
      iconImageSrc: twitterIconImageSrc,
      text: "Sign Up With Twitter",
      bg: "#00a0dc",
    },
  ],
  LoginsocialButtons = [
    {
      iconImageSrc: facebookIconImageSrc,
      text: "Log In With Facebook",
      bg: "#3b5998",
    },
    {
      iconImageSrc: googleIconImageSrc,
      text: "Log In With Google",
      url: "https://google.com",
      bg: "#dc4e41",
    },
    {
      iconImageSrc: twitterIconImageSrc,
      text: "Log In With Twitter",
      bg: "#00a0dc",
    },
  ],
}) => {
  const asyncLocalStorage = {
    setItem: function (key, value) {
      return Promise.resolve().then(function () {
        localStorage.setItem(key, value);
      });
    },
    getItem: function (key) {
      return Promise.resolve().then(function () {
        return localStorage.getItem(key);
      });
    },
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  function onSetSidebarOpen(open) {
    setSidebarOpen(!sidebarOpen);
  }

  const [showModal, setShowModal] = useState(false);

  const [loginModal, setLoginModal] = useState(false);
  function onClickLogin() {
    setLoginModal(true);
  }

  const [signupModal, setSignupModal] = useState(false);
  function onClickSignup() {
    setSignupModal(true);
  }

  const [radioValue, setRadioValue] = useState("a18");

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowModal(false);
          setSignupModal(false);
          setLoginModal(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  // Firebase and Auth handles

  const [firebaseErrors, setFirebaseErrors] = useState({});
  function handleErrors(type, message) {
    if (type === "email") {
      setFirebaseErrors({});
      setFirebaseErrors({
        email: message,
      });
    } else if (type === "password") {
      setFirebaseErrors({});
      setFirebaseErrors({
        password: message,
      });
    } else if (type === "username") {
      setFirebaseErrors({});
      setFirebaseErrors({
        username: message,
      });
    } else {
      setFirebaseErrors({});
      setFirebaseErrors({
        errors: message,
      });
    }
  }

  const handleAuthStateChange = (u) => {
    if (u && u.uid) {
      console.log("LOGGED IN: ", u.displayName);
    }
  };

  // Formik

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      username: "",
    },
    validate,
    onSubmit: (values) => {
      auth
        .createUserWithEmailAndPassword(values.email, values.password)
        .then(function ({ user }) {
          auth.currentUser
            .updateProfile({
              displayName: values.name,
            })
            .then(function () {
              if (user && user.uid) {
                console.log("Getting in here");
                const data = {
                  name: values.name,
                  email: user.email,
                  username: values.username,
                  account_creation_datetime: user.metadata.creationTime,
                  last_login_datetime: user.metadata.creationTime,
                };
                firestore
                  .collection("user")
                  .doc(user.uid)
                  .set(data, { merge: true })
                  .then(function () {
                    const usernamedata = {
                      uid: user.uid,
                    };
                    firestore
                      .collection("username")
                      .doc(values.username)
                      .set(usernamedata, { merge: true })
                      .then(function () {
                        asyncLocalStorage.setItem("username", values.username);
                        navigate("/contest");
                        setLoginModal(false);
                        setSignupModal(false);
                      })
                      .catch(function (error) {
                        handleErrors("others", error.message);
                      });
                  })
                  .catch(function (error) {
                    handleErrors("others", error.message);
                  });
              }
            })
            .catch(function (error) {
              console.log(error);
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === "auth/weak-password") {
            handleErrors("password", "The password is too weak");
          } else if (errorCode === "auth/email-already-in-use") {
            handleErrors("email", "Email already exists");
          } else if (errorCode === "auth/invalid-email") {
            handleErrors("email", "Invalid email");
          } else {
            handleErrors("others", errorMessage);
          }
        });
      // if (underAge) {
      //   navigate("/contest/underage");
      // } else {
      //   navigate("/contest/upload");
      // }
    },
  });

  // Login Formik

  const Loginformik = useFormik({
    initialValues: {
      password: "",
      username: "",
    },
    validate,
    onSubmit: (values) => {
      firestore
        .collection("username")
        .doc(values.username)
        .get()
        .then(function (details) {
          if (details.exists) {
            firestore
              .collection("user")
              .doc(details.data().uid)
              .get()
              .then(function (userVals) {
                auth
                  .signInWithEmailAndPassword(
                    userVals.data().email,
                    values.password
                  )
                  .then(function () {
                    asyncLocalStorage.setItem("username", values.username);
                    firestore
                      .collection("user")
                      .doc(details.data().uid)
                      .update({ last_login_datetime: new Date() }, 
															  //{merge: true}
					);
                    navigate("/contest");
                    setLoginModal(false);
                    setSignupModal(false);
                  })
                  .catch(function (e) {
                    console.log("Signin Error: ", e.message);
                    alert("Invalid Credentials");
                  });
              });
          } else {
            alert("Invalid Credentials");
          }
        })
        .catch(function (error) {
          handleErrors("others", error.message);
        });
    },
  });

  React.useEffect(() => {
    localStorage.removeItem("register");
    localStorage.removeItem("underage");
    const sub = auth.onAuthStateChanged(handleAuthStateChange);
    return sub;
  }, []); //eslint-disable-line

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
		styles={{ sidebar: { background: "#111",  zIndex: 30 } }}
        docked={!isTablet && !isMobile ? !sidebarOpen : false}
      >
        <AnimationRevealPage disabled>	
          <Nav
            onSetSidebarOpen={onSetSidebarOpen}
            onClickLogin={onClickLogin}
            onClickSignup={onClickSignup}
          />
          <OutNav>
            <Actions>
              <input type="text" placeholder="Search" />
              <button>
                <SearchIcon />
              </button>
            </Actions>
            <TrendingSearchOptions>
              <TrendingNames>
                <TrendingIcon tw="h-4" />
                Trending Searches:&nbsp;
				
                <TrendingName>Shushant Singh Rajput</TrendingName>,&nbsp;
                <TrendingName>Sidharth Shukla</TrendingName>,&nbsp;
                <TrendingName>Rashmi Desai</TrendingName>,&nbsp;
                <TrendingName>Asim Riaz</TrendingName>,&nbsp;
                <TrendingName>Himanshi Khurana</TrendingName>
				
              </TrendingNames>
              <Categories onClick={() => setShowModal(true)}>
                <strong tw="lg:font-semibold">All Categories</strong>
              </Categories>
            </TrendingSearchOptions>
            <Content>
              <ContentLeft>
                <SliderContainer>
                  <VideoGrid />
                </SliderContainer>
                <ImageGrid heading="New Releases" />
              </ContentLeft>
              <ContentRight>
      			<AdImages />
			  </ContentRight>
            </Content>

            {/* <BottomNavigation>
          <a href="/contest">
            <NavLink>Contest</NavLink>
          </a>
          <a href="/artist">
            <NavLink>Artists</NavLink>
          </a>
          <a href="/supplier">
            <NavLink>Supplier/Vendor</NavLink>
          </a>
          <NavLink>Profile</NavLink>
        </BottomNavigation> */}
            <Footer />
          </OutNav>
          {showModal ? (
            <>
              <ModalContainer>
                <ModalContent ref={wrapperRef}>
                  <div tw="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div tw="flex items-start justify-between py-3 px-5 border-b border-solid border-gray-300 rounded-t">
                      <h3 tw="text-xl font-semibold">Categories</h3>
                      <button
                        onClick={() => setShowModal(false)}
                        tw="p-1 ml-auto bg-transparent opacity-75 border-0 text-black float-right text-xl leading-none font-semibold outline-none focus:outline-none"
                      >
                        <CloseIcon tw="cursor-pointer text-black h-5  w-6 text-xl block outline-none focus:outline-none" />
                      </button>
                    </div>
                    {/*body*/}
                    <div tw="relative p-6 flex-auto">
                      <div tw="my-4 text-gray-600 text-lg leading-relaxed">
                        <GridContent>
                          <ThreeColumn>
                            <Column>
                              <Card>Acting</Card>
                            </Column>
                            <Column>
                              <Card>Singing</Card>
                            </Column>
                            <Column>
                              <Card>Dancing</Card>
                            </Column>
                            <Column>
                              <Card>Comedy</Card>
                            </Column>
                            <Column>
                              <Card>Music</Card>
                            </Column>
                            <Column>
                              <Card>Magic</Card>
                            </Column>
                            <Column>
                              <Card>Acrobatics</Card>
                            </Column>
                            <Column>
                              <Card>Others</Card>
                            </Column>
                          </ThreeColumn>
                        </GridContent>
                      </div>
                    </div>
                  </div>
                </ModalContent>
              </ModalContainer>
              <OutModal></OutModal>
            </>
          ) : null}
          {signupModal ? (
            <>
              <ModalContainer>
                <ModalContent ref={wrapperRef}>
                  <div tw="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div tw="flex items-start justify-between py-3 px-5 border-b border-solid border-gray-300 rounded-t">
                      <h3 tw="text-xl font-semibold">Create New Account</h3>
                      <button
                        onClick={() => setSignupModal(false)}
                        tw="p-1 ml-auto bg-transparent opacity-75 border-0 text-black float-right text-xl leading-none font-semibold outline-none focus:outline-none"
                      >
                        <CloseIcon tw="cursor-pointer text-black h-5 w-6 text-xl block outline-none focus:outline-none" />
                      </button>
                    </div>
                    {/*body*/}
                    <div tw="relative p-6 pt-4 flex-auto">
                      <div tw="text-gray-600 max-w-lg text-lg leading-relaxed">
                        <div tw="w-full">
                          <FormContainer>
                            {}
                            <div tw="w-full ">
                              {firebaseErrors.others ? (
                                <ErrorMessage>
                                  {firebaseErrors.others}
                                </ErrorMessage>
                              ) : null}
                              <Form onSubmit={formik.handleSubmit}>
                                <div tw="relative">
                                  <div class="age-btns-b18">
								  <label tw="cursor-pointer rounded block p-2 bg-gray-300 text-gray-900 text-center font-semibold text-sm">
                                    <input
                                      type="radio"
                                      name="age"
                                      tw="invisible"
                                      value="b18"
                                      onClick={() => setRadioValue("b18")}
                                    />
                                    Below 18 Years
                                  </label>
								  </div>
                                  {radioValue === "b18" && (
                                    <span class="b18-circle"><CircleCheckIcon tw="h-5 w-5 p-1 -mt-3 mx-auto bg-green-700 rounded-full text-white" /></span>
                                  )}
								  <div class="age-btns-a18">
                                  <label tw="p-2 cursor-pointer rounded block bg-black text-white text-center font-semibold text-sm">
                                    <input
                                      type="radio"
                                      name="age"
                                      tw="invisible"
                                      value="a18"
                                      onClick={() => setRadioValue("a18")}
                                    />
                                    Above 18 Years
                                  </label>
								  </div>
                                  {radioValue === "a18" && (
                                    <span class="a18-circle"><CircleCheckIcon tw="h-5 w-5 p-1 -mt-3 mx-auto bg-green-700 rounded-full text-white" /></span>
                                  )}
                                </div>
                                {formik.errors.name ? (
                                  <ErrorMessage>
                                    {formik.errors.name}
                                  </ErrorMessage>
                                ) : null}
                                <Input
                                  type="text"
                                  placeholder="Name"
                                  name="name"
                                  autoComplete="name"
                                  onChange={formik.handleChange}
                                  value={formik.values.name}
                                />
                                {formik.errors.email ? (
                                  <ErrorMessage>
                                    {formik.errors.email}
                                  </ErrorMessage>
                                ) : null}
                                {firebaseErrors.email ? (
                                  <ErrorMessage>
                                    {firebaseErrors.email}
                                  </ErrorMessage>
                                ) : null}
                                <Input
                                  type="email"
                                  placeholder="Email"
                                  name="email"
                                  autoComplete="email"
                                  onChange={formik.handleChange}
                                  value={formik.values.email}
                                />
                                {formik.errors.username ? (
                                  <ErrorMessage>
                                    {formik.errors.username}
                                  </ErrorMessage>
                                ) : null}
                                <Input
                                  type="text"
                                  placeholder="Username"
                                  name="username"
                                  onChange={formik.handleChange}
                                  value={formik.values.username}
                                />
                                {formik.errors.password ? (
                                  <ErrorMessage>
                                    {formik.errors.password}
                                  </ErrorMessage>
                                ) : null}
                                {firebaseErrors.password ? (
                                  <ErrorMessage>
                                    {firebaseErrors.password}
                                  </ErrorMessage>
                                ) : null}
                                <Input
                                  type="password"
                                  name="password"
                                  placeholder="Password"
                                  autoComplete="new-password"
                                  onChange={formik.handleChange}
                                  value={formik.values.password}
                                />
                                <SubmitButton
                                  type="submit"
                                  onClick={() => (formik.values.signup = 1)}
                                >
                                  <span className="text">Create Account</span>
                                </SubmitButton>
                              </Form>
                            </div>
                          </FormContainer>
                        </div>
                      </div>
                      <div tw="mt-4 -mb-2 text-center text-xs">
                        By creating an account you are agree to our <a href="/terms-and-conditions">Terms and Conditions</a> and <a href="/policy">Privacy Policy</a>
                      </div>
                    </div>
                  </div>
                </ModalContent>
              </ModalContainer>
              <OutModal></OutModal>
            </>
          ) : null}
          {loginModal ? (
            <>
              <ModalContainer>
                <ModalContent ref={wrapperRef}>
                  <div tw="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    {/*header*/}
                    <div tw="flex items-start justify-between py-3 px-5 border-b border-solid border-gray-300 rounded-t">
                      <h3 tw="text-xl font-semibold">Log In to Your Account</h3>
                      <button
                        onClick={() => setLoginModal(false)}
                        tw="p-1 ml-auto bg-transparent opacity-75 border-0 text-black float-right text-xl leading-none font-semibold outline-none focus:outline-none"
                      >
                        <CloseIcon tw="cursor-pointer text-black h-5 w-6 text-xl block outline-none focus:outline-none" />
                      </button>
                    </div>
                    {/*body*/}
                    <div tw="relative p-6 flex-auto">
                      <div tw="text-gray-600 max-w-lg text-lg leading-relaxed">
                        <div tw="w-full">
                          <FormContainer>
                            {/* <div tw="w-full sm:w-1/2 sm:pr-4 mb-1">
                              <SocialButtonsContainer>
                                {LoginsocialButtons.map(
                                  (socialButton, index) => (
                                    <SocialButton
                                      key={index}
                                      onClick={socialButton.onclick}
                                      style={{
                                        backgroundColor: socialButton.bg,
                                      }}
                                    >
                                      <span className="iconContainer">
                                        <img
                                          src={socialButton.iconImageSrc}
                                          className="icon"
                                          alt=""
                                        />
                                      </span>
                                      <span className="text">
                                        {socialButton.text}
                                      </span>
                                    </SocialButton>
                                  )
                                )}
                              </SocialButtonsContainer>
                            </div>
                            {isMobile && (
                              <DividerTextContainer>
                                <DividerText>
                                  Or Log In Using Username
                                </DividerText>
                              </DividerTextContainer>
                            )} */}
                            <div tw="w-full">
                              {firebaseErrors.others ? (
                                <ErrorMessage>
                                  {firebaseErrors.others}
                                </ErrorMessage>
                              ) : null}
                              <Form onSubmit={Loginformik.handleSubmit}>
                                {Loginformik.errors.loginUsername ? (
                                  <ErrorMessage>
                                    {Loginformik.errors.loginUsername}
                                  </ErrorMessage>
                                ) : null}
                                {firebaseErrors.username ? (
                                  <ErrorMessage>
                                    {firebaseErrors.username}
                                  </ErrorMessage>
                                ) : null}
                                <Input
                                  type="text"
                                  placeholder="Username"
                                  name="username"
                                  value={Loginformik.values.username}
                                  onChange={Loginformik.handleChange}
                                />
                                {Loginformik.errors.loginPassword ? (
                                  <ErrorMessage>
                                    {Loginformik.errors.loginPassword}
                                  </ErrorMessage>
                                ) : null}
                                <Input
                                  type="password"
                                  name="password"
                                  placeholder="Password"
                                  autoComplete="new-password"
                                  value={Loginformik.values.password}
                                  onChange={Loginformik.handleChange}
                                />
                                <SubmitButton
                                  type="submit"
                                  onClick={() =>
                                    (Loginformik.values.signup = 0)
                                  }
                                >
                                  <span className="text">Log In</span>
                                </SubmitButton>
                              </Form>
                            </div>
                          </FormContainer>
                        </div>
                      </div>
                      <div tw="mt-4 -mb-2 text-center text-xs">
                        By logging in you agree to our <a href="/terms-and-conditions">Terms and Conditions</a> and <a href="/policy">Privacy Policy</a>
                      </div>
                    </div>
                  </div>
                </ModalContent>
              </ModalContainer>
              <OutModal></OutModal>
            </>
          ) : null}
        </AnimationRevealPage>
      </Sidebar>
    </Sidebar>
  </div>);
};

const AdImages = () => {
  const ads = [
    {
      name: "Ad1",
      image: sampleImage,
	  url: "contest",
    },
    {
      name: "Ad2",
      image: sampleImage2,
	  url: "contest",
    },	
    {
      name: "Ad3",
      image: sampleImage3,
	  url: "contest",
    },
  ];
  return (
    <div>
      {ads.map((ad, index) => (
	  <a href={ad.url}>
        <img src={ad.image} alt={ad.name} key={`${index.toString()}_ad`}  tw="mb-5"/>
	  </a>
      ))}
    </div>
  );
};

export default Home;