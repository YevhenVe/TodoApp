import React, { useState } from "react";
import "./RemoveConfirmation.scss";

const RemoveConfirmation = ({ children }) => {
    const [removeConfirmation, setRemoveConfirmation] = useState(false);

    return <div className="remove-confirmation">{children}</div>;
};

export default RemoveConfirmation;
