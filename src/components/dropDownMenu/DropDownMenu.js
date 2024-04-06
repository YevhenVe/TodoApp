import React, { useContext, useEffect } from "react";
import Signout from "../signout/Signout";
import RemoveBg from "../removeBg/RemoveBg";
import StylesChanger from "../stylesChanger/StylesChanger";
import { UserContext } from "context/Context";
import CustomBackground from "../customBackground/CustomBackground";
import UserImageUpload from "../userImageUpload/userImageUpload";
import CustomButton from "../customButton/CustomButton";
import UserRole from "../userRole/UserRole";
import { getDatabase, ref, onValue } from "firebase/database";
import "./DropDownMenu.scss";

const DropDownMenu = ({ className, adClassName, onClick }) => {
    const { user, setRole, role, showAllUsers, setShowAllUsers } = useContext(UserContext);

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
                    {role && <UserRole />}
                    <StylesChanger />
                    <CustomBackground />
                    <RemoveBg />
                    {role && (
                        <CustomButton
                            onClick={() => setShowAllUsers(!showAllUsers)}
                            label="Show all users"
                        />
                    )}
                    <Signout />
                </div>
            </div>
        </>
    );
};

export default DropDownMenu;
