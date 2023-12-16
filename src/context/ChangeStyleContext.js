import { createContext, useState } from "react";

const ChangeStyleContext = createContext();

export const ChangeStyleProvider = ({ children }) => {
    const [data, setData] = useState(null);

    return <ChangeStyleContext.Provider value={{ data, setData }}>{children}</ChangeStyleContext.Provider>;
};

export default ChangeStyleContext;
