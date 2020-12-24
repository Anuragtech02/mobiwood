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
import { ReactComponent as EyeIcon } from "feather-icons/dist/icons/eye.svg";
import VideoThumbnail from "react-video-thumbnail";
import "../css/master.css";
import "../../ImageGrid.css";
import { auth } from "firebase";
import {
  IconButton,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Radio,
  RadioGroup,
  FormControlLabel,
  Snackbar,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { UserContext } from "../../contexts/UserContext";
import { VideosContext } from "../../contexts/VideosContext";
import AuthContext from "../../contexts/AuthContext";
import { navigate } from "hookrouter";
import {
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";

import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";

import {
  FacebookIcon,
  LinkedinIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";

const Container = tw.div`relative`;
const Content = tw.div` -mx-2 py-2`;
const ThreeColumn = tw.div`flex items-center flex-row flex-wrap`;
const Column = tw.div`mb-4 w-1/2 sm:w-1/3 xl:w-1/4`;

const HeadingInfoContainer = tw.div`flex flex-col items-start ml-0`;
const HeadingDescription = tw.p`mt-4 font-bold text-3xl text-gray-900 text-center max-w-sm`;

const Card = tw.div`mx-2 cursor-pointer`;
const Image = tw.div`bg-cover bg-center h-40width sm:h-28width lg:h-24width xl:h-18width rounded`;

const ModalContainer = tw.div`justify-center items-center overflow-x-hidden fixed inset-0 z-50 outline-none focus:outline-none`;
const OutModal = tw.div`opacity-75 fixed inset-0 z-40 bg-black`;
const ModalContent = tw.div`relative w-auto my-6 mx-auto max-w-3xl`;

export default (props) => {
  const [showModal, setShowModal] = useState(false);
  const [shareModal, setShareModal] = useState(false);
  // const [vids, setVids] = useState(null);
  // const [id, setId] = useState(null); //eslint-disable-line
  const [author, setAuthor] = useState(null);
  const [likes, setLikes] = useState(0);
  const [shares, setShares] = useState(0);
  const [comments, setComments] = useState(0);
  const [disabled, setDisabled] = useState(true);
  const [likeBtn, setLikeBtn] = useState("");
  const [views, setViews] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [shareFlag, setShareFlag] = useState(false);
  const [videosLimited, setVideosLimited] = useState(props.videosLimited);
  const [followBtnText, setFollowBtnText] = useState("Follow");
  const [isFollowing, setIsFollowing] = useState("following");

  const handleClickShare = (event) => {
    setAnchorEl(event.currentTarget);
    setShareFlag(Boolean(anchorEl));
    console.log("Clicked : " + shareFlag);
    event.stopPropagation();
    updateShareOnDB();
  };

  const {
    likedVideos,
    updateLikes,
    following,
    updateFollowers,
    updateFollowing,
  } = useContext(UserContext);
  const { id } = useContext(VideosContext);
  const { userDetails, uid } = useContext(AuthContext);

  function useOutsideAlerter(ref) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          console.log("Closed : " + shareFlag);
          // setShowModal(false);
          // setAnchorEl(null);
          // setAuthor(null);
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const [cardDetails, setCardDetails] = useState({});

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

  useEffect(() => {
    if (!auth().currentUser) setDisabled(true);
    else setDisabled(false);
  }, [userDetails]);

  useEffect(() => {
    setVideosLimited(props.videosLimited);
  }, [props.videosLimited]);

  function handleCardClick(post) {
    const videoId = id[videosLimited.indexOf(post)];
    setCardDetails(post);
    post.likes ? setLikes(post.likes) : setLikes(0);
    setViews(post.views ? post.views + 1 : 1);
    post.views = post.views ? post.views + 1 : 1;

    post.shares ? setShares(post.shares) : setShares(0);
    // console.log(following, following.includes(post.userid));

    if (following && following.includes(post.userid)) {
      setIsFollowing("following");
      setFollowBtnText("Unfollow");
    } else {
      setIsFollowing("not-following");
      setFollowBtnText("Follow");
    }

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
    const videoId = id[videosLimited.indexOf(cardDetails)];
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

  const updateShareOnDB = async () => {
    const videoId = id[videosLimited.indexOf(cardDetails)];
    setShares((curr) => curr + 1);
    cardDetails.shares = shares + 1;
    await firestore
      .collection("contest")
      .doc(videoId)
      .update({
        shares: cardDetails.shares + 1,
      });
  };

  const handleClickFollow = () => {
    if (following && following.includes(cardDetails.userid)) {
      updateFollowers("unfollow", cardDetails.userid);
      updateFollowing("unfollow", cardDetails.userid);
      setFollowBtnText("Follow");
      setIsFollowing("not-following");
    } else {
      updateFollowers("follow", cardDetails.userid);
      updateFollowing("follow", cardDetails.userid);
      setFollowBtnText("Unfollow");
      setIsFollowing("following");
    }
    // console.log({ cardDetails, userDetails });
  };

  const handleClickLikeMobile = () => {
    if (!auth().currentUser && vw < 700) {
      alert("Please Login to Like");
    }
  };
  const [reportModal, setReportModal] = useState(false);
  const [reportValue, setReportValue] = useState("Spam/Misleading");
  const [reportAlert, setReportAlert] = useState(false);

  const onClickReport = () => {
    setReportModal(true);
  };

  const handleCloseReport = async (newValue, post) => {
    setReportModal(false);
    if (newValue) {
      setReportValue(newValue);
      const videoId = id[videosLimited.indexOf(post)];
      let newReports = 0;
      await firestore
        .collection("report")
        .doc(videoId)
        .get()
        .then(async (res) => {
          const data = res.data();
          if (data.reports) {
            newReports = data.reports + 1;
          }
          await firestore
            .collection("report")
            .doc(videoId)
            .set({
              ...post,
              reports: newReports || 1,
            })
            .then(() => setReportAlert(true));
        });
    }
  };

  const handleCloseReportAlert = () => {
    setReportAlert(false);
  };

  const classes = useStyles();

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };

  return (
    <Container>
      <HeadingInfoContainer>
        <HeadingDescription>{props.heading}</HeadingDescription>
      </HeadingInfoContainer>
      <Content>
        <ThreeColumn>
          {videosLimited &&
            videosLimited.map((post, index) => (
              <Column key={index}>
                <Card
                  onClick={() => {
                    handleCardClick(post);
                    setShowModal(true);
                  }}
                >
                  <Image>
                    {post.thumbnail ? (
                      <img
                        className="thumbnail"
                        src={post.thumbnail}
                        alt={post.title}
                      />
                    ) : (
                      <VideoThumbnail
                        videoUrl={post.videoUrl}
                        snapshotAtTime={1}
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
              <ModalContent
                ref={wrapperRef}
                onClick={(e) => e.stopPropagation()}
                className="video-player"
              >
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
                        tw="p-1 ml-auto bg-transparent  border-0 text-black float-right text-xl leading-none font-semibold outline-none focus:outline-none"
                      >
                        <CloseIcon tw="cursor-pointer text-black h-5 w-6 text-xl block outline-none border-solid focus:outline-none" />
                      </button>
                    </span>
                  </div>
                  {/*body*/}
                  <div tw="relative p-2 flex-auto">
                    <div tw="text-gray-600 text-lg leading-relaxed bg-black">
                      <div class="player">
                        {showModal ? (
                          <ReactPlayer
                            config={{
                              file: {
                                attributes: {
                                  disablePictureInPicture: true,
                                  controlsList: "nodownload",
                                },
                              },
                            }}
                            url={cardDetails.videoUrl}
                            controls={true}
                            playing={true}
                            width="100%"
                            height={vw < 730 ? ((vw - 60) * 36) / 64 : 360}
                          />
                        ) : null}
                      </div>
                      <div tw="pl-5 pb-4 text-base text-white">
                        <a href="#" class="author-link">
                          {author}
                        </a>{" "}
                        {auth().currentUser ? (
                          <button
                            onClick={handleClickFollow}
                            href="#"
                            disabled={cardDetails.userid === uid}
                            class={`video-follow-btn ${
                              cardDetails.userid === uid
                                ? "disabled-follow-btn"
                                : ""
                            } ${isFollowing}`}
                          >
                            {followBtnText}
                          </button>
                        ) : null}
                      </div>
                    </div>
                    <div tw="flex mt-2 pl-2">
                      <div class="video-actions">
                        <Tooltip
                          placement="bottom"
                          className="tooltip-top"
                          title={
                            disabled
                              ? "Login to like"
                              : likeBtn === "clicked"
                              ? "Unlike"
                              : "Like"
                          }
                        >
                          <div
                            onClick={handleClickLikeMobile}
                            className="icon-container"
                          >
                            <IconButton
                              disabled={disabled}
                              onClick={handleClickLike}
                              className="icon-btn"
                            >
                              <LikeIcon className={likeBtn} tw="w-4 mr-1" />{" "}
                            </IconButton>
                            <span class="video-like-count">{likes}</span>
                          </div>
                        </Tooltip>
                        <div className="icon-container comments-icon">
                          <IconButton className="icon-btn">
                            <Comment tw="w-4 mr-1" />{" "}
                          </IconButton>
                          <span class="video-like-count">{comments}</span>
                        </div>{" "}
                        <div className="icon-container">
                          <IconButton
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={handleClickShare}
                            className="icon-btn"
                          >
                            <Share tw="w-4 mr-1" />{" "}
                          </IconButton>
                          <span class="video-like-count">{shares}</span>
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
                          <Button onClick={onClickReport} className="icon-btn">
                            <Report tw="w-4 mr-1" />{" "}
                            <span class="reporttxt">Report</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ModalContent>
              {Boolean(anchorEl) ? (
                <ShareModal
                  title={cardDetails.title}
                  description={cardDetails.description}
                  setShareFlag={setShareFlag}
                  anchorEl={anchorEl}
                  setAnchorEl={setAnchorEl}
                  shareUrl={cardDetails.videoUrl}
                />
              ) : null}
              <ReportDialog
                classes={{
                  paper: classes.paper,
                }}
                id="report-menu"
                keepMounted
                open={reportModal}
                onClose={handleCloseReport}
                value={reportValue}
                post={cardDetails}
              />
            </ModalContainer>
            <OutModal></OutModal>
          </>
        ) : null}

        <div className="more-video-btn">
          <Button
            className="more-btn"
            onClick={() => {
              navigate("/trending");
            }}
          >
            More Videos
          </Button>
        </div>
      </Content>
      <Snackbar
        open={reportAlert}
        autoHideDuration={6000}
        onClose={handleCloseReportAlert}
      >
        <Alert onClose={handleCloseReportAlert} severity="success">
          The video has been reported, our team will review it within 24 hours!
        </Alert>
      </Snackbar>
    </Container>
  );
};

const ShareModal = ({
  shareUrl,
  setAnchorEl,
  anchorEl,
  setShareFlag,
  title,
  description,
}) => {
  const handleClose = () => {
    setAnchorEl(null);
  };

  const whatsappRef = useRef(null);
  const facebookRef = useRef(null);
  const twitterRef = useRef(null);
  const linkedinRef = useRef(null);
  const telegramRef = useRef(null);

  let capitalizedTitle = title.charAt().toUpperCase() + title.slice(1);

  const handleItemClick = (e) => {
    setShareFlag(true);
    handleClose();
    e.stopPropagation();
  };

  return (
    <Menu
      id="simple-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      <MenuItem
        onClick={(e) => {
          whatsappRef.current.click();
          handleItemClick(e);
        }}
      >
        <WhatsappShareButton
          ref={whatsappRef}
          url={shareUrl}
          openShareDialogOnClick
          title={capitalizedTitle}
        >
          <WhatsappIcon size={32} round={true} />
        </WhatsappShareButton>
      </MenuItem>
      <MenuItem
        onClick={(e) => {
          facebookRef.current.click();
          handleItemClick(e);
        }}
      >
        <FacebookShareButton
          ref={facebookRef}
          url={shareUrl}
          openShareDialogOnClick
          quote={`${capitalizedTitle} | ${description}`}
        >
          <FacebookIcon size={32} round={true} />
        </FacebookShareButton>
      </MenuItem>
      <MenuItem
        onClick={(e) => {
          twitterRef.current.click();
          handleItemClick(e);
        }}
      >
        <TwitterShareButton
          ref={twitterRef}
          url={shareUrl}
          openShareDialogOnClick
          title={capitalizedTitle}
        >
          <TwitterIcon size={32} round={true} />
        </TwitterShareButton>
      </MenuItem>
      <MenuItem
        onClick={(e) => {
          linkedinRef.current.click();
          handleItemClick(e);
        }}
      >
        <LinkedinShareButton
          ref={linkedinRef}
          url={shareUrl}
          openShareDialogOnClick
          title={capitalizedTitle}
          summary={description}
        >
          <LinkedinIcon size={32} round={true} />
        </LinkedinShareButton>
      </MenuItem>
      <MenuItem
        onClick={(e) => {
          telegramRef.current.click();
          handleItemClick(e);
        }}
      >
        <TelegramShareButton
          ref={telegramRef}
          url={shareUrl}
          openShareDialogOnClick
          title={capitalizedTitle}
        >
          <TelegramIcon size={32} round={true} />
        </TelegramShareButton>
      </MenuItem>
    </Menu>
  );
};

const options = [
  "Spam/Misleading",
  "Abusive",
  "Harmful",
  "Illegal",
  "Inappropriate",
  "Copyright Infringement",
];

const ReportDialog = (props) => {
  const { onClose, post, value: valueProp, open, ...other } = props;
  const [value, setValue] = React.useState(valueProp);
  const radioGroupRef = React.useRef(null);

  useEffect(() => {
    if (!open) {
      setValue(valueProp);
    }
  }, [valueProp, open]);

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    onClose(value, post);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      onEntering={handleEntering}
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">Report Content</DialogTitle>
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label="ringtone"
          name="ringtone"
          value={value}
          onChange={handleChange}
        >
          {options.map((option) => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ReportDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    width: "80%",
    maxHeight: 435,
  },
}));
