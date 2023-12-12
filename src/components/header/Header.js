import React, { useContext } from "react";
import UserContext from "../../context/UserContext";
import DdMenuContext from "../../context/DdMenuContext";
import UserPhoto from "../user/userPhoto/UserPhoto";
import "./Header.scss";

const Header = () => {
    const { user } = useContext(UserContext);
    const { openDdMenu, setOpenDdMenu } = useContext(DdMenuContext);

    return (
        <div className="header-wrapper">
            {user ? (
                <>
                    <UserPhoto onClick={() => setOpenDdMenu(!openDdMenu)} />
                </>
            ) : (
                ""
            )}
        </div>
    );
};

export default Header;
