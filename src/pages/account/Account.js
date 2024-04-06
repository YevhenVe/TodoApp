import React, { useContext, useState, useEffect } from "react";
import { UserContext, ChangeStyleContext } from "context/Context";
import User from "../../components/user/User";
import Records from "../../components/records/Records";
import Auth from "../../components/auth/Auth";
import ImageList from "../../components/imageList/ImageList";
import UsersData from "../../components/usersData/UsersData";
import "./Account.scss";

const Account = () => {
    const { user } = useContext(UserContext);
    const { data } = useContext(ChangeStyleContext);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    const options = { weekday: "long", month: "long", day: "numeric" };
    const currentDate = new Date().toLocaleDateString("en-US", options);
    const [dayOfWeek, dateWithoutDay] = currentDate.split(", ");

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        }, 60000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className={`account-wrapper ${data && user ? "non-styled" : ""}`}>
            <>
                {user ? (
                    <>
                        <div className="fixed-account-content">
                            <UsersData />
                            <div className="time">{currentTime}</div>
                            <div className="current-date">Today is: {dayOfWeek}</div>
                            <div className="current-date">
                                {dateWithoutDay} {new Date().getFullYear()}
                            </div>
                            <User />
                        </div>
                        <div className="account-content">
                            <Records />
                        </div>
                        <ImageList />
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
