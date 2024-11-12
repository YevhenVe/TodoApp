import React, { useContext, useEffect } from "react";
import { UserContext } from "context/Context";
import "./User.scss";

const User = () => {
    const { user } = useContext(UserContext);
    const userName = user?.displayName ? user.displayName.split(" ")[0] : "";
    //
    useEffect(() => {
        // Check if the user is logged in and has a displayName
        if (user && user.displayName) {
            document.title = `${user.displayName} Start Page`;
        } else {
            document.title = "Personal Start Page";
        }
    }, []);

    return (
        <div className="user-wrapper">
            <div className="welcome-name">Hey, {userName}.</div>
        </div>
    );
};

export default User;
