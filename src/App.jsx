import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import About from "../pages/About.jsx";
import Home from "../pages/Home.jsx";
import Profile from "../pages/Profile.jsx";
import Signin from "../pages/SignIn.jsx";
import Signup from "../pages/Signup.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
