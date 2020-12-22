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
import logo from "../../images/logo_tm.png";
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
import { Button, CircularProgress } from "@material-ui/core";

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

const ModalContainer = tw.div`justify-center items-center overflow-x-hidden fixed inset-0 z-50 outline-none focus:outline-none`;
const OutModal = tw.div`opacity-75 fixed inset-0 z-40 bg-black`;
const ModalContent = tw.div`relative w-auto my-auto mx-auto `;

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
                    firestore.collection("user").doc(details.data().uid).update(
                      { last_login_datetime: new Date() }
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
            ? { sidebar: { background: "#111", zIndex: 50 } }
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
                <ContainerHeading tw="pl-8 pt-8 text-3xl">
                  Terms of Service
                </ContainerHeading>
                <Page tw="block pl-6 mt-4 px-5">
                  <div tw="w-full pl-2 text-justify">
                    <p>
                      MobiWood is an entertainment next generation Website and
                      Mobile app (Android and IOS both) to entertain and
                      organise various talent shows for people across the globe.
                      And Website/App will entertain people by Videos, Live
                      sessions created by Content creators, purchased from
                      market or by hired Content creators. MobiWood will be a
                      platform for jobs seekers in entertainment/media industry
                      and will be creating more business opportunities for
                      vendors/suppliers related to entertainment/media industry
                      across the globe.
                    </p>
                    <p>&nbsp;</p>
                    <p>
                      By using our Products, you agree that we can show you ads
                      that we think will be relevant to you and your interests.
                      We use your personal data to help determine which ads to
                      show you.  We don't sell any personal data to advertisers,
                      and we don't share information that directly identifies
                      you (such as your name, email address or other contact
                      information) with advertisers unless you give us specific
                      permission. Instead, advertisers can tell us things such
                      as the kind of audience that they want to see their ads,
                      and we show those ads to people who may be interested. We
                      provide advertisers with reports about the performance of
                      their ads that help them understand how people are
                      interacting with their content. See Section 2 below to
                      learn more.<strong> </strong>
                    </p>

                    <h2 tw="font-bold text-lg my-4">Term of Use</h2>
                    <h3 tw="font-bold text-base my-4">
                      1. Relationship with MobiWood
                    </h3>
                    <p>
                      Welcome to <strong>MobiWood</strong> (the “Platform”),
                      which is provided by Samaira Web Solutions Pvt Ltd,
                      Address - Assotech Business Cresterra, Upper Ground, Tower
                      2. Plot No 22, Sector 135, Noida - Uttar Pradesh - 201301
                      (collectively such entities will be referred to as “
                      <strong>MobiWood</strong>”, “we” or “us”).
                    </p>
                    <p>
                      You are reading the terms of service (the “Terms”), which
                      govern the relationship and serve as an agreement between
                      you and us and set forth the terms and conditions by which
                      you may access and use the Platform and our related
                      websites, services, applications, products and content
                      (collectively, the “Services”). Access to certain Services
                      or features of the Services (such as, by way of example
                      and not limitation, the ability to submit or share User
                      Content (defined below)) may be subject to age
                      restrictions and not available to all users of the
                      Services. Our Services are provided for private,
                      non-commercial use. For purposes of these Terms, “you” and
                      “your” means you as the user of the Services.
                    </p>
                    <p>
                      The Terms form a legally binding agreement between you and
                      us. Please take the time to read them carefully. If you
                      are under age 18, you may only use the Services with the
                      consent of your parent or legal guardian. Please be sure
                      your parent or legal guardian has reviewed and discussed
                      these Terms with you.
                    </p>
                    <h3 tw="font-bold text-base my-4">
                      2. Accepting the Terms
                    </h3>
                    <p>
                      By accessing or using our Services, you confirm that you
                      can form a binding contract with MobiWood, that you accept
                      these Terms and that you agree to comply with them. Your
                      access to and use of our Services is also subject to our
                      Privacy Policy and Community Policy, the terms of which
                      can be found directly on the Platform, or where the
                      Platform is made available for download, on your mobile
                      device’s applicable app store, and are incorporated herein
                      by reference. By using the Services, you consent to the
                      terms of the Privacy Policy.
                    </p>
                    <p>
                      If you are accessing or using the Services on behalf of a
                      business or entity, then (a) “you” and “your” includes you
                      and that business or entity, (b) you represent and warrant
                      that you are an authorized representative of the business
                      or entity with the authority to bind the entity to these
                      Terms, and that you agree to these Terms on the entity’s
                      behalf, and (c) your business or entity is legally and
                      financially responsible for your access or use of the
                      Services as well as for the access or use of your account
                      by others affiliated with your entity, including any
                      employees, agents or contractors.
                    </p>
                    <p>
                      You can accept the Terms by accessing or using our
                      Services. You understand and agree that we will treat your
                      access or use of the Services as acceptance of the Terms
                      from that point onwards.’
                    </p>
                    <h3 tw="font-bold text-base my-4">
                      3. Amendments/Changes in terms
                    </h3>
                    <p>
                      We keep amending these terms from time to time and to
                      comply with all the legal formalities and regulations and
                      will use commercially reasonable efforts to generally
                      notify all users of any material changes to these terms,
                      however the user should keep visiting any changes in these
                      terms regularly.  Your continued access or use of the
                      Services after the date of the new Terms constitutes your
                      acceptance of the new Terms. If you do not agree to the
                      new Terms, you must stop accessing or using the Services.{" "}
                    </p>
                    <h3 tw="font-bold text-base my-4">4. Account Creation</h3>
                    <p>
                      To access or use our Services, you must create an account
                      with us. When you create this account, you must provide
                      accurate and up-to-date information. It is important that
                      you maintain and promptly update your details and any
                      other information you provide to us, to keep such
                      information current and complete.
                    </p>
                    <p>
                      You agree that you are solely responsible (to us and to
                      others) for the activity that occurs under your account.
                    </p>
                    <p>
                      We reserve the right to disable your user account at any
                      time, including if you have failed to comply with any of
                      the provisions of these Terms.
                    </p>
                    <h3 tw="font-bold text-base my-4">
                      5. Your Access to and Use of Our Services
                    </h3>
                    <p>
                      Your access to and use of the Services is subject to these
                      Terms and all applicable laws and regulations.{" "}
                    </p>
                    <p tw="mt-3">You shall not use our platform:</p>
                    <ul class="bullets">
                      <li>
                        if you are not fully able and legally competent to agree
                        to these Terms or are authorized to use the Services by
                        your parent or legal guardian;
                      </li>
                      <li>
                        to make unauthorised copies, modify, adapt, translate,
                        reverse engineer, disassemble, decompile or create any
                        derivative works of the Services to distribute, license,
                        transfer, or sell, in whole or in part, any of the
                        Services.
                      </li>
                      <li>
                        without our express written consent, for any commercial
                        or unauthorized purpose, including communicating or
                        facilitating any commercial advertisement or
                        solicitation or spamming;
                      </li>
                      <li>
                        to upload, transmit, distribute, store or otherwise make
                        available in any way: files that contain viruses,
                        trojans, worms, logic bombs or other material that is
                        malicious or technologically harmful;
                      </li>
                      <li>
                        any material which does or may infringe any copyright,
                        trademark or other intellectual property or privacy
                        rights of any other person;
                      </li>
                      <li>
                        any material that is racist or discriminatory, including
                        discrimination on the basis of someone’s race, religion,
                        age, gender, disability or sexuality;
                      </li>
                      <li>
                        any material that contains a threat of any kind,
                        including threats of physical violence;
                      </li>
                    </ul>
                    <p tw="mt-3">
                      We reserve the right, at any time and without prior
                      notice, to remove or disable access to content at our
                      discretion for any reason or no reason.{" "}
                    </p>
                  </div>
                </Page>
              </Container>

              {}
            </OutNav>
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
          </AnimationRevealPage>
        </Sidebar>
      </Sidebar>
    </div>
  );
};

export default About;
