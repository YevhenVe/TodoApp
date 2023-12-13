import { createContext, useState } from "react";

const DdMenuContext = createContext();

export const DdMenuProvider = ({ children }) => {
    const [isMenuClosed, setIsMenuClosed] = useState(true);

    return <DdMenuContext.Provider value={{ isMenuClosed, setIsMenuClosed }}>{children}</DdMenuContext.Provider>;
};

export default DdMenuContext;
