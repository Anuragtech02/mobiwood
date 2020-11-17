import React, { useEffect, useRef, useState } from "react";
import tw from "twin.macro";
import ReactPlayer from "react-player";
import { css } from "styled-components/macro"; //eslint-disable-line
import { ReactComponent as CloseIcon } from "feather-icons/dist/icons/x.svg";
import { firestore } from "../../firebase.config";
// import firebase from "firebase";
import { ReactComponent as LikeIcon } from "feather-icons/dist/icons/heart.svg";
import VideoThumbnail from "react-video-thumbnail";
import "../css/master.css";

const Container = tw.div`relative`;
const Content = tw.div` -mx-2 py-2`;
const ThreeColumn = tw.div`flex items-center flex-row flex-wrap`;
const Column = tw.div`mt-4 w-1/2 sm:w-1/3 xl:w-1/4`;

const HeadingInfoContainer = tw.div`flex flex-col items-start ml-0`;
const HeadingDescription = tw.p`mt-4 font-bold text-3xl text-gray-900 text-center max-w-sm`;

const Card = tw.div`mx-2 cursor-pointer`;
const Image = tw.div`bg-cover bg-center h-40width sm:h-28width lg:h-24width xl:h-18width rounded`;

const ModalContainer = tw.div`justify-center m-4 items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none`;
const OutModal = tw.div`opacity-75 fixed inset-0 z-40 bg-black`;
const ModalContent = tw.div`relative w-auto my-6 mx-auto max-w-3xl`;

export default (props) => {
  const [showModal, setShowModal] = useState(false);
  const [vids, setVids] = useState(null);
  const [id, setId] = useState(null); //eslint-disable-line
  const [author, setAuthor] = useState(null);

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

  async function getVidData() {
    let tmp = [];
    let ids = [];
    const vidRef = firestore
      .collection("contest")
      .orderBy("uploadTime", "desc")
      .limit(40);
    const activeref = await vidRef.get();
    activeref.forEach((collection) => {
      tmp.push(collection.data());
      ids.push(collection.id);
    });
    setVids(tmp);
    setId(ids);
  }

  useEffect(() => {
    getVidData();
  }, []);

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
    setCardDetails(post);
    firestore.collection("user").doc(post.userid).get().then((vals) => setAuthor(vals.data().name));
  }

  return (
    <Container>
      <HeadingInfoContainer>
        <HeadingDescription>{props.heading}</HeadingDescription>
      </HeadingInfoContainer>
      <Content>
        <ThreeColumn>
          {vids &&
            vids.map((post, index) => (
              <Column key={index}>
                <Card
                  onClick={() => {
                    handleCardClick(post);
                    setShowModal(true);
                    addView(index);
                  }}
                >
                  <Image>
				  <VideoThumbnail videoUrl={post.videoUrl} snapshotAtTime="1" />
                  </Image>
                  {/* const Image = tw.div`bg-cover bg-center h-40width sm:h-28width lg:h-24width xl:h-18width rounded overflow-hidden`; */}
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
                  <div tw="flex items-start justify-between py-3 px-5 border-b border-solid border-gray-300 rounded-t">
                    <h3 tw="text-xl font-semibold">{cardDetails.title}</h3>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setCardDetails({});
                        setAuthor(null);
                      }}
                      tw="p-1 ml-auto bg-transparent opacity-75 border-0 text-black float-right text-xl leading-none font-semibold outline-none focus:outline-none"
                    >
                      <CloseIcon tw="cursor-pointer text-black h-5 w-6 text-xl block outline-none focus:outline-none" />
                    </button>
                  </div>
                  {/*body*/}
                  <div tw="relative p-6 flex-auto">
                    <div tw="my-4 text-gray-600 text-lg leading-relaxed">
                      <ReactPlayer
                        url={cardDetails.videoUrl}
                        controls={true}
                        playing={true}
                        width={vw < 730 ? vw - 60 : 640}
                        height={vw < 730 ? ((vw - 60) * 36) / 64 : 360}
                      />
                      <div>By {author}</div>
                      <LikeIcon tw="my-2"/>
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
