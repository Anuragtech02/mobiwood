import React from "react";
import { Container as ContainerBase } from "../layouts/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { navigate } from "hookrouter";
import AnimationRevealPage from "../layouts/AnimationRevealPage";
import logo from "../../images/logo.jpg";

const Container = tw(
  ContainerBase
)`min-h-screen bg-primary-900 text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 sm:my-16 bg-white text-gray-900 shadow sm:rounded-l-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12 flex flex-col justify-center`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;

const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`mt-5 tracking-wide font-semibold bg-button-200 text-gray-100 w-full py-4 rounded-lg hover:bg-button-100 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;

function handleSubmit(e) {
  navigate("/");
}

const PersonalDetails = ({
  logoLinkUrl = "/",
  headingText = "Where Do You Live",
  submitButtonText = "Submit",
}) => {
  return (
    <AnimationRevealPage disabled>
      <Container>
        <Content>
          <MainContainer>
            <LogoLink href={logoLinkUrl}>
              <LogoImage src={logo} />
            </LogoLink>
            <MainContent>
              <Heading>{headingText}</Heading>
              <FormContainer>
                <Form onSubmit={handleSubmit}>
                  <Input
                    type="text"
                    placeholder="Address Line 1"
                    autoComplete="address-line1"
                  />
                  <Input
                    type="text"
                    placeholder="Address Line 2"
                    autoComplete="address-line2"
                  />
                  <Input
                    type="text"
                    placeholder="City"
                    autoComplete="locality"
                  />
                  <Input
                    type="text"
                    placeholder="Country"
                    autoComplete="country-name"
                  />
                  <Input
                    type="text"
                    placeholder="ZIP"
                    autoComplete="postal-code"
                  />
                  <SubmitButton type="submit">
                    <span className="text">{submitButtonText}</span>
                  </SubmitButton>
                </Form>
              </FormContainer>
            </MainContent>
          </MainContainer>
        </Content>
      </Container>
    </AnimationRevealPage>
  );
};

export default PersonalDetails;
