import React, { useContext } from "react";
import { UserContext, ChangeStyleContext, DdMenuContext } from "context/Context";
import UserPhoto from "../user/userPhoto/UserPhoto";
import "./Header.scss";
import Weather from "../weather/Weather";

const Header = () => {
    const { user } = useContext(UserContext);
    const { data } = useContext(ChangeStyleContext);
    const { isMenuClosed, setIsMenuClosed } = useContext(DdMenuContext);

    return (
        <div className={`header-wrapper ${data ? "no-blur" : ""}`}>
            <Weather />
            {user ? <UserPhoto onClick={() => setIsMenuClosed(!isMenuClosed)} /> : ""}
        </div>
    );
};

export default Header;
