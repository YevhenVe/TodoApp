import React, { useContext } from "react";
import UserContext from "../../context/UserContext";
import DdMenuContext from "../../context/DdMenuContext";
import UserPhoto from "../user/userPhoto/UserPhoto";
import "./Header.scss";

const Header = () => {
    const { user } = useContext(UserContext);
    const { isMenuClosed, setIsMenuClosed } = useContext(DdMenuContext);

    return (
        <div className="header-wrapper">
            {user ? (
                <>
                    <UserPhoto onClick={() => setIsMenuClosed(!isMenuClosed)} />
                </>
            ) : (
                ""
            )}
        </div>
    );
};

export default Header;
