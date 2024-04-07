import React, { useContext } from "react";
import { UserContext, DdMenuContext, UserImageContext } from "context/Context";
import "./UserPhoto.scss";

const UserPhoto = ({ onClick }) => {
    const { user } = useContext(UserContext);
    const { uploadedUserImage } = useContext(UserImageContext);
    const { isMenuClosed } = useContext(DdMenuContext);

    return (
        <div
            className="user-photo-wrapper"
            onClick={onClick}
        >
            {uploadedUserImage ? (
                <img
                    className="custom-user-image"
                    src={uploadedUserImage}
                    alt="avatar"
                    referrerPolicy="no-referrer"
                />
            ) : (
                <img
                    src={user?.photoURL}
                    alt="avatar"
                    referrerPolicy="no-referrer"
                />
            )}
            <div className={`arrow-icon-style ${isMenuClosed ? "rotate" : ""}`} />
        </div>
    );
};

export default UserPhoto;
