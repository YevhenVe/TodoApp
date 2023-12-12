import React, { useEffect, useContext } from "react";
import { auth } from "../../Firebase";
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import UserContext from "../../context/UserContext";
import CustomButton from "../customButton/CustomButton";
import { ReactComponent as GoogleIcon } from "../../assets/googleIcon.svg";

const Auth = () => {
    const { setUser } = useContext(UserContext);
    // Authorization through Google
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    };

    // Listener for user authentication
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
    }, []);

    return (
        <CustomButton
            icon={<GoogleIcon />}
            onClick={signInWithGoogle}
            label="Signin with Google"
        />
    );
};

export default Auth;
