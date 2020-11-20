import React from "react";
import { Container as ContainerBase } from "../layouts/Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import illustration from "../../images/login.jpg";
import logo from "../../images/logo.jpg";
import googleIconImageSrc from "../../images/google-icon.png";
import { useRoutes, navigate, A } from "hookrouter";
import Login from "./Login";
import AnimationRevealPage from "../layouts/AnimationRevealPage";
import PersonalDetails from "./PersonalDetails";
import { auth, signInWithGoogle } from "../../firebase.config";

const GridContent = tw.div` mx-auto pb-4`;
const ThreeColumn = tw.div`flex items-center flex-row flex-wrap`;
const Column = tw.div`flex mt-5 w-full sm:w-1/3 justify-center`;
const Card = tw.div`flex justify-center mx-2 py-2 border rounded-md w-full`;

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

const SocialButtonsContainer = tw.div`flex flex-col items-center`;
const SocialButton = styled.a`
  ${tw`w-full max-w-xs font-semibold cursor-pointer rounded-lg py-3 border text-gray-900 bg-gray-100 hocus:bg-gray-200 hocus:border-gray-400 flex items-center justify-center transition-all duration-300 focus:outline-none focus:shadow-outline text-sm mt-5 first:mt-0`}
  .iconContainer {
    ${tw`bg-white p-2 rounded-full`}
  }
  .icon {
    ${tw`w-4`}
  }
  .text {
    ${tw`ml-4`}
  }
`;

const DividerTextContainer = tw.div`my-12 border-b text-center relative`;
const DividerText = tw.div`leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform -translate-y-1/2 absolute inset-x-0 top-1/2 bg-transparent`;

const Form = tw.form`mx-auto`;
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
const IllustrationContainer = tw.div`sm:rounded-l-lg flex-1 bg-purple-100 text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${(props) => `background-image: url("${props.imageSrc}");`}
  ${tw`m-12 xl:m-16 w-full relative max-w-md bg-contain bg-center bg-no-repeat`}
`;

const routes = {
  "/login": () => <Login />,
  "/details": () => <PersonalDetails />,
};

function handleSubmit() {
  navigate("/details");
}

const Signup = ({
  logoLinkUrl = "/",
  illustrationImageSrc = illustration,
  headingText = "",
  socialButtons = [
    {
      iconImageSrc: googleIconImageSrc,
      text: "Sign Up With Google",
      url: "https://google.com",
    },
  ],
  submitButtonText = "Next",
  forgotPasswordUrl = "#",
  loginUrl = "/login",
}) => {

  const handleAuthStateChange = (u) => {
    if (u && u.uid) {
      navigate("/logout");
    }
  }


  React.useEffect(() => {
    const sub = auth.onAuthStateChanged(handleAuthStateChange);
    return sub;
  }, []);

  const routeRes = useRoutes(routes);

  return (
    <AnimationRevealPage disabled>
      <Container>
        <Content>
          <IllustrationContainer>
            <IllustrationImage imageSrc={illustrationImageSrc} />
          </IllustrationContainer>
          <MainContainer>
            <LogoLink href={logoLinkUrl}>
              <LogoImage src={logo} />
            </LogoLink>
            <MainContent>
              <Heading>{headingText}</Heading>
              <FormContainer>
                <SocialButtonsContainer>
                  {socialButtons.map((socialButton, index) => (
                    <SocialButton key={index} onClick={signInWithGoogle}>
                      <span className="iconContainer">
                        <img
                          src={socialButton.iconImageSrc}
                          className="icon"
                          alt=""
                        />
                      </span>
                      <span className="text">{socialButton.text}</span>
                    </SocialButton>
                  ))}
                </SocialButtonsContainer>
                <DividerTextContainer>
                  <DividerText>Or Sign up with your e-mail</DividerText>
                </DividerTextContainer>
                <br />
                <Form onSubmit={handleSubmit}>
                  <Input
                    type="email"
                    placeholder="Email"
                    name="email"
                    autoComplete="email"
                  />
                  <Input
                    type="password"
                    name="password"
                    placeholder="Password"
                  />
                  <SubmitButton type="submit">
                    <span className="text">{submitButtonText}</span>
                  </SubmitButton>
                </Form>
                <p tw="mt-8 text-sm text-gray-600 text-center">
                  Been here already?{" "}
                  <A
                    href={loginUrl}
                    tw="border-b border-gray-500 border-dotted"
                  >
                    Log In!
                  </A>
                  {routeRes}
                </p>
              </FormContainer>
            </MainContent>
          </MainContainer>
        </Content>
      </Container>
    </AnimationRevealPage>
  );
};

export default Signup;
