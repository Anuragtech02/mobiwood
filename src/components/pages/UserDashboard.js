import React, { useState, useEffect, useRef, useContext } from "react";
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
import googleIconImageSrc from "../../images/google-icon.png";
import twitterIconImageSrc from "../../images/twitter-icon.png";
import facebookIconImageSrc from "../../images/facebook-icon.png";
import Footer from "../layouts/Footer";
import { css } from "styled-components/macro"; //eslint-disable-line
import { ReactComponent as CloseIcon } from "feather-icons/dist/icons/x.svg";
import { ReactComponent as CircleCheckIcon } from "feather-icons/dist/icons/check.svg";
import { useFormik } from "formik";
import ImageGrid from "../layouts/ImageGrid";
import { UserContext } from "../../contexts/UserContext";

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

const ModalContainer = tw.div`justify-center items-center overflow-x-hidden fixed inset-0 z-50 outline-none focus:outline-none`;
const OutModal = tw.div`opacity-75 fixed inset-0 z-40 bg-black mx-auto`;
const ModalContent = tw.div`relative w-auto my-auto mx-auto `;

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

const UserDashboard = ({
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

  const { myVideos, followers, following } = useContext(UserContext);
  // const [myVideos, setMyVideos] = useState([]);

  // useEffect(() => {
  //   if (userDetails.videos) {
  //     const videos = userDetails.videos;
  //     console.log(userDetails);
  //     const myVids = videos.forEach((vid) => {
  //       if (vid.videoUrl) return vid;
  //     });
  //     setMyVideos([...myVideos, myVids]);
  //   }
  // }, [userDetails, myVideos]);

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
                  likedVideos: [],
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
                    firestore.collection("user").doc(details.data().uid).update(
                      { last_login_datetime: new Date() }
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

  // if (!auth.currentUser) {
  //   navigate("/");
  // }

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
              {auth.currentUser ? (
                <>
                  <LeftContent tw="lg:p-4">
                    <ProfileInfo>
                      <ProfileLeft>
                        <ProfileImage
                          imageSrc={
                            "https://cdn2.iconfinder.com/data/icons/user-interface-solid-6/64/User_Interface_Glyph-01-512.png"
                          }
                        />
                        <OtherInfo>
                          <ProfileName>
                            {auth.currentUser.displayName}
                          </ProfileName>
                          <Location>
                            <span tw="mr-5">
                              <strong>
                                {myVideos.length ? myVideos.length : 0}
                              </strong>{" "}
                              Post <span>{myVideos.length > 1 ? "s" : ""}</span>
                            </span>{" "}
                            <span tw="mr-5">
                              <strong>{followers.length}</strong> Followers
                            </span>{" "}
                            <span>
                              <strong>{following.length}</strong> Following
                            </span>
                          </Location>
                        </OtherInfo>
                      </ProfileLeft>
                      <ProfileRight>
                        <Button tw="bg-gray-600">Edit</Button>{" "}
                        <Button>Follow</Button>
                      </ProfileRight>
                    </ProfileInfo>
                  </LeftContent>

                  <div tw="clear-both"></div>
                  <div class="profile-grid">
                    {myVideos.length ? (
                      <ImageGrid videosLimited={myVideos} />
                    ) : (
                      <p>Seems like you haven't uploaded any video yet!</p>
                    )}
                  </div>
                </>
              ) : (
                <div
                  style={{
                    height: "60vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p>Please Login to view this page!</p>
                </div>
              )}
            </Content>

            <Footer />
            {signupModal ? (
              <>
                <ModalContainer>
                  <ModalContent ref={wrapperRef}>
                    <div tw="border-0 shadow-lg  relative flex flex-col w-full bg-white outline-none focus:outline-none h-screen table">
                      {/*header*/}
                      <div tw="flex items-start justify-between py-3 px-5 rounded-t">
                        <button
                          onClick={() => setSignupModal(false)}
                          tw="p-1 ml-auto bg-transparent opacity-75 border-0 text-black float-right text-xl leading-none font-semibold outline-none focus:outline-none"
                        >
                          <CloseIcon tw="cursor-pointer text-black h-5 w-6 text-xl block outline-none focus:outline-none" />
                        </button>
                      </div>
                      {/*body*/}
                      <div tw="relative p-6 pt-0 flex-auto">
                        <div tw="text-gray-600 max-w-lg text-lg leading-relaxed m-auto">
                          <div tw="w-full">
                            <a href="/" class="create-account-logo">
                              <img src={logo} alt="logo" />
                            </a>
                            <h3 tw="text-xl font-semibold mb-4 text-center">
                              Create New Account
                            </h3>

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
                                          tw="invisible w-0"
                                          value="b18"
                                          onClick={() => setRadioValue("b18")}
                                        />
                                        Below 18 Years
                                      </label>
                                    </div>
                                    {radioValue === "b18" && (
                                      <span class="b18-circle">
                                        <CircleCheckIcon tw="h-5 w-5 p-1 -mt-3 mx-auto bg-green-700 rounded-full text-white" />
                                      </span>
                                    )}
                                    <div class="age-btns-a18">
                                      <label tw="p-2 cursor-pointer rounded block bg-black text-white text-center font-semibold text-sm">
                                        <input
                                          type="radio"
                                          name="age"
                                          tw="invisible w-0"
                                          value="a18"
                                          onClick={() => setRadioValue("a18")}
                                        />
                                        Above 18 Years
                                      </label>
                                    </div>
                                    {radioValue === "a18" && (
                                      <span class="a18-circle">
                                        <CircleCheckIcon tw="h-5 w-5 p-1 -mt-3 mx-auto bg-green-700 rounded-full text-white" />
                                      </span>
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
                          By creating an account you are agree to our{" "}
                          <a href="/terms-and-conditions">
                            <u>Terms</u>
                          </a>{" "}
                          and{" "}
                          <a href="/policy">
                            <u>Privacy</u>
                          </a>
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
                    <div tw="border-0 shadow-lg  h-screen relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/*header*/}
                      <div tw="flex items-start justify-between py-3 px-5 rounded-t">
                        <button
                          onClick={() => setLoginModal(false)}
                          tw="p-1 ml-auto bg-transparent opacity-75 border-0 text-black float-right text-2xl leading-none font-semibold outline-none focus:outline-none"
                        >
                          <CloseIcon tw="cursor-pointer text-black h-10 w-8 text-2xl block outline-none focus:outline-none" />
                        </button>
                      </div>
                      {/*body*/}
                      <div tw="relative p-6 flex-auto">
                        <div tw="text-gray-600 max-w-lg text-lg leading-relaxed m-auto">
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
                                <a href="/" class="login-logo">
                                  <img src={logo} alt="logo" />
                                </a>
                                <h3 tw="text-xl font-semibold text-center mb-4 pt-4">
                                  Log In to Your Account
                                </h3>
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
    </div>
  );
};

export default UserDashboard;
