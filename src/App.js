import React, { useContext } from "react";
import { UserContext, BackgroundContext, DdMenuContext } from "context/Context";
import Header from "./components/header/Header";
import DefaultBackground from "./assets/bg.jpg";
import PersonalAccountPage from "./layouts/personalAccountPage/PersonalAccountPage";
import ImageUploadProgress from "./components/imageUploadProgress/ImageUploadProgress";
import DropDownMenu from "./components/dropDownMenu/DropDownMenu";
import "./App.scss";

const App = () => {
    const { backgroundImage } = useContext(BackgroundContext);
    const { user } = useContext(UserContext);
    const { isMenuClosed, setIsMenuClosed } = useContext(DdMenuContext);

    return (
        <div
            className="app-wrapper"
            style={{
                backgroundImage: `url(${user ? (backgroundImage ? backgroundImage : DefaultBackground) : DefaultBackground})`,
            }}
        >
            {user && <Header />}
            <DropDownMenu
                onClick={() => setIsMenuClosed(true)}
                className={!isMenuClosed ? "menu-visible" : ""}
                adClassName={!isMenuClosed ? "dd-menu-wrapper-visible" : ""}
            />
            <ImageUploadProgress />
            <div className="app-account-wrapper">
                <PersonalAccountPage />
            </div>
        </div>
    );
};

export default App;
