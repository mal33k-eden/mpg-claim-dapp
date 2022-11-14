import React from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App";
import { MoralisProvider } from "react-moralis";
import("./polyfill");

const root = ReactDOM.createRoot(document.getElementById("root"));
const appId = "mx084cQh2zoH1A60yjbSA8ZGczXm7RIUb8xk2AAw";
const serverUrl = "https://531zsrpxyfoc.usemoralis.com:2053/server";

root.render(
  <React.StrictMode>
    <MoralisProvider appId={appId} serverUrl={serverUrl}>
      <App />
      <ToastContainer />
    </MoralisProvider>
  </React.StrictMode>
);
