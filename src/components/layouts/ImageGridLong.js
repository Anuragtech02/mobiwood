import React, { useEffect, useRef, useState, useContext } from "react";
import tw from "twin.macro";
import ReactPlayer from "react-player";
import { css } from "styled-components/macro"; //eslint-disable-line
import { ReactComponent as CloseIcon } from "feather-icons/dist/icons/x.svg";
import { firestore } from "../../firebase.config";
// import firebase from "firebase";
import { ReactComponent as LikeIcon } from "feather-icons/dist/icons/thumbs-up.svg";
import { ReactComponent as DisLikeIcon } from "feather-icons/dist/icons/thumbs-down.svg";
import { ReactComponent as Share } from "feather-icons/dist/icons/share.svg";
import { ReactComponent as Comment } from "feather-icons/dist/icons/message-square.svg";
import { ReactComponent as Report } from "feather-icons/dist/icons/flag.svg";
import "../../ImageGrid.css";
import { ReactComponent as EyeIcon } from "feather-icons/dist/icons/eye.svg";
import { Button, IconButton, Tooltip } from "@material-ui/core";

import VideoThumbnail from "react-video-thumbnail";
import "../css/master.css";
import { auth } from "firebase";
import { UserContext } from "../../contexts/UserContext";
import { VideosContext } from "../../contexts/VideosContext";
import AuthContext from "../../contexts/AuthContext";

const Container = tw.div`relative`;
const Content = tw.div` -mx-2 py-2`;
const ThreeColumn = tw.div`flex items-center flex-row flex-wrap`;
const Column = tw.div`mb-2 w-1/2 sm:w-1/3 xl:w-1/4`;

const HeadingInfoContainer = tw.div`flex flex-col items-start ml-0`;
const HeadingDescription = tw.p`mt-4 font-bold text-3xl text-gray-900 text-center max-w-sm`;

const Card = tw.div`mx-2 cursor-pointer`;
const Image = tw.div`bg-cover bg-center h-40width sm:h-28width lg:h-24width xl:h-18width rounded`;

const ModalContainer = tw.div`justify-center m-4 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none`;
const OutModal = tw.div`opacity-75 fixed inset-0 z-40 bg-black`;
const ModalContent = tw.div`relative w-auto my-6 mx-auto max-w-3xl`;

export default (props) => {
  const [showModal, setShowModal] = useState(false);
  // const [vids, setVids] = useState(null);
  // const [id, setId] = useState(null); //eslint-disable-line
  const [author, setAuthor] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [likeBtn, setLikeBtn] = useState("");
  const [views, setViews] = useState(0);

  const { likedVideos, updateLikes } = useContext(UserContext);
  const { userDetails } = useContext(AuthContext);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setShowModal(false);
          setAuthor(null);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const [cardDetails, setCardDetails] = useState({});
  const { videos, id } = useContext(VideosContext);

  // async function getVidData() {
  //   let tmp = [];
  //   let ids = [];
  //   const vidRef = firestore
  //     .collection("contest")
  //     .orderBy("uploadTime", "desc");
  //   //.limit(16)
  //   const activeref = await vidRef.get();
  //   activeref.forEach((collection) => {
  //     tmp.push(collection.data());
  //     ids.push(collection.id);
  //   });
  //   setVids(tmp);
  //   setId(ids);
  // }

  // useEffect(() => {
  //   getVidData();
  // }, []);

  const [vw, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);

  function addView(index) {
    // firestore.collection("contest").doc(id[index]).update({
    //   views: firebase.firestore.FieldValue.increment(1)
    // });
  }

  // function addLike(index) {
  // firestore.collection("contest").doc(id[index]).update({
  //   views: firebase.firestore.FieldValue.increment(1)
  // });
  // }

  function handleCardClick(post) {
    const videoId = id[videos.indexOf(post)];
    setCardDetails(post);
    post.likes ? setLikes(post.likes) : setLikes(0);
    setViews(post.views ? post.views + 1 : 1);
    post.views = post.views ? post.views + 1 : 1;
    // console.log(post);
    firestore
      .collection("user")
      .doc(post.userid)
      .get()
      .then((vals) => {
        setAuthor(vals.data().name);
      })
      .then(() => {
        firestore.collection("contest").doc(videoId).update({
          views: post.views,
        });
      });
    if (auth().currentUser) {
      likedVideos.indexOf(videoId) !== -1
        ? setLikeBtn("clicked")
        : setLikeBtn("");
    }
  }

  const handleClickLike = () => {
    const videoId = id[videos.indexOf(cardDetails)];
    let newLikes = 0;

    //Check if user has not liked the video yet
    if (likedVideos.indexOf(videoId) === -1) {
      newLikes = parseInt(cardDetails.likes + 1) || 1;
      setLikeBtn("clicked");
      updateLikes(videoId, "like");
    } else {
      newLikes = cardDetails.likes >= 1 ? cardDetails.likes - 1 : 0;
      setLikeBtn("");
      updateLikes(videoId, "unlike");
    }

    setLikes(newLikes);
    cardDetails.likes = newLikes;
    firestore.collection("contest").doc(videoId).update({
      likes: newLikes,
    });
  };

  return (
    <Container>
      <HeadingInfoContainer>
        <HeadingDescription>{props.heading}</HeadingDescription>
      </HeadingInfoContainer>
      <Content>
        <ThreeColumn>
          {videos &&
            videos.map((post, index) => (
              <Column key={index}>
                <Card
                  onClick={() => {
                    handleCardClick(post);
                    setShowModal(true);
                    addView(index);
                  }}
                >
                  <Image>
                    {post.thumbnail ? (
                      <>
                        <img
                          className="thumbnail"
                          src={post.thumbnail}
                          alt={post.title}
                        />
                      </>
                    ) : (
                      <VideoThumbnail
                        videoUrl={post.videoUrl}
                        snapshotAtTime={3}
                      />
                    )}
                  </Image>
                </Card>
              </Column>
            ))}
        </ThreeColumn>
        {showModal ? (
          <>
            <ModalContainer>
              <ModalContent ref={wrapperRef}>
                <div tw="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  {/*header*/}
                  <div tw="flex items-start justify-between px-5  border-gray-300 rounded-t">
                    <h3 tw="text-xl font-semibold hidden">
                      {cardDetails.title}
                    </h3>
                    <span class="vid-close-btn">
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setCardDetails({});
                          setAuthor(null);
                        }}
                        tw="p-1 ml-auto  bg-transparent opacity-75 border-0 text-black float-right text-xl leading-none font-semibold outline-none focus:outline-none"
                      >
                        <CloseIcon tw="cursor-pointer text-black h-5 w-6 text-xl block outline-none focus:outline-none" />
                      </button>
                    </span>
                  </div>
                  {/*body*/}
                  <div tw="relative p-2 flex-auto">
                    <div tw="text-gray-600 text-lg leading-relaxed bg-black">
                      <div class="player">
                        <ReactPlayer
                          config={{
                            file: {
                              attributes: {
                                disablepictureinpicture: "true",
                                controlsList: "nodownload",
                              },
                            },
                          }}
                          url={cardDetails.videoUrl}
                          controls={true}
                          playing={true}
                          width={vw < 730 ? vw - 60 : 640}
                          height={vw < 730 ? ((vw - 60) * 36) / 64 : 360}
                        />
                      </div>
                      <div tw="pl-5 pb-4 text-base text-white">
                        <a href="#" class="author-link">
                          {author}
                        </a>{" "}
                        <a href="#" class="video-follow-btn">
                          Follow
                        </a>
                      </div>
                    </div>
                    <div tw="flex mt-2 pl-2">
                      <div class="video-actions">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Tooltip
                            placement="top"
                            className="tooltip-top"
                            title={disabled ? "Login to like" : "Like"}
                          >
                            <IconButton
                              disabled={disabled}
                              onClick={handleClickLike}
                              className="icon-btn"
                            >
                              <LikeIcon className={likeBtn} tw="w-4 mr-1" />{" "}
                            </IconButton>
                          </Tooltip>
                          <span class="video-like-count">{likes}</span>
                        </div>
                        <div className="icon-container comments-icon">
                          <IconButton className="icon-btn">
                            <Comment tw="w-4 mr-1" />{" "}
                          </IconButton>
                          <span class="video-like-count">{comments}</span>
                        </div>{" "}
                        <div className="icon-container">
                          <IconButton className="icon-btn">
                            <Share tw="w-4 mr-1" />{" "}
                          </IconButton>
                          <span class="video-like-count">0</span>
                        </div>{" "}
                        <div
                          style={{ marginLeft: "10px" }}
                          className="icon-container"
                        >
                          <EyeIcon tw="w-4 mr-1" />{" "}
                          <span
                            style={{ marginLeft: "10px" }}
                            class="video-like-count"
                          >
                            {views}
                          </span>
                        </div>{" "}
                        <div class="report-video-link">
                          <Button className="icon-btn">
                            <Report tw="w-4 mr-1" />{" "}
                            <span class="reporttxt">Report</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalContent>
            </ModalContainer>
            <OutModal></OutModal>
          </>
        ) : null}
      </Content>
    </Container>
  );
};
