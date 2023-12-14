import { createContext, useState } from "react";

const RemoveConfirmContext = createContext();

export const RemoveConfirmProvider = ({ children }) => {
    const [removeConfirmation, setRemoveConfirmation] = useState(false);

    return <RemoveConfirmContext.Provider value={{ removeConfirmation, setRemoveConfirmation }}>{children}</RemoveConfirmContext.Provider>;
};

export default RemoveConfirmContext;
