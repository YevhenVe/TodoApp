import React from "react";
import "./CustomButton.scss";

const CustomButton = ({ label, icon, onClick, className, disabled, title }) => {
    return (
        <button
            className={`custom-button ${className}`}
            onClick={onClick}
            disabled={disabled}
            title={title}
        >
            <div className="button-content-wrapper">
                {icon ? <div className="button-icon">{icon}</div> : <></>}
                {label ? <div className="button-label">{label}</div> : <></>}
            </div>
        </button>
    );
};

export default CustomButton;
