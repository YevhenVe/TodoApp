import React, { useContext } from "react";
import BackgroundContext from "../../context/BackgroundContext";
import "./ImageUploadProgress.scss";

const ImageUploadProgress = () => {
    const { progress, uploading } = useContext(BackgroundContext);

    return (
        <>
            {uploading && (
                <div className="image-upload-progress-wrapper">
                    <p>Uploading {progress}%</p>
                </div>
            )}
        </>
    );
};

export default ImageUploadProgress;
