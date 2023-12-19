import React from "react";
import "./CustomSwitcher.scss";

const CustomSwitcher = ({ onClick, getData, labelOn, labelOff }) => {
    return (
        <div className="switcher-wrapper">
            <div
                className={`swtcher-box ${getData ? "swtcher-box-off" : ""}`}
                onClick={onClick}
            >
                <div className={`swither-off ${getData ? "swither-on" : ""}`} />
            </div>
            <div className="switcher-label">{getData ? <>{labelOff}</> : <>{labelOn}</>}</div>
        </div>
    );
};

export default CustomSwitcher;
