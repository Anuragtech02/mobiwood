import React, { useState, createContext, useContext, useEffect } from "react";
import AuthContext from "./AuthContext";
import { firestore } from "../firebase.config";
import { VideosContext } from "./VideosContext";

export const UserContext = createContext({});

const UserContextProvider = ({ children }) => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [myVideos, setMyVideos] = useState([]);

  const { userDetails, uid } = useContext(AuthContext);
  // const { videos } = useContext(VideosContext);

  useEffect(() => {
    setLikedVideos(userDetails.likedVideos || []);
  }, [userDetails]);

  useEffect(() => {
    const videosFromSession = JSON.parse(sessionStorage.getItem("videos"));
    const fetchMyVideos = async () => {
      const db = firestore;
      const collectionRef = db.collection("user").doc(uid).collection("videos");
      const vids = await collectionRef.get();
      vids.forEach((vid) => {
        if (vid.data().videoUrl) {
          const temp = videosFromSession.filter(
            (currVid) => currVid.videoUrl === vid.data().videoUrl
          );
          setMyVideos(temp);
        }
      });
    };
    if (uid && videosFromSession) {
      fetchMyVideos();
    }
  }, [uid]);

  const updateLikes = async (videoId, action) => {
    let newLikes;
    if (action === "like") {
      newLikes = [...likedVideos, videoId];
    } else {
      newLikes = likedVideos.filter((vid) => vid !== videoId);
    }
    setLikedVideos(newLikes);
    await firestore.collection("user").doc(uid).update({
      likedVideos: newLikes,
    });
  };

  return (
    <UserContext.Provider value={{ likedVideos, updateLikes, myVideos }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
