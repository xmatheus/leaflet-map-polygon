// @src/main.jsx

import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import App from "./App";
import "leaflet/dist/leaflet.css"; // <- Leaflet styles
import "leaflet-draw/dist/leaflet.draw.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
