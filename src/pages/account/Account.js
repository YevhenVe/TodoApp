import React, { useContext, useState, useEffect } from "react";
import UserContext from "../../context/UserContext";
import User from "../../components/user/User";
import Records from "../../components/records/Records";
import Auth from "../../components/auth/Auth";
import "./Account.scss";

const Account = () => {
    const { user } = useContext(UserContext);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        }, 60000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="account-wrapper">
            <>
                {user ? (
                    <>
                        <div className="fixed-account-content">
                            <div className="time">{currentTime}</div>
                            <User />
                        </div>
                        <div className="account-content">
                            <Records />
                        </div>
                    </>
                ) : (
                    <div className="wellcome-page">
                        <div className="wellcome-text">Hello unknown user, please</div>
                        <Auth />
                    </div>
                )}
            </>
        </div>
    );
};

export default Account;
