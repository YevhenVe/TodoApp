import React, { useEffect, useContext } from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { ReactComponent as BlurIcon } from "../../assets/blurIcon.svg";
import CustomButton from "../customButton/CustomButton";
import ChangeStyleContext from "../../context/ChangeStyleContext";
import UserContext from "../../context/UserContext";
import "./StyleChanger.scss";

const StyleChanger = () => {
    const { user } = useContext(UserContext);
    const { data, setData } = useContext(ChangeStyleContext);

    useEffect(() => {
        const handleChange = (snapshot) => {
            setData(snapshot.val());
        };
        const databaseRef = ref(getDatabase(), `stylechanges/${user?.uid}/isStyleChanged`);
        const unsubscribe = onValue(databaseRef, handleChange);
        return () => {
            unsubscribe();
        };
    }, [setData, user]);

    const handleClick = () => {
        set(ref(getDatabase(), `stylechanges/${user.uid}/isStyleChanged`), !data);
    };

    return (
        <CustomButton
            className="blur-button-on-off"
            icon={<BlurIcon />}
            onClick={handleClick}
            title="Turn off Blur Effect"
            label="Turn off blur"
        />
    );
};

export default StyleChanger;
