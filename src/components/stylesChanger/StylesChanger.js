import React, { useEffect, useContext } from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
import CustomSwitcher from "../customSwitcher/CustomSwitcher";
import { UserContext, ChangeStyleContext, ThemeColorContext } from "context/Context";
import BlurAdjuster from "components/blurAdjuster/BlurAdjuster";

const StyleChanger = () => {
    const { user } = useContext(UserContext);
    const { theme, handleClickTheme } = useContext(ThemeColorContext);
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
        <>
            <CustomSwitcher
                onClick={handleClickTheme}
                getData={!theme}
                labelOff="Dark theme"
                labelOn="Light theme"
            />
            <BlurAdjuster />
            <CustomSwitcher
                onClick={handleClick}
                getData={data}
                labelOff="Interface blur OFF"
                labelOn="Interface blur ON"
            />
        </>
    );
};

export default StyleChanger;
