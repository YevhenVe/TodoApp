import React, { useContext } from "react";
import Signout from "../signout/Signout";
import RemoveBg from "../removeBg/RemoveBg";
import UserContext from "../../context/UserContext";
import CustomBackground from "../customBackground/CustomBackground";
import "./DropDownMenu.scss";

const DropDownMenu = ({ className }) => {
    const { user } = useContext(UserContext);

    return (
        <div className={`menu-hidden ${className}`}>
            <div className="menu-wrapper">
                <div className="user-name">{user?.displayName}</div>
                <div className="user-email">{user?.email}</div>
                <CustomBackground />
                <RemoveBg />
                <Signout />
            </div>
        </div>
    );
};

export default DropDownMenu;
