import React, { useContext } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { navigate } from "hookrouter";
import AnimationRevealPage from "../../layouts/AnimationRevealPage";
import Nav from "../../layouts/NewNav";
import Footer from "../../layouts/Footer";
import { firestore, auth } from "../../../firebase.config";
import { useFormik } from "formik";
import { AuthContext } from "../../../contexts/AuthContext";

const Container = tw.div`relative bg-purple-100 text-gray-900 font-medium flex flex-col justify-center mt-0 pb-5`;
const ContainerHeading = tw.div`px-4 sm:px-10 pt-4 text-2xl font-normal`;
const Content = tw.div`m-4 sm:m-8 mt-2 sm:mt-2 bg-purple-100 text-gray-900 flex justify-center flex-1 flex-col lg:flex-row`;
const MainContainer = tw.div`w-full lg:w-1/2 p-2 sm:p-6 lg:border-t-2`;
const FormContainer = tw.div`w-full flex-1 mt-2`;

const Form = tw.form`mx-auto`;
const InputContainer = tw.div`first:mt-0 mt-5 flex flex-col`;
const Label = tw.label`mb-1 text-sm font-semibold ml-1 text-gray-900`;
const Input = tw.input`w-full p-3 bg-white rounded-md font-medium border border-gray-500 text-sm focus:outline-none focus:border-gray-400`;
const SubmitButton = styled.button`
  ${tw`w-20 mt-5 mx-auto text-sm bg-blue-700 text-gray-100 py-2 rounded-lg hover:bg-blue-800 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .text {
    ${tw``}
  }
`;

const IllustrationContainer = tw.div`flex-1 border-t-2 flex justify-start sm:p-6`;
const IllustratorContent = tw.div`block relative`;
const IllustrationHeading = tw.div`text-lg pt-4 font-semibold`;
const OL = tw.ul`pl-8 sm:pl-16 mt-4 list-disc font-light text-sm`;
const LI = tw.li`py-1`;

const ErrorMessage = tw.div`text-red-600 -mb-2 mt-3`;

// const itemsRef = firebase.database().ref("user");

const validate = (values) => {
  const errors = {};
  if (!values.name) {
    errors.name = "Name Required";
  }

  if (!values.email) {
    errors.email = "Email Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.dob) {
    errors.dob = "Date of Birth Required";
  }

  if (values.gender === "default") {
    errors.gender = "Gender Required";
  }

  if (!values.number) {
    errors.number = "Phone Number Required";
  } else if (!values.number.match(/^\d{10}$/)) {
    errors.number = "Invalid Phone Number. 10 Digits Required";
  }

  return errors;
};

const UnderAgeContest = () => {
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

  const { userDetails } = useContext(AuthContext);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      number: "",
      dob: "",
      gender: "default",
    },
    validate,
    onSubmit: (values) => {
      var vid = localStorage.getItem("vid");
      localStorage.setItem("underage", values);
      var data = {};
      data.parentName = values.name;
      data.parentEmail = values.email;
      data.parentNumber = values.number;
      data.parentDob = values.dob;
      data.parentGender = values.gender;
      data.displayName = userDetails.name;
      data.username = userDetails.username;
      firestore
        .collection("user")
        .doc(auth.currentUser.uid)
        .collection("videos")
        .doc(vid)
        .set(data, { merge: true })
        .then(() => {
          navigate("/contest/upload");
        });
    },
  });

  React.useEffect(() => {
    if (!asyncLocalStorage.getItem("register")) {
      alert("Fill in your details first");
      navigate("/contest");
    }
  });

  return (
    <AnimationRevealPage disabled>
      <Nav />
      <Container>
        <ContainerHeading>Registeration for Below 18 Years</ContainerHeading>
        <Content>
          <IllustrationContainer>
            <IllustratorContent>
              <IllustrationHeading>Rules for the video</IllustrationHeading>
              <OL>
                <LI>The video can be of a maximum duration of 90 seconds</LI>
                <LI>
                  The video must have original content and must not include any
                  copy-write content
                </LI>
                <LI>
                  The video must be self-shot or indicate the participant’s
                  presence
                </LI>
                <LI>
                  The video must be centered only on humans and any other living
                  or non-living thing can just be used as supporting assets
                </LI>
                <LI>
                  Previously shot videos can be used after removing any other
                  platform’s watermark(if exists)
                </LI>
                <LI>Any harm to animals is strictly prohibited</LI>
                <LI>Environmental harm is strictly prohibited</LI>
              </OL>
              <IllustrationHeading>Rules for the contest</IllustrationHeading>
              <OL>
                <LI>
                  By entering the competition entrants warrant that all
                  information submitted by them is true, current, and complete.
                </LI>
                <LI>
                  Multiple entries from a single participant are allowed for
                  each round 80% of participants from a particular round will go
                  to the further rounds
                </LI>
                <LI>
                  Only G-rated content is allowed (R rated content is strictly
                  prohibited)
                </LI>
                <LI>
                  Participants under 18 years of age must fill this parent
                  consent form
                </LI>
                <LI>
                  All rights are reserved by the T{"&"}C of WTL and any breach
                  of the above rules will result in the debarment of the
                  participant from the contest
                </LI>
                <LI>
                  Entries submitted through agents or third parties or in bulk
                  (i.e. more entries than a human being could submit in the time
                  available without the use of software or other devices
                  designed to make automated entries or, in the case of postal
                  entries, more than one entry submitted under the same postage
                  stamp) will not be accepted.
                </LI>
                <LI>
                  Mobiwood holds all the rights for changing the rules,
                  rejecting the videos or disqualifying any participants
                </LI>
                <LI>
                  The participants will be informed via email for the same.
                </LI>
                <LI> All rights reserved with Mobiwood.</LI>
              </OL>
            </IllustratorContent>
          </IllustrationContainer>
          <MainContainer>
            <FormContainer>
              <Form onSubmit={formik.handleSubmit}>
                <InputContainer>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    type="text"
                    name="name"
                    onChange={formik.handleChange}
                    value={formik.values.name}
                  />
                  {formik.errors.name ? (
                    <ErrorMessage>{formik.errors.name}</ErrorMessage>
                  ) : null}
                </InputContainer>
                <InputContainer>
                  <Label htmlFor="email">Parent's/Guardian's Email</Label>
                  <Input
                    type="email"
                    name="email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                  />
                  {formik.errors.email ? (
                    <ErrorMessage>{formik.errors.email}</ErrorMessage>
                  ) : null}
                </InputContainer>
                <InputContainer>
                  <Label htmlFor="dob">
                    Parent's/ Guardian's Date of Birth
                  </Label>
                  <Input
                    type="date"
                    name="dob"
                    onChange={formik.handleChange}
                    value={formik.values.dob}
                  />
                  {formik.errors.dob ? (
                    <ErrorMessage>{formik.errors.dob}</ErrorMessage>
                  ) : null}
                </InputContainer>
                <InputContainer>
                  <Label htmlFor="number">Parent's/Guardian's Mobile</Label>
                  <Input
                    type="tel"
                    name="number"
                    onChange={formik.handleChange}
                    value={formik.values.number}
                  />
                  {formik.errors.number ? (
                    <ErrorMessage>{formik.errors.number}</ErrorMessage>
                  ) : null}
                </InputContainer>
                <InputContainer>
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    name="gender"
                    defaultValue={formik.values.gender}
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
                </InputContainer>
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
                  <span className="text">Next</span>
                </SubmitButton>
              </Form>
            </FormContainer>
          </MainContainer>
        </Content>
      </Container>
      <Footer />
    </AnimationRevealPage>
  );
};

export default UnderAgeContest;
