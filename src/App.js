import React, { useContext } from "react";
import UserContext from "./context/UserContext";
import BackgroundContext from "./context/BackgroundContext";
import DdMenuContext from "./context/DdMenuContext";
import Header from "./components/header/Header";
import DefoultBackground from "./assets/bg.jpg";
import Account from "./pages/account/Account";
import ImageUploadProgresss from "./components/imageUploadProgress/ImageUploadProgress";
import DropDownMenu from "./components/dropDownMenu/DropDownMenu";
import "./App.scss";

const App = () => {
    const { uploadedImage } = useContext(BackgroundContext);
    const { user } = useContext(UserContext);
    const { isMenuClosed, setIsMenuClosed } = useContext(DdMenuContext);

    return (
        <div
            className="app-wrapper"
            style={{
                backgroundImage: `url(${user ? (uploadedImage ? uploadedImage : DefoultBackground) : DefoultBackground})`,
            }}
        >
            {user && <Header />}
            <DropDownMenu
                onClick={() => setIsMenuClosed(true)}
                className={!isMenuClosed ? "menu-visible" : ""}
                adClassName={!isMenuClosed ? "dd-menu-wrapper-visible" : ""}
            />
            <ImageUploadProgresss />
            <div className="app-account-wrapper">
                <Account />
            </div>
        </div>
    );
};

export default App;
