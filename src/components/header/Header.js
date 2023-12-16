import React, { useContext } from "react";
import UserContext from "../../context/UserContext";
import ChangeStyleContext from "../../context/ChangeStyleContext";
import DdMenuContext from "../../context/DdMenuContext";
import UserPhoto from "../user/userPhoto/UserPhoto";
import StylesChanger from "../stylesChanger/StylesChanger";
import "./Header.scss";

const Header = () => {
    const { user } = useContext(UserContext);
    const { data } = useContext(ChangeStyleContext);
    const { isMenuClosed, setIsMenuClosed } = useContext(DdMenuContext);

    return (
        <div className={`header-wrapper ${data ? "no-blur" : ""}`}>
            {user ? (
                <>
                    <StylesChanger />
                    <UserPhoto onClick={() => setIsMenuClosed(!isMenuClosed)} />
                </>
            ) : (
                ""
            )}
        </div>
    );
};

export default Header;
