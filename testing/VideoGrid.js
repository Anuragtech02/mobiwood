import React, {useState} from "react";
import { Container, ContentWithPaddingXl } from "./Layouts";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro";
import { ReactComponent as PlayIcon } from "feather-icons/dist/icons/play.svg";

const Posts = tw.div`flex flex-wrap -mr-3 relative`;
const Post = tw.a`flex flex-col h-full bg-gray-200 rounded`;
const PostImage = styled.div`
  ${props => css`background-image: url("${props.imageSrc}");`}
  ${tw`h-64 sm:h-80 bg-center bg-cover rounded-t`}
`;

const PostText = tw.div`flex-1 px-6 py-8` 
const PostTitle = tw.h6`font-bold group-hocus:text-primary-500 transition duration-300 `;
const PostDescription = tw.p``;
const AuthorInfo = tw.div`flex`;
const AuthorTextInfo = tw.div`text-xs text-gray-600`;
const AuthorName = tw.div`font-semibold mt-2`;
const AuthorProfile = tw.div`pt-1 font-medium`;

const PostContainer = styled.div`
  ${tw`relative z-20 mt-10 sm:pt-3 pr-3 w-full sm:w-1/2 lg:w-1/3 max-w-sm mx-auto sm:max-w-none sm:mx-0`}

  ${props => props.featured && css`
    ${tw`w-full sm:w-full lg:w-2/3`}
    ${Post} {
      ${tw`sm:flex-row items-center sm:pr-3`}
    }
    ${PostImage} {
      ${tw`sm:h-80 sm:min-h-full w-full sm:w-1/2 rounded-t sm:rounded-t-none sm:rounded-l `}
    }
    ${PostText} {
      ${tw`pl-8 pr-5`}
    }
    ${PostTitle} {
      ${tw`text-2xl`}
    }
    ${PostDescription} {
      ${tw`mt-4 text-sm font-semibold text-gray-600 leading-relaxed`}
    }
    ${AuthorInfo} {
      ${tw`mt-8 flex items-center`}
    }
    ${AuthorName} {
      ${tw`mt-0 font-bold text-gray-700 text-sm`}
    }
  `}
`;


const VideoGrid = ({
  posts = [
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
      authorName: "Aaron Patterson",
      url: "#"
    },
    {
      postId: "3",
      postImageSrc:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "Choosing the perfect Safaris in Africa",
      authorName: "Sam Phipphen",
      url: "#"
    },
    {

      postId: "4",
      postImageSrc:
        "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "Hiking during the monsoon in Asia",
      authorName: "Tony Hawk",
      url: "#"
    },
    {
      postId: "5",
      postImageSrc:
        "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&q=80",
      title: "Must carry items while travelling to Thailand",
      authorName: "Himali Turn",
      url: "#"
    }
  ]
}) => {
  const [hoverState, setHoverState] = useState({
    'hover': false, 
    'postId': '',
  });
  return (
    <Container>
      <ContentWithPaddingXl tw='pt-0'>
        <Posts>
          {posts.map((post, index) => (
            <PostContainer featured={post.featured} key={index}>
              <Post className="group" href={post.url}>
                { !hoverState.hover && (<PostImage imageSrc={post.postImageSrc} 
                  onMouseEnter= {() => setHoverState({'hover':true, 'postId': post.postId})}
                  onMouseLeave= {() => setHoverState({'hover':false, 'postId': ''})} />)}
                { hoverState.hover && hoverState.postId !== post.postId && (<PostImage imageSrc={post.postImageSrc} 
                  onMouseEnter= {() => setHoverState({'hover':true, 'postId': post.postId})}
                  onMouseLeave= {() => setHoverState({'hover':false, 'postId': ''})} />)}
                { hoverState.hover && hoverState.postId === post.postId && (<PostImage imageSrc={post.postImageSrc} 
                  onMouseEnter= {() => setHoverState({'hover':true, 'postId': post.postId})}
                  onMouseLeave= {() => setHoverState({'hover':false, 'postId': ''})}
                  tw = "opacity-25"/>)}
                { hoverState.hover && hoverState.postId === post.postId && (
                  <PlayIcon tw="block h-auto sm:h-80 absolute ml-48 z-50 w-16 opacity-75"
                  onMouseEnter= {() => setHoverState({'hover':true, 'postId': post.postId})}
                  onMouseLeave= {() => setHoverState({'hover':false, 'postId': ''})} />)}
                <PostText>
                  <PostTitle>{post.title}</PostTitle>
                  {post.featured && <PostDescription>{post.description}</PostDescription>}
                  <AuthorInfo>
                    {post.featured}
                    <AuthorTextInfo>
                      <AuthorName>{post.authorName}</AuthorName>
                      {post.featured && <AuthorProfile>{post.authorProfile}</AuthorProfile>}
                    </AuthorTextInfo>
                  </AuthorInfo>
                </PostText>
              </Post>
            </PostContainer>
          ))}
        </Posts>
      </ContentWithPaddingXl>
    </Container>
  );
};

export default VideoGrid;