import React, { useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { navigate } from "hookrouter";
import AnimationRevealPage from "../../layouts/AnimationRevealPage";
import Nav from "../../layouts/NewNav";
import Footer from "../../layouts/Footer";
import { useFormik } from "formik";
import Video from "../../../videos/video.mp4";
import ReactPlayer from "react-player";
import Sidebar from "react-sidebar";
import { isBrowser, isMobile, isTablet } from "react-device-detect"; //eslint-disable-line
import { SideLinks, SideLinksShort } from "../../layouts/SideLinks";
import { auth, firestore } from "../../../firebase.config";
import { ReactComponent as CloseIcon } from "feather-icons/dist/icons/x.svg";
import googleIconImageSrc from "../../../images/google-icon.png";
import twitterIconImageSrc from "../../../images/twitter-icon.png";
import facebookIconImageSrc from "../../../images/facebook-icon.png";
import { ReactComponent as CircleCheckIcon } from "feather-icons/dist/icons/check.svg";
import "../../css/master.css";
import { v4 as uuidv4 } from "uuid";
import logo from "../../../images/logo_tm.png";
import { Button, CircularProgress } from "@material-ui/core";

const Container = tw.div`relative bg-purple-100 text-gray-900 font-medium flex flex-col justify-center mt-0 pb-5 overflow-hidden`;
const ContainerHeading = tw.div`px-4 sm:px-10 pt-4 text-2xl font-normal`;
const Content = tw.div`m-4 sm:m-8 mt-2 sm:mt-2 bg-purple-100 text-gray-900 flex justify-center flex-1 flex-col lg:flex-row`;
const MainContainer = tw.div`w-full lg:w-1/2 p-2 sm:p-6 lg:border-t-2`;
const MainFormContainer = tw.div`w-full flex-1 mt-2`;

const MainForm = tw.form`mx-auto`;
const InputContainer = tw.div`first:mt-0 mt-5 flex flex-col`;
const Label = tw.label`mb-1 text-sm font-semibold ml-1 text-gray-900`;
const MainInput = tw.input`w-full p-3 bg-white rounded-md font-medium border border-gray-500 text-sm focus:outline-none focus:border-gray-400`;
const Flex = tw.div`flex flex-col sm:flex-row`;
const FlexInputContainer = tw.div`w-full mt-5 first:mr-8 flex flex-col`;
const MainSubmitButton = styled.button`
  ${tw`w-20 mt-5 mx-auto text-sm bg-blue-700 text-gray-100 py-2 rounded-lg hover:bg-blue-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .text {
    ${tw``}
  }
`;

const ModalContainer = tw.div`justify-center items-center overflow-x-hidden fixed inset-0 z-50 outline-none focus:outline-none`;
const OutModal = tw.div`opacity-75 fixed inset-0 z-40 bg-black`;
const ModalContent = tw.div`relative w-auto my-auto mx-auto `;

const IllustrationContainer = tw.div`flex-1 border-t-2 flex justify-start lg:pl-0 sm:p-6`;
const IllustratorContent = tw.div`block relative`;

const RadioInput = tw.input`mr-2 mt-1`;
const ErrorMessage = tw.div`text-red-600 -mb-2 mt-1 text-xs`;
const RadioFlex = tw.div`flex`;

// const SocialButtonsContainer = tw.div`flex flex-col items-center`;
// const SocialButton = styled.a`
//   ${tw`w-full max-w-xs font-semibold cursor-pointer rounded py-2 border text-gray-100 hover:opacity-75 hocus:border-gray-400 flex items-center justify-center transition-all duration-300 focus:outline-none focus:shadow-outline text-sm mt-3 first:mt-0`}
//   .iconContainer {
//     ${tw`p-2 rounded-full`}
//   }
//   .icon {
//     ${tw`w-4`}
//   }
//   .text {
//     ${tw`ml-4`}
//   }
// `;

// const DividerTextContainer = tw.div`my-12 border-b text-center relative`;
// const DividerText = tw.div`leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform -translate-y-1/2 absolute inset-x-0 top-1/2 bg-transparent`;

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

const IllustrationHeading = tw.div`text-lg pt-4 font-semibold`;
const OL = tw.ul`pl-8 sm:pl-16 mt-4 list-disc font-light text-sm`;
const LI = tw.li`py-1`;

// const itemsRef = firebase.database().ref("user");

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

const validateLogin = (values) => {
  const errors = {};
  if (values.login) {
    if (!values.username) {
      errors.loginUsername = "Username is required";
    }

    if (!values.password) {
      errors.loginPassword = "Password is required";
    }
  }
  return errors;
};

const ContestRegister = ({
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

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      number: "",
      city: "",
      country: "",
      dob: "",
      gender: "default",
      pin: "",
    },
    validate,
    onSubmit: (values) => {
      var vid = uuidv4();
      localStorage.setItem("vid", vid);
      localStorage.setItem("register", values);
      var data = {
        name: values.name,
        username: values.username,
        email: values.email,
        number: values.number,
        city: values.city,
        country: values.country,
        dob: values.dob,
        gender: values.gender,
        pin: values.pin,
      };
      firestore
        .collection("user")
        .doc(auth.currentUser.uid)
        .collection("videos")
        .doc(vid)
        .set(data)
        .then(() => {
          if (underAge) {
            asyncLocalStorage.setItem("underage", "true");
            navigate("/contest/upload");
          } else {
            asyncLocalStorage.setItem("underage", "false");
            navigate("/contest/upload");
          }
        });
    },
  });

  const [underAge, setAge] = useState(false);
  function handleAgeChange(e) {
    if (e.target.value === "mt18") {
      setAge(false);
    } else {
      setAge(true);
    }
  }

  const [vw, setWidth] = useState(window.innerWidth);
  React.useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const heightFactor =
    vw >= 1024
      ? ((vw / 2 - 20) * 9) / 16
      : vw >= 640
      ? 0.051 * 9 * vw
      : 0.055 * 9 * vw;
  const widthFactor =
    vw >= 1024 ? vw / 2 - 20 : vw >= 640 ? 0.051 * 16 * vw : 0.055 * 16 * vw;

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

  const [termsModal, setTermsModal] = useState(false);
  function onClickTerms() {
    setTermsModal(true);
  }

  const [radioValue, setRadioValue] = useState("a18");

  function useOutsideAlerter(ref) {
    React.useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setSignupModal(false);
          setLoginModal(false);
          setTermsModal(false);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = React.useRef(null);
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
      // console.log("LOGGED IN: ", u.displayName);
      // console.log("LOGGED IN: ", u);
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
    validateLogin,
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

  React.useEffect(() => {
    localStorage.removeItem("underage");
    const sub = auth.onAuthStateChanged(handleAuthStateChange);
    return sub;
  }, []); //eslint-disable-line

  React.useEffect(() => {
    if (auth.currentUser) {
      firestore
        .collection("user")
        .doc(auth.currentUser.uid)
        .collection("videos")
        .get()
        .then(function (vidData) {
          if (vidData.docs.length > 0) {
            var vid = uuidv4();
            localStorage.setItem("vid", vid);
            localStorage.setItem("register", "true");
            navigate("/contest/upload");
          }
        });
    }
  });

  const [forgotPassModal, setForgotPassModal] = useState(false);
  const onClickForgotPass = () => {
    setForgotPassModal(true);
    setLoginModal(false);
  };
  const [progressBar, setProgressBar] = useState(false);
  const [regEmail, setRegEmail] = useState("");
  const [sentMessage, setSentMessage] = useState("");
  const handleForgotPassSubmit = (e) => {
    e.preventDefault();
    setProgressBar(true);
    return auth
      .sendPasswordResetEmail(regEmail)
      .then((res) => {
        setSentMessage(
          "An email with password reset link has been sent to the email."
        );
        setProgressBar(false);
      })
      .catch((e) => {
        sentMessage(e.message);
        setProgressBar(false);
      });
  };

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
            <Container>
              <ContainerHeading>Register for Contest</ContainerHeading>
              <Content>
                <IllustrationContainer>
                  <IllustratorContent tw="text-center">
                    <ReactPlayer
                      width={widthFactor}
                      height={heightFactor}
                      url={Video}
                      controls={true}
                      className="background-grey pt"
                    />
                    <br />
                    <span tw="font-bold sm:text-3xl">
                      Watch this video to know more about World Talent League
                    </span>
                  </IllustratorContent>
                </IllustrationContainer>
                <MainContainer>
                  <MainFormContainer>
                    {formik.errors.others ? (
                      <ErrorMessage tw="pb-10">
                        {formik.errors.others}
                      </ErrorMessage>
                    ) : null}
                    <MainForm onSubmit={formik.handleSubmit}>
                      <InputContainer>
                        <Label htmlFor="name">Name</Label>
                        <MainInput
                          type="text"
                          name="name"
                          onChange={formik.handleChange}
                          value={formik.values.name}
                        />
                        {formik.errors.name ? (
                          <ErrorMessage>{formik.errors.name}</ErrorMessage>
                        ) : null}
                      </InputContainer>
                      <Flex>
                        <FlexInputContainer>
                          <Label htmlFor="username">Username</Label>
                          <MainInput
                            type="text"
                            name="username"
                            onChange={formik.handleChange}
                            value={formik.values.username}
                          />
                          {formik.errors.username ? (
                            <ErrorMessage>
                              {formik.errors.username}
                            </ErrorMessage>
                          ) : null}
                        </FlexInputContainer>
                        <FlexInputContainer>
                          <Label htmlFor="email">Email</Label>
                          <MainInput
                            type="email"
                            name="email"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                          />
                          {formik.errors.email ? (
                            <ErrorMessage>{formik.errors.email}</ErrorMessage>
                          ) : null}
                        </FlexInputContainer>
                      </Flex>
                      <Flex>
                        <FlexInputContainer>
                          <Label htmlFor="number">Mobile</Label>
                          <MainInput
                            type="tel"
                            name="number"
                            onChange={formik.handleChange}
                            value={formik.values.number}
                          />
                          {formik.errors.number ? (
                            <ErrorMessage>{formik.errors.number}</ErrorMessage>
                          ) : null}
                        </FlexInputContainer>
                        <FlexInputContainer>
                          <Label htmlFor="dob">Date of Birth</Label>
                          <MainInput
                            type="date"
                            name="dob"
                            onChange={formik.handleChange}
                            value={formik.values.dob}
                          />
                          {formik.errors.dob ? (
                            <ErrorMessage>{formik.errors.dob}</ErrorMessage>
                          ) : null}
                        </FlexInputContainer>
                      </Flex>
                      <Flex>
                        <FlexInputContainer>
                          <Label htmlFor="gender">Gender</Label>
                          <select
                            type="date"
                            name="gender"
                            onChange={formik.handleChange}
                            value={formik.values.gender}
                            tw="w-full p-3 bg-white rounded-md font-medium border border-gray-500 text-sm focus:outline-none focus:border-gray-400"
                          >
                            <option disabled value="default">
                              Select One
                            </option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="others">Others</option>
                          </select>
                          {formik.errors.gender ? (
                            <ErrorMessage>{formik.errors.gender}</ErrorMessage>
                          ) : null}
                        </FlexInputContainer>
                        <FlexInputContainer>
                          <Label htmlFor="city">City</Label>
                          <MainInput
                            type="text"
                            name="city"
                            onChange={formik.handleChange}
                            value={formik.values.city}
                          />
                          {formik.errors.city ? (
                            <ErrorMessage>{formik.errors.city}</ErrorMessage>
                          ) : null}
                        </FlexInputContainer>
                      </Flex>
                      <Flex>
                        <FlexInputContainer>
                          <Label htmlFor="country">Country</Label>
                          <MainInput
                            type="text"
                            name="country"
                            onChange={formik.handleChange}
                            value={formik.values.country}
                          />
                          {formik.errors.country ? (
                            <ErrorMessage>{formik.errors.country}</ErrorMessage>
                          ) : null}
                        </FlexInputContainer>
                        <FlexInputContainer>
                          <Label htmlFor="pin">Pincode</Label>
                          <MainInput
                            type="number"
                            name="pin"
                            onChange={formik.handleChange}
                            value={formik.values.pin}
                          />
                          {formik.errors.pin ? (
                            <ErrorMessage>{formik.errors.pin}</ErrorMessage>
                          ) : null}
                        </FlexInputContainer>
                      </Flex>
                      <RadioFlex tw="mt-4">
                        <RadioInput
                          onClick={handleAgeChange}
                          type="radio"
                          name="ageconf"
                          value="mt18"
                          id="mt18"
                          defaultChecked
                        />
                        <Label htmlFor="mt18" tw="font-normal text-xs">
                          I am 18 years or above.
                        </Label>
                      </RadioFlex>
                      <RadioFlex tw="sm:flex-row">
                        <RadioInput
                          onClick={handleAgeChange}
                          type="radio"
                          name="ageconf"
                          value="lt18"
                          id="lt18"
                        />
                        <Label htmlFor="lt18" tw="font-normal text-xs">
                          I am below 18 years old.
                        </Label>
                      </RadioFlex>
                      <span tw="font-normal text-xs">
                        By registering, you agree to our{" "}
                        <span
                          onClick={onClickTerms}
                          tw="cursor-pointer text-blue-500 hover:text-black hover:underline transition duration-500"
                        >
                          <a href="/terms">Terms and Conditions</a>{" "}
                        </span>
                      </span>
                      <MainSubmitButton type="submit">
                        <span className="text">Next</span>
                      </MainSubmitButton>
                    </MainForm>
                  </MainFormContainer>
                </MainContainer>
              </Content>
            </Container>
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
                      <div tw="relative p-6 pt-4 flex-auto">
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
                          By logging in you agree to our{" "}
                          <a href="/terms-and-conditions">
                            Terms and Conditions
                          </a>{" "}
                          and <a href="/policy">Privacy Policy</a>
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
                                  <div className="align-center-items">
                                    <Button
                                      variant="text"
                                      onClick={onClickForgotPass}
                                      style={{
                                        textTransform: "capitalize",
                                        border: "none",
                                        outline: "none",
                                      }}
                                    >
                                      Forgot Password
                                    </Button>
                                  </div>
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
            {forgotPassModal ? (
              <>
                <ModalContainer>
                  <ModalContent ref={wrapperRef}>
                    <div tw="border-0 shadow-lg  h-screen relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/*header*/}
                      <div tw="flex items-start justify-between py-3 px-5 rounded-t">
                        <button
                          onClick={() => setForgotPassModal(false)}
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
                              <div tw="w-full">
                                <a href="/" class="login-logo">
                                  <img src={logo} alt="logo" />
                                </a>
                                <h3 tw="text-xl font-semibold text-center mb-4 pt-4">
                                  Enter your registered Email
                                </h3>
                                <Form onSubmit={handleForgotPassSubmit}>
                                  <Input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="Email"
                                    value={regEmail}
                                    onChange={(e) =>
                                      setRegEmail(e.target.value)
                                    }
                                  />
                                  <SubmitButton type="submit">
                                    <span className="text">Submit</span>
                                  </SubmitButton>
                                  <div
                                    className="align-center-items"
                                    style={{
                                      textAlign: "center",
                                      fontSize: "0.9rem",
                                      color: "green",
                                    }}
                                  >
                                    {sentMessage.length ? (
                                      <h5>{sentMessage}</h5>
                                    ) : null}
                                  </div>
                                  {progressBar && (
                                    <div className="align-center-items">
                                      <CircularProgress variant="indeterminate" />
                                    </div>
                                  )}
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
            {termsModal ? (
              <>
                <ModalContainer>
                  <ModalContent ref={wrapperRef}>
                    <div tw="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                      {/*header*/}
                      <div tw="flex items-start justify-between py-3 px-5 border-b border-solid border-gray-300 rounded-t">
                        <h3 tw="text-xl font-semibold">
                          Terms {"&"} Conditions
                        </h3>
                        <button
                          onClick={() => setTermsModal(false)}
                          tw="p-1 ml-auto bg-transparent opacity-75 border-0 text-black float-right text-xl leading-none font-semibold outline-none focus:outline-none"
                        >
                          <CloseIcon tw="cursor-pointer text-black h-5 w-6 text-xl block outline-none focus:outline-none" />
                        </button>
                      </div>
                      {/*body*/}
                      <div tw="relative p-6 pt-4 flex-auto">
                        <div tw="text-gray-600 max-w-lg text-lg leading-relaxed">
                          <div tw="w-full">
                            <IllustrationHeading>
                              Rules for the video
                            </IllustrationHeading>
                            <OL>
                              <LI>
                                The video can be of a maximum duration of 90
                                seconds
                              </LI>
                              <LI>
                                The video must have original content and must
                                not include any copy-write content
                              </LI>
                              <LI>
                                The video must be self-shot or indicate the
                                participant’s presence
                              </LI>
                              <LI>
                                The video must be centered only on humans and
                                any other living or non-living thing can just be
                                used as supporting assets
                              </LI>
                              <LI>
                                Previously shot videos can be used after
                                removing any other platform’s watermark(if
                                exists)
                              </LI>
                              <LI>
                                Any harm to animals is strictly prohibited
                              </LI>
                              <LI>Environmental harm is strictly prohibited</LI>
                            </OL>
                            <IllustrationHeading>
                              Rules for the contest
                            </IllustrationHeading>
                            <OL>
                              <LI>
                                By entering the competition entrants warrant
                                that all information submitted by them is true,
                                current, and complete.
                              </LI>
                              <LI>
                                Multiple entries from a single participant are
                                allowed for each round 80% of participants from
                                a particular round will go to the further rounds
                              </LI>
                              <LI>
                                Only G-rated content is allowed (R rated content
                                is strictly prohibited)
                              </LI>
                              <LI>
                                Participants under 18 years of age must fill
                                this parent consent form
                              </LI>
                              <LI>
                                All rights are reserved by the T{"&"}C of WTL
                                and any breach of the above rules will result in
                                the debarment of the participant from the
                                contest
                              </LI>
                              <LI>
                                Entries submitted through agents or third
                                parties or in bulk (i.e. more entries than a
                                human being could submit in the time available
                                without the use of software or other devices
                                designed to make automated entries or, in the
                                case of postal entries, more than one entry
                                submitted under the same postage stamp) will not
                                be accepted.
                              </LI>
                              <LI>
                                Mobiwood holds all the rights for changing the
                                rules, rejecting the videos or disqualifying any
                                participants
                              </LI>
                              <LI>
                                The participants will be informed via email for
                                the same.
                              </LI>
                              <LI> All rights reserved with Mobiwood.</LI>
                            </OL>
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

export default ContestRegister;
