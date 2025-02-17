import React, { useContext, useEffect } from "react";
import Signout from "../signout/Signout";
import RemoveBackground from "../removeBackground/RemoveBackground";
import StylesChanger from "../stylesChanger/StylesChanger";
import { DdMenuContext, UserContext } from "context/Context";
import { ReactComponent as GalleryIcon } from "../../assets/gallery.svg";
import CustomBackground from "../customBackground/CustomBackground";
import UserImageUpload from "../userImageUpload/userImageUpload";
import CustomButton from "../customButton/CustomButton";
import UserRole from "../userRole/UserRole";
import { getDatabase, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import "./DropDownMenu.scss";
import { signOut } from "firebase/auth";

const DropDownMenu = ({ className, adClassName, onClick }) => {
    const { user, setRole, role, showAllUsers, setShowAllUsers } = useContext(UserContext);
    const { isMenuClosed, setIsMenuClosed } = useContext(DdMenuContext);

    const isIOSDevice = () => /iPad|iPhone|iPod/i.test(navigator.userAgent);

    useEffect(() => {
        const handleChange = (snapshot) => {
            setRole(snapshot.val());
        };
        const databaseRef = ref(getDatabase(), `users/${user?.uid}/user_role/user_role`);
        const unsubscribe = onValue(databaseRef, handleChange);
        return () => {
            unsubscribe();
        };
    }, [setRole, user]);

    const navigate = useNavigate();
    const handleClick = () => {
        if (user?.uid) {
            navigate(`/gallery/${user.uid}`);
            setIsMenuClosed(true);
        } else {
            console.error("User ID is not available");
        }
    };

    return (
        <>
            <div
                className={`dd-menu-wrapper ${adClassName}`}
                onClick={onClick}
            />
            <div className={`menu-hidden ${className} ${isIOSDevice() ? "isIOSDevice" : ""}`}>
                <div className="menu-wrapper">
                    <UserImageUpload />
                    <div className="user-name">{user?.displayName}</div>
                    <div className="user-email">{user?.email}</div>
                    {role && <UserRole />}
                    <StylesChanger />
                    <CustomBackground />
                    <RemoveBackground />
                    <CustomButton
                        onClick={handleClick}
                        label="My Gallery"
                        icon={<GalleryIcon />}
                    />
                    {role && (
                        <CustomButton
                            onClick={() => setShowAllUsers(!showAllUsers)}
                            label="Show all users"
                        />
                    )}
                    <div className="signout-button">
                        <Signout />
                    </div>
                </div>
            </div>
        </>
    );
};

export default DropDownMenu;
