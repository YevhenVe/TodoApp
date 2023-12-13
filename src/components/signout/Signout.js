import React, { useContext } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../Firebase";
import DdMenuContext from "../../context/DdMenuContext";
import { ReactComponent as LogoutIcon } from "../../assets/logout.svg";
import CustomButton from "../customButton/CustomButton";

const Signout = () => {
    const { isMenuClosed, setIsMenuClosed } = useContext(DdMenuContext);
    return (
        <CustomButton
            icon={<LogoutIcon />}
            onClick={() => {
                signOut(auth);
                setIsMenuClosed(!isMenuClosed);
            }}
            label="Signout"
        />
    );
};

export default Signout;
