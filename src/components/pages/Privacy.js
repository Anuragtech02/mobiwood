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
      styles={
        isBrowser
          ? { sidebar: { background: "#111", zIndex: 50  } }
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
              <ContainerHeading tw="pl-8 pt-8 text-3xl">Privacy Policy</ContainerHeading>
              <Page tw="block pl-6 mt-4 px-5">
                <div  tw="w-full pl-2 text-justify">
                  
<p>We collect information when you create an account and  use the Platform. We also collect information you share with us from  third-party social network providers, and technical and behavioral information  about your use of the Platform. We may receive the information described in  this Privacy Policy from other sources, such as:</p>
<p tw="my-4">Social Media: If you choose to link or sign up using  your social media.</p>
<p tw="my-4">Third-Party Services: We may collect information about  you from third-party services, such as advertising partners and analytics  providers.</p>
<p tw="my-4">Others Users of the Platform: Sometimes other users of  the Platform may provide us information about you, including through customer  service inquiries. </p>
<p tw="my-4">Other Sources: We may collect information about you  from other publicly available sources. </p>
<p>We don't sell any of your information to anyone, and  we never will. We also impose strict restrictions on how our partners can use  and disclose the data we provide.  However,  you may access other Third Party Services through the Services, for example by  clicking on links to those Third Party Services from within our Services. We  are not responsible for the privacy policies and/or practices of these Third  Party Services, and you are responsible for reading and understanding those  Third Party Services' privacy policies. This Privacy Policy only governs  information collected on the Services.</p>
<h2 tw="font-bold text-lg my-4">Intellectual  Property Rights</h2>
<p>We respect intellectual property rights and ask you to  do the same. As a condition of your access to and use of the Services, you  agree to the terms of the IPR policies.</p>
<h2 tw="font-bold text-lg my-4">1. Content  Creators</h2>
<ol class="abullets">
  <li>
<h3 tw="font-bold text-base my-4">a. MobiWood  Content</h3>
<p>As between  you and MobiWood, all content, software, images, text, graphics, illustrations,  logos, patents, trademarks, service marks, copyrights, photographs, audio,  videos, music on and “look and feel” of the Services, and all intellectual  property rights related thereto (the “MobiWood Content”), are either owned or  licensed by MobiWood, it being understood that you or your licensors will own  any User Content (as defined below) you upload or transmit through the  Services. Use of the MobiWood Content or materials on the Services for any  purpose not expressly permitted by these Terms is strictly prohibited. Such  content may not be downloaded, copied, reproduced, distributed, transmitted,  broadcast, displayed, sold, licensed or otherwise exploited for any purpose  whatsoever without our or, where applicable, our licensors’ prior written  consent. We and our licensors reserve all rights not expressly granted in and  to their content.</p>
</li>
<li>
<h3 tw="font-bold text-base my-4">b. Content  Creator</h3>
<ul class="bullets">
  <li>MobiWood  will not allow/promote any unauthorized copyright content;</li>

  <li>User  can use copyright free content and/or authorized copyright content;</li>

  <li>User  will be sole responsible for issues arising by uploading and/or posting any  content; and any issue arising out of the content MobiWood will not be  responsible for the same;</li>

  <li>Content  creators will be paid as per the contest or as per the commercials decided by  the company.</li>
</ul>
</li>
<li>
<h3 tw="font-bold text-base my-4">c. Waiver  of Rights</h3>
<p>By posting User  Content to or through the Services, you waive any rights to prior inspection or  approval of any marketing or promotional materials related to such User Content.  You also waive any and all rights of privacy, publicity, or any other rights of  a similar nature in connection with your User Content, or any portion thereof.  To the extent any moral rights are not transferable or assignable, you hereby  waive and agree never to assert any and all moral rights, or to support,  maintain or permit any action based on any moral rights that you may have in or  with respect to any User Content you Post to or through the Services.</p>
</li>
</ol>
<h2 tw="font-bold text-lg my-4">2. Indemnity</h2>
<p>You agree to defend, indemnify, and hold harmless MobiWood,  its parents, subsidiaries, and affiliates, and each of their respective  officers, directors, employees, agents and advisors from any and all claims,  liabilities, costs, and expenses, including, but not limited to, attorneys’  fees and expenses, arising out of a breach by you or any user of your account  of these Terms or arising out of a breach of your obligations, representation  and warranties under these Terms.</p>
<ol>

<li>
<h2 tw="font-bold text-lg my-4">3. Limitation  of Liability</h2>
<p tw="my-4">MobiWood shall not be liable to you for:</p>
<ul class="abullets">
  <li>(i) any loss of profit (whether incurred directly or  indirectly);</li>
  <li>(ii) any loss of goodwill;</li>
  <li>(iii) any loss of opportunity;</li>
  <li>(iv) any loss of data suffered by you; or</li>
  <li>(v) any indirect or consequential losses which may be  incurred by you. Any other loss will be limited to the amount paid by you to MobiWood  within the last 6 months.</li>
</ul>
</li>
<li>
<h2 tw="font-bold text-lg my-4">4. Exclusion  of Warranties</h2>
<p>Nothing in these terms shall affect any statutory  rights that you cannot contractually agree to alter or waive and are legally  always entitled to as a consumer. The  services are provided “as is” and we make no warranty or representation to you  with respect to them.</p>
</li>
<li>
<h2 tw="font-bold text-lg my-4">5. Arbitration</h2>
<p>This Section includes an arbitration agreement and an  agreement that all claims will be brought only in an individual capacity (and  not as a class action or other representative proceeding). Please read it  carefully. You may opt out of the arbitration agreement by following the opt  out procedure described below.</p>
<p>&nbsp;</p>
<p><strong tw="my-4">Informal Process First</strong>. You agree that in the event of any dispute between  you and MobiWood, you will first contact MobiWood and make a good faith  sustained effort to resolve the dispute before resorting to more formal means  of resolution, including without limitation any court action.</p>
<p>Arbitration Agreement. After the informal dispute  resolution process any remaining dispute, controversy, or claim (collectively,  “Claim”) relating in any way to your use of MobiWood’s services and/or  products, including the Services, or relating in any way to the communications  between you and MobiWood or any other user of the Services, will be finally  resolved by binding arbitration. This mandatory arbitration agreement applies  equally to you and MobiWood. However, this arbitration agreement does not (a)  govern any Claim by MobiWood for infringement of its intellectual property or  access to the Services that is unauthorized or exceeds authorization granted in  these Terms or (b) bar you from making use of applicable small claims court  procedures in appropriate cases. If you are an individual you may opt out of  this arbitration agreement within thirty (30) days of the first of the date you  access or use this Services.</p>
<p>&nbsp;</p>
<p>If you wish to begin an arbitration proceeding, after  following the informal dispute resolution procedure, you must send a letter  requesting arbitration and describing your claim to:</p>
<p>&nbsp;</p>
<p>Samaira Web Solutions Pvt Ltd</p>
<p>Address - Assotech Business Cresterra, Upper Ground, Tower 2. Plot No 22, Sector 135, Noida - Uttar Pradesh - 201301</p>
<p>Email: info@samairawebsolutions.in</p>
<p>&nbsp;</p>
<p>The parties submit  all their disputes arising out of or in connection with this Agreement to the  exclusive jurisdiction of the Courts of New Delhi.</p>
</li>
</ol>
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

export default About;