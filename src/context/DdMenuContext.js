import { createContext, useState } from "react";

const DdMenuContext = createContext();

export const DdMenuProvider = ({ children }) => {
    const [openDdMenu, setOpenDdMenu] = useState("");

    return <DdMenuContext.Provider value={{ openDdMenu, setOpenDdMenu }}>{children}</DdMenuContext.Provider>;
};

export default DdMenuContext;
