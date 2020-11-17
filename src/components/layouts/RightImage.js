import React from "react";
import tw from "twin.macro";
import { css } from "styled-components/macro"; //eslint-disable-line

const Container = tw.div`relative px-6`;
const TwoColumn = tw.div`flex flex-col lg:flex-row lg:items-center max-w-screen-xl mx-auto pt-12 md:py-20`;
const LeftColumn = tw.div`relative lg:w-5/12 text-center max-w-lg mx-auto lg:max-w-none lg:text-left`;
const RightColumn = tw.div`relative mt-12 ml-8 lg:mt-0 flex-1 flex flex-col justify-center lg:self-end`;

const Heading = tw.h1`font-bold text-3xl md:text-3xl lg:text-4xl xl:text-5xl text-gray-900 leading-tight`;
const Paragraph = tw.p`my-5 lg:my-8 text-base xl:text-lg`;
const IllustrationContainer = tw.div`flex justify-center lg:justify-end items-center`;

// const Actions = styled.div`
//   ${tw`relative max-w-md text-center mx-auto lg:mx-0`}
//   input {
//     ${tw`sm:pr-48 pl-8 py-4 sm:py-5 rounded-full border-2 w-full font-medium focus:outline-none transition duration-300  focus:border-primary-500 hover:border-gray-500`}
//   }
//   button {
//     ${tw`w-full sm:absolute top-0 bottom-0 bg-primary-500 text-gray-100 font-bold mr-2 my-4 sm:my-2 rounded-full py-4 sm:py-6 flex items-center justify-center sm:w-40 sm:leading-none focus:outline-none hover:bg-primary-900 transition duration-300`}
//   }
// `;

const RightImage = ({
  roundedHeaderButton,
  image = (props) => props.image,
  heading = (props) => props.heading,
  content = (props) => props.content,
}) => {
  return (
    <>
      <Container>
        <TwoColumn>
          <LeftColumn>
            <Heading>{ heading }</Heading>
            <Paragraph>
                { content }
            </Paragraph>
            {/* <Actions>
              <button onClick={ Navigate }>Upload Yours!</button>
            </Actions> */}
          </LeftColumn>
          <RightColumn>
            <IllustrationContainer>
              <img
                tw="min-w-0 w-full max-w-lg xl:max-w-3xl"
                src={image}
                alt="Design Illustration"
              />
            </IllustrationContainer>
          </RightColumn>
        </TwoColumn>
      </Container>
    </>
  );
};

export default RightImage;
