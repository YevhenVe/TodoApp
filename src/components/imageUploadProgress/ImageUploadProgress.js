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
                    <p>Background {progress}%</p>
                </div>
            )}
            {uploadingUserImage && (
                <div className="image-upload-progress-wrapper">
                    <p>User image {userProgress}%</p>
                </div>
            )}
        </>
    );
};

export default ImageUploadProgress;
