import React, { useState } from "react";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro";
import { ReactComponent as PlayIcon } from "feather-icons/dist/icons/play.svg";

const CardContainer = tw.div`flex`;
const CardImage = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`h-28 mb-4 bg-cover bg-center min-w-48`,
]);

const CardInfo = tw.div`mx-4`;
const CardTitle = styled.h5`
  ${css`
    text-overflow: ellipsis;
    overflow: hidden;
  `}
  ${tw`text-sm w-full font-semibold h-12`}
`;
const CardAuthor = tw.div`text-xs text-gray-600`;

const Card = (cardData = (props) => props.cardData) => {
  const [hoverState, setHoverState] = useState(false);

  function handleHover() {
    setHoverState(true);
  }

  function handleNoHover() {
    setHoverState(false);
  }

  return (
    <CardContainer
      onMouseEnter={() => handleHover()}
      onMouseLeave={() => handleNoHover()}
    >
      {!hoverState && <CardImage imageSrc={cardData.cardData.postImageSrc} />}
      {hoverState && (
        <CardImage imageSrc={cardData.cardData.postImageSrc} tw="opacity-25" />
      )}
      {hoverState && (
        <PlayIcon
          tw="block h-28 absolute justify-center z-40 w-48 p-8 opacity-75"
          onMouseEnter={() => handleHover()}
        />
      )}
      <CardInfo>
        <CardTitle>{cardData.cardData.title}</CardTitle>
        <CardAuthor>{cardData.cardData.authorName}</CardAuthor>
      </CardInfo>
    </CardContainer>
  );
};

export default Card;
