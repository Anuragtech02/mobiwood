import React, { useState } from "react";
import Slider from "react-slick";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; // eslint-disable-line
import { SectionHeading } from "../layouts/Headings";
import { PrimaryButton as PrimaryButtonBase } from "../layouts/Buttons";
import { ReactComponent as ChevronLeftIcon } from "feather-icons/dist/icons/chevron-left.svg";
import { ReactComponent as ChevronRightIcon } from "feather-icons/dist/icons/chevron-right.svg";
import { ReactComponent as PlayIcon } from "feather-icons/dist/icons/play.svg";
import "../css/master.css";

const Container = tw.div`relative overflow-hidden`;
const Content = tw.div`max-w-full sm:mx-0 xl:mx-12 py-4 lg:pb-20 lg:pt-10`;

const HeadingWithControl = tw.div`flex flex-col sm:items-stretch sm:flex-row justify-between`;
const Heading = tw(SectionHeading)`px-4`;
const Controls = tw.div`flex items-center pr-5 hidden md:block`;
const ControlButton = styled(PrimaryButtonBase)`
  ${tw`mt-4 sm:mt-0 bg-button-200 hocus:bg-button-100 first:ml-0 ml-6 rounded-full p-2`}
  svg {
    ${tw`w-6 h-6`}
  }
`;
const PrevButton = tw(ControlButton)``;
const NextButton = tw(ControlButton)``;

const CardSlider = styled(Slider)`
  ${tw`mt-5 sm:mt-16 overflow-hidden`}
  .slick-track {
    ${tw`flex`}
  }
  .slick-slide {
    ${tw`h-auto flex justify-center mb-1`}
  }
`;
const Card = tw.div`h-full flex! flex-col sm:border max-w-sm sm:rounded-tl-4xl sm:rounded-br-5xl mx-1 lg:mx-3 relative focus:outline-none`;
const CardImage = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`w-full h-25width md:h-15width lg:h-15width xl:h-13width bg-cover bg-center rounded sm:rounded-none sm:rounded-tl-4xl`,
]);

const TextInfo = tw.div`py-6 sm:px-10 sm:py-6`;
const TitleReviewContainer = tw.div`flex flex-col sm:flex-row sm:justify-between sm:items-center`;
const Title = styled.h5`
  ${css`
    text-overflow: ellipsis;
    overflow: hidden;
  `}
  ${tw`text-sm sm:text-xl w-full font-bold h-12 sm:h-16`}
`;

const SecondaryInfoContainer = tw.div`flex flex-col sm:flex-row mt-2 sm:mt-4`;
const IconWithText = tw.div`flex items-center mr-6 my-2 sm:my-0`;

const Text = tw.div`text-xs sm:text-sm font-normal sm:font-semibold text-gray-800`;

const VideoGrid = ({ gridHeading = (props) => props.gridHeading }) => {
  // useState is used instead of useRef below because we want to re-render when sliderRef becomes available (not null)
  const [sliderRef, setSliderRef] = useState(null);
  const sliderSettings = {
    arrows: false,
    slidesToShow: 5,
    responsive: [
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 4,
        },
      },

      {
        breakpoint: 1100,
        settings: {
          slidesToShow: 3,
        },
      },

      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2.2,
        },
      },
    ],
  };

  /* Change this according to your needs */
  const cards = [
    {
      postId: "1",
      postImageSrc:
        "https://images.unsplash.com/photo-1563784462041-5f97ac9523dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&q=80",
      title: "Enjoying the beach life while on a vacation",
      description:
        "Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
      authorName: "Adam Cuppy",
      url: "/v",
    },
    {
      postId: "2",
      postImageSrc:
        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "Getting the most out of your vacation",
      description:
        "Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
      authorName: "Aaron Patterson",
      url: "/v",
    },
    {
      postId: "3",
      postImageSrc:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "Choosing the perfect Safaris in Africa",
      description:
        "Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
      authorName: "Sam Phipphen",
      url: "/v",
    },
    {
      postId: "4",
      postImageSrc:
        "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "Hiking during the monsoon in Asia",
      description:
        "Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
      authorName: "Tony Hawk",
      url: "/v",
    },
    {
      postId: "5",
      postImageSrc:
        "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "Must carry items while travelling to Thailand",
      description:
        "Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
      authorName: "Himali Turn",
      url: "/v",
    },
    {
      postId: "6",
      postImageSrc:
        "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "Hiking during the monsoon in Asia",
      description:
        "Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
      authorName: "Tony Hawk",
      url: "/v",
    },
  ];

  const [hoverState, setHoverState] = useState({
    hover: false,
    postId: "",
  });

  function handleHover(id) {
    setHoverState({ hover: true, postId: id });
  }

  function handleNoHover() {
    setHoverState({ hover: false, postId: "" });
  }

  return (
    <Container>
      <Content>
        <HeadingWithControl>
          <Heading>{gridHeading}</Heading>
          <Controls>
            <PrevButton onClick={sliderRef?.slickPrev}>
              <ChevronLeftIcon />
            </PrevButton>
            <NextButton onClick={sliderRef?.slickNext}>
              <ChevronRightIcon />
            </NextButton>
          </Controls>
        </HeadingWithControl>
        <CardSlider ref={setSliderRef} {...sliderSettings}>
          {cards.map((card, index) => (
            <a href={card.url}>
              <Card
                key={index}
                onMouseEnter={() => handleHover(card.postId)}
                onMouseLeave={() => handleNoHover()}
              >
                {!hoverState.hover && (
                  <CardImage imageSrc={card.postImageSrc} />
                )}
                {hoverState.hover && hoverState.postId !== card.postId && (
                  <CardImage imageSrc={card.postImageSrc} />
                )}
                {hoverState.hover && hoverState.postId === card.postId && (
                  <CardImage imageSrc={card.postImageSrc} tw="opacity-25" />
                )}
                {hoverState.hover && hoverState.postId === card.postId && (
                  <PlayIcon
                    tw="block h-25width md:h-15width lg:h-15width xl:h-13width absolute justify-center z-40 w-full p-6 opacity-75 sm:p-12"
                    onMouseEnter={() => handleHover(card.postId)}
                  />
                )}
                <TextInfo>
                  <TitleReviewContainer>
                    <Title>{card.title}</Title>
                  </TitleReviewContainer>
                  <SecondaryInfoContainer>
                    <IconWithText>
                      <Text>{card.authorName}</Text>
                    </IconWithText>
                  </SecondaryInfoContainer>
                </TextInfo>
              </Card>
            </a>
          ))}
        </CardSlider>
      </Content>
    </Container>
  );
};

export default VideoGrid;
