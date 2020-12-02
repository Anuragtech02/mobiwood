import React, { useState, createContext } from "react";
import { firestore } from "../firebase.config";

export const VideosContext = createContext({});

const VideosContextProvider = ({ children }) => {
  const [videosLimited, setVideosLimited] = useState([]);
  const [videos, setVideos] = useState([]);
  const [id, setId] = useState([]);

  React.useEffect(() => {
    const initialCount = sessionStorage.getItem("count");
    const timestamp = sessionStorage.getItem("lastLoad");
    if (!initialCount) sessionStorage.setItem("count", 0);
    if (!timestamp) sessionStorage.setItem("lastLoad", new Date());
    const difference =
      Math.floor(new Date() - new Date(timestamp)) / (1000 * 60 * 60 * 24);
    // console.log(Math.floor(difference / (1000 * 60 * 60 * 24)));
    const fetchLimitedVideos = async () => {
      const count = parseInt(sessionStorage.getItem("count"));
      let vids = [];
      let tmp = [];
      let ids = [];
      const vidRef = firestore
        .collection("contest")
        .orderBy("uploadTime", "desc");

      if (count >= 3 || !initialCount || !timestamp || difference > 0) {
        console.log("Query Made from context");
        const activeref = await vidRef.get();
        activeref.forEach((collection) => {
          vids.push(collection.data());
          ids.push(collection.id);
        });
        setVideos(vids);
        setId(ids);
        vids.forEach((vid, i) => {
          if (i < 16) {
            tmp.push(vid);
          }
        });
        setVideosLimited(tmp);
        sessionStorage.setItem("count", 0);
        sessionStorage.setItem("videosLimited", JSON.stringify(tmp));
        sessionStorage.setItem("videos", JSON.stringify(vids));
        sessionStorage.setItem("id", JSON.stringify(ids));
        sessionStorage.setItem("lastLoad", new Date());
      } else {
        sessionStorage.setItem("count", parseInt(count) + 1);
        const tempVids = sessionStorage.getItem("videosLimited");
        const totalVids = sessionStorage.getItem("videos");
        const vidIds = sessionStorage.getItem("id");
        setVideosLimited(JSON.parse(tempVids));
        setVideos(JSON.parse(totalVids));
        setId(JSON.parse(vidIds));
      }
    };
    fetchLimitedVideos();
  }, []);

  return (
    <VideosContext.Provider value={{ videosLimited, videos, id }}>
      {children}
    </VideosContext.Provider>
  );
};

export default VideosContextProvider;
