import React, { useState, createContext } from "react";
import { firestore } from "../firebase.config";

export const VideosContext = createContext({});

const VideosContextProvider = ({ children }) => {
  const [videosLimited, setVideosLimited] = useState([]);
  const [videos, setVideos] = useState([]);
  const [id, setId] = useState([]);

  React.useEffect(() => {
    const fetchLimitedVideos = async () => {
      let vids = [];
      let tmp = [];
      let ids = [];
      const vidRef = firestore
        .collection("contest")
        .orderBy("uploadTime", "desc");
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
