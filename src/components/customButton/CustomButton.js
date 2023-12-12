import React from "react";
import "./CustomButton.scss";

const CustomButton = ({ label, icon, onClick, className, disabled }) => {
    return (
        <button
            className={`custom-button ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            <div className="button-content-wrapper">
                <div className="button-icon">{icon}</div>
                <div className="button-label">{label}</div>
            </div>
        </button>
    );
};

export default CustomButton;
