import React from "react";
import './App.css';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login.js";
import Register from "./Register.js";
import Dashboard from "./Dashboard.js";
import AddOKR from "./addOKR.js";
import Analytics from "./Analytics.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-okr" element={<AddOKR />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Router>
  );
}

export default App;