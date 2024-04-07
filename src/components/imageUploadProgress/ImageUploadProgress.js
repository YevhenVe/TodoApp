import React, { useContext } from "react";
import { BackgroundContext, UserImageContext } from "context/Context";
import "./ImageUploadProgress.scss";

const ImageUploadProgress = () => {
    const { progress, uploading } = useContext(BackgroundContext);
    const { userProgress, uploadingUserImage } = useContext(UserImageContext);

    return (
        <>
            {uploading && (
                <div className="image-upload-progress-wrapper">
                    <span>Background</span> <span>{progress}%</span>
                </div>
            )}
            {!uploadingUserImage && (
                <div className="image-upload-progress-wrapper">
                    <span>User image</span> <span>{userProgress}%</span>
                </div>
            )}
        </>
    );
};

export default ImageUploadProgress;
