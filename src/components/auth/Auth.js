import React, { useEffect, useContext } from "react";
import { auth } from "../../Firebase";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getDatabase, get, ref, set } from "firebase/database";
import UserContext from "../../context/UserContext";
import CustomButton from "../customButton/CustomButton";
import { ReactComponent as GoogleIcon } from "../../assets/googleIcon.svg";

const Auth = () => {
    const { setUser } = useContext(UserContext);
    const db = getDatabase();
    const provider = new GoogleAuthProvider();

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                const userRef = ref(db, `users/${user.uid}`);
                const userRoleRef = ref(db, `userRole/${user.uid}/user_role`);

                set(userRef, {
                    username: user.displayName,
                    email: user.email,
                    profile_picture: user.photoURL,
                });

                get(userRoleRef)
                    .then((snapshot) => {
                        if (snapshot.exists()) {
                            const userRoleValue = snapshot.val();
                            const userRoleUserRef = ref(db, `users/${user.uid}/user_role`);
                            set(userRoleUserRef, { user_role: userRoleValue });
                        }
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    };
    // Listener for user authentication
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
    }, [setUser]);

    return (
        <CustomButton
            icon={<GoogleIcon />}
            onClick={signInWithGoogle}
            label="Signin with Google"
        />
    );
};

export default Auth;
