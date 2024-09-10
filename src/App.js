import React, { useContext } from "react";
import { UserContext, BackgroundContext, DdMenuContext } from "context/Context";
import Header from "./components/header/Header";
import DefaultBackground from "./assets/bg.jpg";
import PersonalAccountPage from "./layouts/personalAccountPage/PersonalAccountPage";
import ImageUploadProgress from "./components/imageUploadProgress/ImageUploadProgress";
import DropDownMenu from "./components/dropDownMenu/DropDownMenu";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ImageGallery from "pages/imageGallery/ImageGallery";
import ProtectedRoute from "components/protectedRoute/ProtectedRoute";
import "./App.scss";

const App = () => {
    const { backgroundImage } = useContext(BackgroundContext);
    const { user } = useContext(UserContext);
    const { isMenuClosed, setIsMenuClosed } = useContext(DdMenuContext);

    return (
        <Router>
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
            <Routes>
                <Route
                    path={`/gallery/${user?.uid}`}
                    element={
                        <ProtectedRoute>
                            <ImageGallery />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
