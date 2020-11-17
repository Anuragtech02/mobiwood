import React from "react";
import { auth } from "../../firebase.config";
import { navigate } from "hookrouter";

const Logout = () => {
  const onAuthStateChanged = (u) => {
    if (!(u && u.uid)) {
      navigate("/");
    }
  };

  React.useEffect(() => {
    // Uncomment after adding and setting up firebase for the project
    const subscriber = auth.onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);
  return (
    <button
      onClick={() => {
        auth.signOut();
      }}
    >
      Sign Out
    </button>
  );
};

export default Logout;
