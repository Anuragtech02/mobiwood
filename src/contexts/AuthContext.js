import React from "react";
import firebase from "firebase";
import "firebase/auth";

const AuthContext = React.createContext();

export const AuthProvider = (props) => {
  const [user, setUser] = React.useState({});
  const [uid, setUid] = React.useState("");
  const [userDetails, setUserDetails] = React.useState({});

  const db = firebase.firestore().collection("user");

  const onAuthStateChanged = async (u) => {
    if (u) {
      setUser(u);
      setUid(u.uid);
      await db
        .doc(u.uid)
        .get()
        .then((vals) => {
          setUserDetails(vals.data());
        });
    }
  };

  React.useEffect(() => {
    // Uncomment after adding and setting up firebase for the project
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    return subscriber;
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, uid, setUid, userDetails }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
