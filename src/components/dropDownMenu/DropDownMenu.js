import React, { useContext } from "react";
import Signout from "../signout/Signout";
import RemoveBg from "../removeBg/RemoveBg";
import StylesChanger from "../stylesChanger/StylesChanger";
import UserContext from "../../context/UserContext";
import CustomBackground from "../customBackground/CustomBackground";
import UserImageUpload from "../userImageUpload/userImageUpload";
import CustomButton from "../customButton/CustomButton";
import UserRole from "../userRole/UserRole";
import "./DropDownMenu.scss";

const DropDownMenu = ({ className, adClassName, onClick }) => {
    const { user, role } = useContext(UserContext);
    const { showAllUsers, setShowAllUsers } = useContext(UserContext);

    return (
        <>
            <div
                className={`dd-menu-wrapper ${adClassName}`}
                onClick={onClick}
            />
            <div className={`menu-hidden ${className}`}>
                <div className="menu-wrapper">
                    <UserImageUpload />
                    <div className="user-name">{user?.displayName}</div>
                    <div className="user-email">{user?.email}</div>
                    {role ? <UserRole /> : <></>}
                    <StylesChanger />
                    <CustomBackground />
                    <RemoveBg />
                    {role ? (
                        <CustomButton
                            onClick={() => setShowAllUsers(!showAllUsers)}
                            label="Show all users"
                        />
                    ) : (
                        <></>
                    )}
                    <Signout />
                </div>
            </div>
        </>
    );
};

export default DropDownMenu;
