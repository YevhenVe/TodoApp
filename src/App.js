import React, { useContext } from "react";
import UserContext from "./context/UserContext";
import BackgroundContext from "./context/BackgroundContext";
import DdMenuContext from "./context/DdMenuContext";
import Header from "./components/header/Header";
import Account from "./pages/account/Account";
import ImageUploadProgresss from "./components/imageUploadProgress/ImageUploadProgress";
import DropDownMenu from "./components/dropDownMenu/DropDownMenu";
import "./App.scss";

const App = () => {
    const { uploadedImage } = useContext(BackgroundContext);
    const { user } = useContext(UserContext);
    const { openDdMenu } = useContext(DdMenuContext);

    return (
        <div
            className="app-wrapper"
            style={{
                backgroundImage: `url(${user ? (uploadedImage ? uploadedImage : "https://source.unsplash.com/random/1920x1080/?grey") : "https://source.unsplash.com/random/1920x1080/?grey"})`,
            }}
        >
            {user && <Header />}
            <DropDownMenu className={openDdMenu ? "drop-down-menu-wrapper-show" : ""} />
            <ImageUploadProgresss />
            <div className="app-account-wrapper">
                <Account />
            </div>
        </div>
    );
};

export default App;
