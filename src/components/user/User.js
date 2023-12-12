import React, { useContext } from "react";
import UserContext from "../../context/UserContext";
import "./User.scss";

const User = () => {
    const { user } = useContext(UserContext);
    const userName = user?.displayName ? user.displayName.split(" ")[0] : "";

    return (
        <div className="user-wrapper">
            <div>Hey, {userName}.</div>
        </div>
    );
};

export default User;
