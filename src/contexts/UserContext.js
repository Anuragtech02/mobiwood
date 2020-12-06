import React, { useState, createContext, useContext, useEffect } from "react";
import AuthContext from "./AuthContext";
import { firestore } from "../firebase.config";
import { VideosContext } from "./VideosContext";

export const UserContext = createContext({});

const UserContextProvider = ({ children }) => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [myVideos, setMyVideos] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const { userDetails, uid } = useContext(AuthContext);
  // const { videos } = useContext(VideosContext);

  useEffect(() => {
    if (userDetails) {
      setLikedVideos(userDetails.likedVideos || []);
      setFollowers(userDetails.followers || []);
      setFollowing(userDetails.following || []);
    }
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

  const updateFollowers = async (action, userId) => {
    let newFollowers = followers;
    if (action === "follow") {
      setFollowers([...followers, userId]);
      newFollowers = [...newFollowers, userId];
    } else {
      if (followers && followers.length) {
        newFollowers = followers.filter((follower) => follower !== userId);
        setFollowers(newFollowers);
      } else {
        setFollowers([]);
        newFollowers = [];
      }
    }
    await firestore.collection("user").doc(userId).update({
      followers: newFollowers,
    });
  };

  const updateFollowing = async (action, userId) => {
    let newFollowing = following;
    if (action === "follow") {
      setFollowing([...following, userId]);
      newFollowing = [...newFollowing, userId];
    } else {
      if (following && following.length) {
        newFollowing = following.filter((follower) => follower !== userId);
        setFollowing(newFollowing);
      } else {
        setFollowing([]);
        newFollowing = [];
      }
    }
    await firestore.collection("user").doc(uid).update({
      following: newFollowing,
    });
  };

  return (
    <UserContext.Provider
      value={{
        likedVideos,
        updateLikes,
        myVideos,
        followers,
        updateFollowers,
        following,
        updateFollowing,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
