import React, { useContext, useState, useEffect } from "react";
import { UserContext, ChangeStyleContext, BlureLevelContext } from "context/Context";
import User from "../../components/user/User";
import Records from "../../components/records/Records";
import Auth from "../../components/auth/Auth";
import UsersData from "../../components/usersData/UsersData";
import FavoriteLink from "components/favoriteLink/FavoriteLink";
import "./PersonalAccountPage.scss";

const PersonalAccountPage = () => {
    const { user } = useContext(UserContext);
    const { blurLevel } = useContext(BlureLevelContext);
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
        <div
            className={`account-wrapper ${data && user ? "non-styled" : ""}`}
            style={{
                backdropFilter: data && user ? `blur(0px)` : `blur(${blurLevel}px)`,
            }}
        >
            <>
                {user ? (
                    <>
                        <UsersData />
                        <div className="fixed-account-content">
                            <div className="time">{currentTime}</div>
                            <div className="current-date">Today is: {dayOfWeek}</div>
                            <div className="current-date">
                                {dateWithoutDay} {new Date().getFullYear()}
                            </div>
                            <User />
                            <FavoriteLink />
                        </div>
                        <div className="account-content">
                            <Records />
                        </div>
                    </>
                ) : (
                    <div className="wellcome-page">
                        <div className="wellcome-text">Hello friend, please</div>
                        <Auth />
                    </div>
                )}
            </>
        </div>
    );
};

export default PersonalAccountPage;
