import React, { useState, useEffect, useRef } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { navigate } from "hookrouter";
import AnimationRevealPage from "../layouts/AnimationRevealPage";
import Nav from "../layouts/NewNav";
import Footer from "../layouts/Footer";
import { useFormik } from "formik";
import Video from "../../videos/video.mp4";
import ReactPlayer from "react-player";
import Sidebar from "react-sidebar";
import { isBrowser, isMobile, isTablet } from "react-device-detect"; //eslint-disable-line
import { SideLinks, SideLinksShort } from "../layouts/SideLinks";
import { auth, firestore } from "../../firebase.config";
import { ReactComponent as CloseIcon } from "feather-icons/dist/icons/x.svg";
import googleIconImageSrc from "../../images/google-icon.png";
import twitterIconImageSrc from "../../images/twitter-icon.png";
import facebookIconImageSrc from "../../images/facebook-icon.png";
import { ReactComponent as CircleCheckIcon } from "feather-icons/dist/icons/check.svg";
import "../css/master.css";

const Container = tw.div`relative bg-purple-100 text-gray-900 font-medium flex flex-col justify-center mt-0 pb-5 overflow-hidden`;
const ContainerHeading = tw.div`px-4 sm:px-10 pt-4 text-2xl font-normal`;
const Content = tw.div`m-4 sm:m-8 mt-2 sm:mt-2 bg-purple-100 text-gray-900 flex justify-center flex-1 flex-col lg:flex-row`;

const MainSubmitButton = styled.button`
  ${tw`w-20 mt-5 mx-auto text-sm bg-blue-700 text-gray-100 py-2 rounded-lg hover:bg-blue-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .text {
    ${tw``}
  }
`;

const FormContainer = tw.div`w-full flex flex-col sm:flex-row`;

const Page = tw.div`flex justify-center min-h-screen mx-2 py-2 `;
const OutNav = tw.div`font-display text-secondary-500 block overflow-hidden`;

const Form = tw.form`mx-auto max-w-xs`;
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

const ModalContainer = tw.div`justify-center m-4 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none`;
const OutModal = tw.div`opacity-75 fixed inset-0 z-40 bg-black`;
const ModalContent = tw.div`relative w-auto my-auto mx-auto max-w-3xl`;

const ErrorMessage = tw.div`text-red-600 -mb-2 mt-3`;

const validate = (values) => {
  const errors = {};
  if (!values.signup && !values.login) {
    if (!auth.currentUser) {
      errors.others = "You need to login or signup first";
    }

    if (!values.name) {
      errors.name = "Name Required";
    }

    if (!values.username) {
      errors.username = "Username Required";
    } else if (values.username !== localStorage.getItem("username")) {
      errors.username = "Use the username used to sign in";
    }

    if (!values.email) {
      errors.email = "Email Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!values.dob) {
      errors.dob = "Date of Birth Required";
    }

    if (!values.gender) {
      errors.gender = "Gender Required";
    }

    if (!values.number) {
      errors.number = "Phone Number Required";
    } else if (!values.number.match(/^\d{10}$/)) {
      errors.number = "Invalid Phone Number. 10 Digits Required";
    }

    if (!values.city) {
      errors.city = "City Required";
    }

    if (!values.country) {
      errors.country = "Country Required";
    }

    if (!values.pin) {
      errors.pin = "Pin Required";
    }
  } else if (values.signup) {
    if (!values.name) {
      errors.name = "Name Required";
    }

    if (!values.email) {
      errors.email = "Email Required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
    ) {
      errors.email = "Invalid email address";
    }

    if (!values.username) {
      errors.username = "Username is required";
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
      errors.password = "Password is required";
    }
  } else if (values.login) {
    if (!values.username) {
      errors.loginUsername = "Username is required";
    }

    if (!values.password) {
      errors.loginPassword = "Password is required";
    }
  }
  return errors;
};

const About = ({
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

  const Signupformik = useFormik({
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
                      .update(
                        { last_login_datetime: new Date() },
                        { merge: true }
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

  return (
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
          <OutNav>
            <Container>
              <ContainerHeading>Register for Contest</ContainerHeading>
              <Page tw="block text-center mt-8">
                <h1 class="underconstruction" tw="w-full">
                  This page is Under Construction, Please check back soon
                </h1>
                <div>
                  <a href="/" class="backtohome">
                    Back to Home
                  </a>
                </div>
              </Page>
            </Container>

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
          </OutNav>
          <Footer />

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
                    <div tw="relative p-6 sm:p-10 flex-auto">
                      <div tw="text-gray-600 max-w-lg text-lg leading-relaxed">
                        <div tw="w-full">
                          <FormContainer>
                            {/* <div tw="w-full sm:w-1/2 sm:pr-4 mb-1">
                              <SocialButtonsContainer>
                                {socialButtons.map((socialButton, index) => (
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
                                ))}
                              </SocialButtonsContainer>
                            </div>
                            {isMobile && !isTablet && (
                              <DividerTextContainer>
                                <DividerText>Or Sign Up Using Mail</DividerText>
                              </DividerTextContainer>
                            )} */}
                            <div tw="w-full sm:pl-4">
                              {firebaseErrors.others ? (
                                <ErrorMessage>
                                  {firebaseErrors.others}
                                </ErrorMessage>
                              ) : null}
                              <Form onSubmit={Signupformik.handleSubmit}>
                                <div tw="flex flex-col">
                                  <label tw="mb-1 cursor-pointer rounded p-2 bg-gray-300 text-gray-900 text-center font-semibold text-sm">
                                    <input
                                      type="radio"
                                      name="age"
                                      tw="invisible"
                                      value="b18"
                                      onClick={() => setRadioValue("b18")}
                                    />
                                    Below 18 Years
                                  </label>
                                  {radioValue === "b18" && (
                                    <CircleCheckIcon tw="h-5 w-5 p-1 -mt-3 mx-auto bg-green-700 rounded-full text-white" />
                                  )}
                                  <label tw="mt-1 p-2 cursor-pointer rounded bg-black text-white text-center font-semibold text-sm">
                                    <input
                                      type="radio"
                                      name="age"
                                      tw="invisible"
                                      value="a18"
                                      onClick={() => setRadioValue("a18")}
                                    />
                                    Above 18 Years
                                  </label>
                                  {radioValue === "a18" && (
                                    <CircleCheckIcon tw="h-5 w-5 p-1 -mt-3 mx-auto bg-green-700 rounded-full text-white" />
                                  )}
                                </div>
                                {Signupformik.errors.name ? (
                                  <ErrorMessage>
                                    {Signupformik.errors.name}
                                  </ErrorMessage>
                                ) : null}
                                <Input
                                  type="text"
                                  placeholder="Name"
                                  name="name"
                                  autoComplete="name"
                                  onChange={Signupformik.handleChange}
                                  value={Signupformik.values.name}
                                />
                                {Signupformik.errors.email ? (
                                  <ErrorMessage>
                                    {Signupformik.errors.email}
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
                                  onChange={Signupformik.handleChange}
                                  value={Signupformik.values.email}
                                />
                                {Signupformik.errors.username ? (
                                  <ErrorMessage>
                                    {Signupformik.errors.username}
                                  </ErrorMessage>
                                ) : null}
                                <Input
                                  type="text"
                                  placeholder="Username"
                                  name="username"
                                  onChange={Signupformik.handleChange}
                                  value={Signupformik.values.username}
                                />
                                {Signupformik.errors.password ? (
                                  <ErrorMessage>
                                    {Signupformik.errors.password}
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
                                  onChange={Signupformik.handleChange}
                                  value={Signupformik.values.password}
                                />
                                <SubmitButton
                                  type="submit"
                                  onClick={() => {
                                    Signupformik.values.signup = 1;
                                    Loginformik.values.login = 0;
                                  }}
                                >
                                  <span className="text">Create Account</span>
                                </SubmitButton>
                              </Form>
                            </div>
                          </FormContainer>
                        </div>
                      </div>
                      <div tw="mt-4 -mb-2 text-center text-xs">
                        By logging in you agree to our Terms and Conditions and
                        Privacy Policy
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
                    <div tw="relative p-6 sm:p-10 flex-auto">
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
                            {isMobile && !isTablet && (
                              <DividerTextContainer>
                                <DividerText>
                                  Or Log In Using Username
                                </DividerText>
                              </DividerTextContainer>
                            )} */}
                            <div tw="w-full sm:pl-4">
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
                                  onClick={() => {
                                    Signupformik.values.signup = 0;
                                    Loginformik.values.login = 1;
                                  }}
                                >
                                  <span className="text">Log In</span>
                                </SubmitButton>
                              </Form>
                            </div>
                          </FormContainer>
                        </div>
                      </div>
                      <div tw="mt-4 -mb-2 text-center text-xs">
                        By logging in you agree to our Terms and Conditions and
                        Privacy Policy
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
  );
};

export default About;
