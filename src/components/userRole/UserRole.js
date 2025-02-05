import React, { useEffect, useContext } from "react";
import { getDatabase, ref, set, onValue, update } from "firebase/database";
import CustomSwitcher from "../customSwitcher/CustomSwitcher";
import { UserContext } from "context/Context";

const UserRole = () => {
    const { user, role, setRole } = useContext(UserContext);

    const handleClick = () => {
        const newRole = !role;
        set(ref(getDatabase(), `userRole/${user.uid}/user_role`), newRole);
        update(ref(getDatabase(), `users/${user.uid}/user_role`), { user_role: newRole });
    };

    useEffect(() => {
        const handleChange = (snapshot) => {
            setRole(snapshot.val());
        };
        const databaseRef = ref(getDatabase(), `userRole/${user?.uid}/user_role`);
        const unsubscribe = onValue(databaseRef, handleChange);
        return () => {
            unsubscribe();
        };
    }, [setRole, user]);

    return (
        <>
            <CustomSwitcher
                onClick={handleClick}
                getData={!role}
                labelOff="User"
                labelOn="Admin"
            />
        </>
    );
};

export default UserRole;
