import { createContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState();
    const [allUsersData, setAllUsersData] = useState(null);
    const [showAllUsers, setShowAllUsers] = useState(false);

    return <UserContext.Provider value={{ user, setUser, role, setRole, allUsersData, setAllUsersData, showAllUsers, setShowAllUsers }}>{children}</UserContext.Provider>;
};

export default UserContext;
