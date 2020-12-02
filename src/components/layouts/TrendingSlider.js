import React from "react";
import Slider from "react-slick";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; // eslint-disable-line
import Image7 from "../../images/slider7.jpg";
import Image1 from "../../images/slider1.jpg";
import Image2 from "../../images/slider2.jpg";
import Image3 from "../../images/slider3.jpg";
import Image4 from "../../images/slider4.jpg";
import Image5 from "../../images/slider5.jpg";
import Image6 from "../../images/slider6.jpg";
import Image8 from "../../images/slider8.jpg";
import Image9 from "../../images/slider9.jpg";
import Image10 from "../../images/slider10.jpg";
import Image11 from "../../images/slider11.jpg";
import Image12 from "../../images/slider12.jpg";
import Image13 from "../../images/slider13.jpg";
import Image14 from "../../images/slider14.jpg";
import Image15 from "../../images/slider15.jpg";

import "../css/slider.css";

const Container = tw.div`relative overflow-hidden`;
const Content = tw.div`max-w-full`;

const CardSlider = styled(Slider)`
  ${tw`overflow-hidden`}
  .slick-track {
    ${tw`flex`}
  }
  .slick-list {
    ${tw`overflow-hidden`}
  }
  .slick-slide {
    ${tw`h-auto flex justify-center mb-1`}
  }
  .slick-active {
    ${tw`-ml-1`}
  }
`;
const Card = tw.div`h-full flex! flex-col min-w-96 w-full mx-1 lg:mx-0 relative focus:outline-none`;
const CardImage = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`h-auto lg:h-full lg:h-64 bg-cover bg-center `,
]);

const TextInfo = tw.div`py-6 absolute bottom-0 text-white font-bold sm:px-10 px-5 sm:pb-20`;
const TitleReviewContainer = tw.div`flex flex-col sm:flex-row sm:justify-between sm:items-center`;
const Title = styled.h5`
  ${css`
    text-overflow: ellipsis;
    overflow: hidden;
  `}
  ${tw`text-sm sm:text-3xl w-full font-bold`}
`;

const SecondaryInfoContainer = tw.div`flex flex-col sm:flex-row mt-2 sm:mt-4`;
const IconWithText = tw.div`flex items-center mr-6 my-2 sm:my-0`;

const WhiteText = tw.div`text-xs sm:text-sm font-normal sm:font-semibold`;
const SideText = tw.div`text-xs sm:text-sm font-normal sm:font-semibold text-blue-500`;

const VideoGrid = ({ gridHeading = (props) => props.gridHeading }) => {
  // useState is used instead of useRef below because we want to re-render when sliderRef becomes available (not null)
  const sliderSettings = {
    arrows: false,
    slidesToShow: 1,
    accessibility: false,
    autoplay: true,
    draggable: false,
    fade: true,
    swipe: true,
  };
  /* Change this according to your needs */
  const cards = [
    {
      postId: "1",
      postImageSrc: Image7,
      title: "Enjoying the beach life while on a vacation",
      url: "/v",
    },
    {
      postId: "2",
      postImageSrc: Image2,
      title: "Getting the most out of your vacation",
      url: "/v",
    },
    {
      postId: "3",
      postImageSrc: Image3,
      title: "Choosing the perfect Safaris in Africa",
      url: "/v",
    },
    {
      postId: "4",
      postImageSrc: Image4,
      title: "Hiking during the monsoon in Asia",
      url: "/v",
    },
    {
      postId: "5",
      postImageSrc: Image5,
      title: "Must carry items while travelling to Thailand",
      url: "/v",
    },
    {
      postId: "6",
      postImageSrc: Image6,
      title: "Hiking during the monsoon in Asia",
      url: "/v",
    },
    {
      postId: "7",
      postImageSrc: Image7,
      title: "Hiking during the monsoon in Asia",
      url: "/v",
    },
    {
      postId: "8",
      postImageSrc: Image8,
      title: "Hiking during the monsoon in Asia",
      url: "/v",
    },
    {
      postId: "9",
      postImageSrc: Image9,
      title: "Hiking during the monsoon in Asia",
      url: "/v",
    },
    {
      postId: "10",
      postImageSrc: Image10,
      title: "Hiking during the monsoon in Asia",
      url: "/v",
    },
    {
      postId: "11",
      postImageSrc: Image11,
      title: "Hiking during the monsoon in Asia",
      url: "/v",
    },
    {
      postId: "12",
      postImageSrc: Image12,
      title: "Hiking during the monsoon in Asia",
      url: "/v",
    },
    {
      postId: "13",
      postImageSrc: Image13,
      title: "Hiking during the monsoon in Asia",
      url: "/v",
    },
    {
      postId: "14",
      postImageSrc: Image14,
      title: "Hiking during the monsoon in Asia",
      url: "/v",
    },
    {
      postId: "15",
      postImageSrc: Image15,
      title: "Hiking during the monsoon in Asia",
      url: "/v",
    },
  ];

  return (
    <Container>
      <Content>
        <CardSlider {...sliderSettings} tw="w-full h-64">
          {cards.map((card, index) => (
            <a key={index} href={card.url} tw="w-full h-64">
              <Card>
                <CardImage imageSrc={card.postImageSrc} />
              </Card>
            </a>
          ))}
        </CardSlider>
      </Content>
    </Container>
  );
};

export default VideoGrid;
