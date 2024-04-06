import React from "react";
import ReactDOM from "react-dom/client";
import { ContextProvider } from "./context/Context";
import App from "./App";
import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <ContextProvider>
        <App />
    </ContextProvider>
);
