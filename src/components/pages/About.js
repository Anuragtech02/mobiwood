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
import Styles from "../css/master.css";

const GridContent = tw.div` mx-auto pb-4`;
const ThreeColumn = tw.div`flex items-center flex-row flex-wrap`;
const Column = tw.div`flex mt-5 w-full sm:w-1/3 justify-center`;
const Card = tw.div`flex justify-center mx-2 py-2 border rounded-md w-full`;

const Container = tw.div`relative bg-purple-100 text-gray-900 font-medium flex flex-col justify-center mt-0 pb-5 overflow-hidden`;
const ContainerHeading = tw.div`px-4 pt-4 text-2xl font-semibold`;
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
                      .update(
                        { last_login_datetime: new Date() },
                        //{ merge: true }
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
		  <div className="leftNav">
		  
    <Sidebar
      sidebar={SideLinks}
      open={sidebarOpen}
      onSetOpen={onSetSidebarOpen}
      styles={ isBrowser ? { sidebar: { background: "#111", zIndex: 40 } } : { sidebar: { background: "#111", zIndex: 50 } }}
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
              <ContainerHeading tw="pl-8 pt-8 text-3xl">About Us</ContainerHeading>
              <Page tw="block pl-6 mt-4 px-5">
                <div class="underconstruction" tw="w-full">
                  <p>"Hide not your talents, they for use were made,
What's a sundial in the shade?"
- Benjamin Franklin. </p>

<p tw="pt-4">Talent is not something that should be kept under the veil. Your abilities deserve to be recognized by the world. All of us are passionate about one or the other thing and desire to turn our passion into something that is valued by the world. </p>

<p tw="mt-3">Mobiwood is a place where real talent is valued. If you have been looking for a platform to showcase your talent, Mobiwood is just the right place for you. We are calling artists from the whole world to exhibit their best and gain recognition for the same. </p>

<p tw="mt-3">You do not have to sit at home and wonder anymore. We assure you that your talent wont go in vain. </p>
                </div>
                <div tw="mt-6">
				<h3 tw="font-bold  mb-3">Our Vision</h3> 
<p>Our motto is to make artists believe in themselves. We are here to help them in gaining self-confidence and step outside their boundaries. We believe that without recognition talent is a barren field. We are happy to create a platform that is established worldwide. </p>

<h3 tw="mt-6 font-bold  mb-3">Our Mission</h3>
<p>We consider mobile as a stage and a platform is all that is required by an artist to express themselves. We appreciate real talent in the utmost possible way by helping people to gain recognition.</p>

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
  
  
  </div>
  );
};

export default About;