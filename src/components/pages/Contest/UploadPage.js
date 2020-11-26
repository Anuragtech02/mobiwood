import React from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { navigate } from "hookrouter";
import AnimationRevealPage from "../../layouts/AnimationRevealPage";
import Nav from "../../layouts/NewNav";
import Footer from "../../layouts/Footer";
import { useFormik } from "formik";
import { auth, firestore, storage } from "../../../firebase.config";
import Sidebar from "react-sidebar";
import { SideLinks, SideLinksShort } from "../../layouts/SideLinks";
import { isBrowser, isMobile, isTablet } from "react-device-detect"; //eslint-disable-line

const Container = tw.div`relative bg-purple-100 text-gray-900 font-medium flex flex-col justify-center mt-0 pb-5`;
const ContainerHeading = tw.div`px-4 sm:px-10 pt-4 text-2xl font-normal`;
const Content = tw.div`m-4 sm:m-8 mt-2 sm:mt-2 bg-purple-100 text-gray-900 flex justify-center flex-1 flex-col lg:flex-row`;
const MainContainer = tw.div`w-full lg:w-1/2 p-2 sm:p-6 lg:border-t-2`;
const FormContainer = tw.div`w-full flex-1 mt-2`;

const OutNav = tw.div`font-display text-secondary-500 block overflow-hidden`;

const Form = tw.form`mx-auto`;
const InputContainer = tw.div`first:mt-0 mt-5 flex flex-col`;
const Label = tw.label`mb-1 text-sm font-semibold ml-1 text-gray-900`;
const Input = tw.input`w-full p-3 bg-white rounded-md font-medium border border-gray-500 text-sm focus:outline-none focus:border-gray-400`;
const InputArea = tw.textarea`w-full p-3 h-40 rounded-md font-medium border border-gray-500 resize-y text-sm focus:outline-none focus:border-gray-400`;
const SubmitButton = styled.button`
  ${tw`w-20 mt-5 mx-auto text-sm bg-blue-700 text-gray-100 py-2 rounded-lg hover:bg-blue-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .text {
    ${tw``}
  }
`;

const IllustrationContainer = tw.div`flex-1 border-t-2 flex justify-start sm:p-6`;
const IllustratorContent = tw.div`block relative`;
const IllustrationHeading = tw.div`text-lg pt-4 font-semibold`;
const OL = tw.ul`pl-8 mt-4 list-disc font-light text-sm`;
const LI = tw.li`py-1`;

const ErrorMessage = tw.div`text-red-600 -mb-2 mt-3`;

// const itemsRef = firebase.database().ref("user");

const UploadPage = () => {
  const validate = (values) => {
    const errors = {};

    if (values.talent === "default") {
      errors.talent = "Specifying Your Talent is a Necessity";
    }

    if (values.talent === "others" && !values.otherTalent) {
      errors.others = "Please Name Your Other Talent";
    }

    if (!values.description) {
      errors.description = "Please Provide a Description";
    }

    if (!values.title) {
      errors.title = "Please Provide a Title";
    }

    if (!values.socialMedia) {
      errors.socialMedia =
        "Enter the Name of the Platform With the Highest Follower Count";
    }

    if (!values.followerCount) {
      errors.followerCount = "Enter the Follower Count on the Platform";
    }

    if (length > 90) {
      errors.file = "Upload video less than 90 seconds";
    }

    if (!file) {
      errors.file = "Choose a file to upload";
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      talent: "default",
      otherTalent: "",
      description: "",
      title: "",
      file: "",
      socialMedia: "",
      followerCount: "",
    },
    validate,
    onSubmit: (values) => {
      if (!auth.currentUser) {
        alert("You need to login first");
        navigate("/contest");
      }
      var vid = localStorage.getItem("vid");
      var metadata = {
        contentType: file.type,
      };
      var uploadTask = storage
        .ref()
        .child("users/" + vid)
        .put(file, metadata);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadPercent(progress);
          console.log("Upload is " + progress + "% done");
        },
        (err) => {
          console.log(err);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            var data = {
              videoUrl: downloadURL,
              talent: values.talent,
              description: values.description,
              title: values.title,
              socialMedia: values.socialMedia,
              followerCount: values.followerCount,
              groupCheck: checked ? "yes" : "no",
              otherTalent:
                values.talent === "others" ? values.otherTalent : "none",
              uploadTime: new Date(),
              thumbnail: null,
            };
            firestore
              .collection("user")
              .doc(auth.currentUser.uid)
              .collection("videos")
              .doc(vid)
              .set(data, { merge: true })
              .then(() => {
                data.userid = auth.currentUser.uid;
                firestore
                  .collection("contest")
                  .doc(vid)
                  .set(data)
                  .then(() => {
                    navigate("/");
                  });
              });
          });
        }
      );
    },
  });

  const [checked, setChecked] = React.useState(false);
  function handleCheckBox(e) {
    setChecked(!checked);
  }

  const [file, setFile] = React.useState({});

  const [length, setLength] = React.useState(0);

  const [uploadPercent, setUploadPercent] = React.useState(0);

  function validateFile(file) {
    var video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);

      if (video.duration > 90) {
        setLength(video.duration);
        return;
      }
      setFile(file);
      setLength(video.duration);
      console.log(video.duration);
    };

    video.src = URL.createObjectURL(file);
  }

  const uploadVideo = (e) => {
    if (e.target.files[0]) {
      validateFile(e.target.files[0]);
    }
  };

  React.useEffect(() => {
    if (!localStorage.getItem("register")) {
      //alert("Fill in your details first");
      navigate("/contest");
    }
  });

  React.useEffect(() => {
    if (localStorage.getItem("underage") === "true") {
      navigate("/contest/underage");
    }
  });

  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  function onSetSidebarOpen(open) {
    setSidebarOpen(!sidebarOpen);
  }

  const [loginModal, setLoginModal] = React.useState(false);
  function onClickLogin() {
    setLoginModal(true);
  }

  const [signupModal, setSignupModal] = React.useState(false);
  function onClickSignup() {
    setSignupModal(true);
  }

  return (
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
              <ContainerHeading>Upload Your Video</ContainerHeading>
              <Content>
                <IllustrationContainer>
                  <IllustratorContent>
                    <IllustrationHeading>
                      Rules for the video
                    </IllustrationHeading>
                    <OL>
                      <LI>
                        The video can be of a maximum duration of 90 seconds
                      </LI>
                      <LI>
                        The video must have original content and must not
                        include any copywrite content
                      </LI>
                      <LI>
                        The video must be self-shot or indicate the
                        participant’s presence
                      </LI>
                      <LI>
                        The video must be centered only on humans and any other
                        living or non-living thing can just be used as
                        supporting assets
                      </LI>
                      <LI>
                        Previously shot videos can be used after removing any
                        other platform’s watermark(if exists)
                      </LI>
                      <LI>Any harm to animals is strictly prohibited</LI>
                      <LI>Environmental harm is strictly prohibited</LI>
                    </OL>
                    <IllustrationHeading>
                      Rules for the contest
                    </IllustrationHeading>
                    <OL>
                      <LI>
                        By entering the competition entrants warrant that all
                        information submitted by them is true, current, and
                        complete.
                      </LI>
                      <LI>
                        Multiple entries from a single participant are allowed
                        for each round 80% of participants from a particular
                        round will go to the further rounds
                      </LI>
                      <LI>
                        Only G-rated content is allowed (R rated content is
                        strictly prohibited)
                      </LI>
                      <LI>
                        Participants under 18 years of age must fill this parent
                        consent form
                      </LI>
                      <LI>
                        All rights are reserved by the T{"&"}C of WTL and any
                        breach of the above rules will result in the debarment
                        of the participant from the contest
                      </LI>
                      <LI>
                        Entries submitted through agents or third parties or in
                        bulk (i.e. more entries than a human being could submit
                        in the time available without the use of software or
                        other devices designed to make automated entries or, in
                        the case of postal entries, more than one entry
                        submitted under the same postage stamp) will not be
                        accepted.
                      </LI>
                      <LI>
                        Mobiwood holds all the rights for changing the rules,
                        rejecting the videos or disqualifying any participants
                      </LI>
                      <LI>
                        The participants will be informed via email for the
                        same.
                      </LI>
                      <LI> All rights reserved with Mobiwood.</LI>
                    </OL>
                  </IllustratorContent>
                </IllustrationContainer>
                <MainContainer>
                  <FormContainer>
                    <Form onSubmit={formik.handleSubmit}>
                      <InputContainer>
                        <Label htmlFor="talent">Talent</Label>
                        <select
                          defaultValue={formik.values.talent}
                          onChange={formik.handleChange}
                          value={formik.values.talent}
                          name="talent"
                          tw="w-full p-3 bg-white rounded-md font-medium border border-gray-500 text-sm focus:outline-none focus:border-gray-400"
                        >
                          <option value="default" disabled>
                            Your Talent
                          </option>
                          <option value="acting">Acting</option>
                          <option value="singing">Singing</option>
                          <option value="dancing">Dancing</option>
                          <option value="comedy">Comedy</option>
                          <option value="music">Music</option>
                          <option value="magic">Magic</option>
                          <option value="acrobatics">Acrobatics</option>
                          <option value="others">Others</option>
                        </select>
                        {formik.errors.talent ? (
                          <ErrorMessage>{formik.errors.talent}</ErrorMessage>
                        ) : null}
                      </InputContainer>
                      {formik.values.talent === "others" && (
                        <InputContainer>
                          <Label htmlFor="others">What's Your Talent</Label>
                          <Input
                            type="text"
                            name="otherTalent"
                            onChange={formik.handleChange}
                            value={formik.values.otherTalent}
                          />
                          {formik.errors.others ? (
                            <ErrorMessage>{formik.errors.others}</ErrorMessage>
                          ) : null}
                        </InputContainer>
                      )}
                      <InputContainer>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          type="text"
                          name="title"
                          onChange={formik.handleChange}
                          value={formik.values.title}
                        />
                        {formik.errors.title ? (
                          <ErrorMessage>{formik.errors.title}</ErrorMessage>
                        ) : null}
                      </InputContainer>
                      <InputContainer>
                        <Label htmlFor="description">
                          Write Something About the Video
                        </Label>
                        <InputArea
                          type="text"
                          name="description"
                          onChange={formik.handleChange}
                          value={formik.values.description}
                        />
                        {formik.errors.description ? (
                          <ErrorMessage>
                            {formik.errors.description}
                          </ErrorMessage>
                        ) : null}
                      </InputContainer>
                      <InputContainer>
                        <Label htmlFor="file">Upload Video</Label>
                        <Input
                          type="file"
                          name="file"
                          onChange={uploadVideo}
                          accept="video/mp4, video/x-m4v, video/*"
                        />
                        {formik.errors.file ? (
                          <ErrorMessage>{formik.errors.file}</ErrorMessage>
                        ) : null}
                        {uploadPercent ? (
                          <span>
                            Video Upload Progress: {uploadPercent}
                            {"%"}
                          </span>
                        ) : null}
                      </InputContainer>
                      <InputContainer>
                        <Label htmlFor="socialMedia">
                          Social Media With Highest Followers
                        </Label>
                        <Input
                          type="text"
                          name="socialMedia"
                          onChange={formik.handleChange}
                          value={formik.values.socialMedia}
                        />
                        {formik.errors.socialMedia ? (
                          <ErrorMessage>
                            {formik.errors.socialMedia}
                          </ErrorMessage>
                        ) : null}
                      </InputContainer>
                      <InputContainer>
                        <Label htmlFor="followerCount">
                          Follower Count on the Platform
                        </Label>
                        <Input
                          type="number"
                          name="followerCount"
                          onChange={formik.handleChange}
                          value={formik.values.followerCount}
                        />
                        {formik.errors.followerCount ? (
                          <ErrorMessage>
                            {formik.errors.followerCount}
                          </ErrorMessage>
                        ) : null}
                      </InputContainer>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={handleCheckBox}
                        tw="m-2 mt-4"
                      />
                      <span tw="m-2">Are you applying as a group?</span>
                      <br />
                      <span tw="font-normal text-xs">
                        By registering, you agree to our{" "}
                        <span tw="text-blue-500 hover:text-black hover:underline transition duration-500">
                          Terms and Conditions{" "}
                        </span>
                        and{" "}
                        <span tw="text-blue-500 hover:text-black hover:underline transition duration-500">
                          Privacy Policy
                        </span>
                      </span>
                      <SubmitButton type="submit">
                        <span className="text">Register</span>
                      </SubmitButton>
                    </Form>
                  </FormContainer>
                </MainContainer>
              </Content>
            </Container>
          </OutNav>
          <Footer />
        </AnimationRevealPage>
      </Sidebar>
    </Sidebar>
  );
};

export default UploadPage;
