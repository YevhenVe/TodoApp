import React, { useEffect, useContext } from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
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
        <>
            <div className="switcher-wrapper">
                <div
                    className={`swtcher-box ${data ? "swtcher-box-off" : ""}`}
                    onClick={handleClick}
                >
                    <div className={`swither-off ${data ? "swither-on" : ""}`} />
                </div>
                <div className="switcher-label">{data ? "Interface blur OFF" : "Interface blur ON"}</div>
            </div>
        </>
    );
};

export default StyleChanger;
