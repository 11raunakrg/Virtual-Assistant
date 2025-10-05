import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { userDataContext } from "./context/userContext";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Customize from "./pages/customize";
import Customize2 from "./pages/customize2";
import Home from "./pages/home";

const App = () => {
  const { userData, loading } = useContext(userDataContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          !userData ? (
            <Navigate to="/login" />
          ) : userData.assistantImage && userData.assistantName ? (
            <Home />
          ) : (
            <Navigate to="/customize" />
          )
        }
      />

      <Route
        path="/signup"
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />
      <Route
        path="/login"
        element={!userData ? <LogIn /> : <Navigate to="/" />}
      />
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to="/login" />}
      />

      <Route
        path="/customize2"
        element={userData ? <Customize2 /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

export default App;
