import React from "react";
import ReactDOM from "react-dom/client";
import { UserProvider } from "./context/UserContext";
import { BackgroundProvider } from "./context/BackgroundContext";
import { DdMenuProvider } from "./context/DdMenuContext";
import { ChangeStyleProvider } from "./context/ChangeStyleContext";
import App from "./App";
import "./index.scss";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    // <React.StrictMode>
    <UserProvider>
        <DdMenuProvider>
            <ChangeStyleProvider>
                <BackgroundProvider>
                    <App />
                </BackgroundProvider>
            </ChangeStyleProvider>
        </DdMenuProvider>
    </UserProvider>
    // </React.StrictMode>
);
