import React, { useEffect, useContext } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { UserContext } from "context/Context";
import { ReactComponent as RemoveImageButtonIcon } from "../../assets/removeUserImg.svg";
import "./UsersData.scss";

const UsersData = () => {
    const { user, role, setRole, allUsersData, setAllUsersData, showAllUsers, setShowAllUsers } = useContext(UserContext);

    useEffect(() => {
        const handleChange = (snapshot) => {
            setRole(snapshot.val());
        };
        const databaseRef = ref(getDatabase(), `users/${user?.uid}/user_role/user_role`);
        const unsubscribe = onValue(databaseRef, handleChange);
        return () => {
            unsubscribe();
        };
    }, [setRole, user]);

    useEffect(() => {
        const db = getDatabase();
        const usersRef = ref(db, "users");

        const unsubscribe = onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            setAllUsersData(data);
        });

        return () => unsubscribe();
    }, []);

    if (!allUsersData) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {role ? (
                <>
                    {showAllUsers && (
                        <div className="alluser">
                            <div
                                className="close-button"
                                onClick={() => setShowAllUsers(false)}
                            >
                                <RemoveImageButtonIcon />
                            </div>
                            {Object.keys(allUsersData).map((userId) => (
                                <div
                                    className="user-data-wrapper"
                                    key={userId}
                                >
                                    <img
                                        src={allUsersData[userId].profile_picture}
                                        alt="Profile"
                                    />
                                    <div className="user-data">
                                        <p>Username: {allUsersData[userId].username}</p>
                                        <p>Email: {allUsersData[userId].email}</p>
                                        <p>User ID: {userId}</p>
                                        <p>User Role: {allUsersData[userId].user_role ? "Admin" : "User"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : null}
        </>
    );
};

export default UsersData;
