import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import Video from "../../videos/video.mp4";
import Card from "./Card";
import tw from "twin.macro";
import VideoGrid from './VideoGrid';
import { css } from "styled-components/macro"; // eslint-disable-line
import "../css/master.css";

const VideoPlayerContainer = tw.div`col-span-10 lg:col-span-7`;
const VideoDetails = tw.div`py-6`;
const VideoTitle = tw.div`text-sm sm:text-2xl w-full font-bold h-12 sm:h-16`;

const VidSuggestionsFull = tw.div`w-128 ml-10`;

const VideoPlayer = () => {
  const [vw, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
  
  const heightFactor = vw > 1024 ? (vw - 600) * 9 / 16 : (vw > 640 ? 0.051 * 9 * vw : 0.06 * 9 * vw);
  const widthFactor = vw > 1024 ? (vw - 600) : (vw > 640 ? (0.051 * 16 * vw) : (0.06 * 16 * vw));

  const cards = [
    {
      postId: "1",
      postImageSrc:
        "https://images.unsplash.com/photo-1563784462041-5f97ac9523dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1024&q=80",
      title: "Enjoying the beach life while on a vacation",
      description:
        "Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
      authorName: "Adam Cuppy",
      url: "#",
    },
    {
      postId: "2",
      postImageSrc:
        "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "Getting the most out of your vacation",
      description:
        "Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
      authorName: "Aaron Patterson",
      url: "#",
    },
    {
      postId: "3",
      postImageSrc:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "Choosing the perfect Safaris in Africa",
      description:
        "Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
      authorName: "Sam Phipphen",
      url: "#",
    },
    {
      postId: "4",
      postImageSrc:
        "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "Hiking during the monsoon in Asia",
      description:
        "Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
      authorName: "Tony Hawk",
      url: "#",
    },
    {
      postId: "5",
      postImageSrc:
        "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "Must carry items while travelling to Thailand",
      description:
        "Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
      authorName: "Himali Turn",
      url: "#",
    },
    {
      postId: "6",
      postImageSrc:
        "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "Hiking during the monsoon in Asia",
      description:
        "Lorem ipsum dolor sit amet, consecteturious adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua now ele.",
      authorName: "Tony Hawk",
      url: "#",
    },
  ];

  return (
    <div tw="my-8 sm:mx-10 lg:flex">
      <VideoPlayerContainer>
        <ReactPlayer
          width={widthFactor}
          height={heightFactor}
          url={Video}
          controls={true}
          className="background-grey"
        />
        <VideoDetails>
          <VideoTitle>Joe Hart Amazing Save!</VideoTitle>
        </VideoDetails>
        {vw <= 1024 && <VideoGrid />}
      </VideoPlayerContainer>
      {vw > 1024 && <VidSuggestionsFull>
        { cards.map((card, index) => (
          <Card cardData={card} />
        )) }
      </VidSuggestionsFull>}
    </div>
  );
};

export default VideoPlayer;
