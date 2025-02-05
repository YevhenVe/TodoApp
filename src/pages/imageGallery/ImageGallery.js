import React from "react";
import { useNavigate } from "react-router-dom";
import "./ImageGallery.scss";
import AddLink from "./addLink/AddLink";

const ImageGallery = () => {
    const navigate = useNavigate();
    return (
        <div className="image-gallery-wrapper">
            <div className="gallery-button-box">
                <div className="gallery-title">Personal image gallery</div>
                <div
                    className="close-gallery"
                    onClick={() => navigate(-1)}
                >
                    X
                </div>
            </div>
            <AddLink />
        </div>
    );
};

export default ImageGallery;
