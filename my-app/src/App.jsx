import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import "./styles.scss";
import LoginPage from "./pages/LoginPage.jsx";

const App = () => {
  return(
    <div id="main-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<h1>Home Page</h1>} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;