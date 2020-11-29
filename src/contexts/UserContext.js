import React, { useState, createContext, useContext } from "react";
import AuthContext from "./AuthContext";
import { firestore } from "../firebase.config";

export const UserContext = createContext({});

const UserContextProvider = ({ children }) => {
  const [likedVideos, setLikedVideos] = useState([]);

  const { userDetails, uid } = useContext(AuthContext);

  React.useEffect(() => {
    setLikedVideos(userDetails.likedVideos || []);
  }, [userDetails]);

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
    <UserContext.Provider value={{ likedVideos, updateLikes }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
