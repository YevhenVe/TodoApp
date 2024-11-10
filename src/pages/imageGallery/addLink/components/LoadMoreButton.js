import React from "react";
import CustomButton from "components/customButton/CustomButton";

const LoadMoreButton = ({ isLoading, onClick }) => {
    return (
        <CustomButton
            className="load-more-btn"
            label={isLoading ? "Loading..." : "Load More"}
            onClick={onClick}
        />
    );
};

export default LoadMoreButton;
