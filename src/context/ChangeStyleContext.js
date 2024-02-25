import { createContext, useState } from "react";

const ChangeStyleContext = createContext();

export const ChangeStyleProvider = ({ children }) => {
    const [data, setData] = useState(null);
    const [switcher, setSwitcher] = useState(null);

    return <ChangeStyleContext.Provider value={{ data, setData, switcher, setSwitcher }}>{children}</ChangeStyleContext.Provider>;
};

export default ChangeStyleContext;
