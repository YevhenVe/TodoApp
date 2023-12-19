import { createContext, useState, useEffect, useContext } from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
import UserContext from "../context/UserContext";
const ThemeColorContext = createContext();

export const ThemeColorProvider = ({ children }) => {
    const { user } = useContext(UserContext);
    const [theme, setTheme] = useState(false);
    const colorLight = "--light-color";
    const colorDark = "--dark-color";
    const colorLightText = "--light-text-color";
    const colorDarkText = "--dark-text-color";

    useEffect(() => {
        const handleChangeTheme = (snapshot) => {
            setTheme(snapshot.val());
        };
        const databaseRef = ref(getDatabase(), `stylechanges/${user?.uid}/isThemeChanged`);
        const unsubscribe = onValue(databaseRef, handleChangeTheme);
        return () => {
            unsubscribe();
        };
    }, [setTheme, user]);
    if (theme && user) {
        document.documentElement.style.setProperty(colorLight, "rgba(0, 0, 0, 0.1)");
        document.documentElement.style.setProperty(colorDark, "rgba(255, 255, 255, 0.3)");
        document.documentElement.style.setProperty(colorLightText, "rgb(20, 20, 20)");
        document.documentElement.style.setProperty(colorDarkText, "rgba(245, 245, 245, 1)");
    } else {
        document.documentElement.style.setProperty(colorLight, "rgba(255, 255, 255, 0.3)");
        document.documentElement.style.setProperty(colorDark, "rgba(0, 0, 0, 0.1)");
        document.documentElement.style.setProperty(colorLightText, "rgba(245, 245, 245, 1)");
        document.documentElement.style.setProperty(colorDarkText, "rgb(20, 20, 20)");
    }
    const handleClickTheme = () => {
        set(ref(getDatabase(), `stylechanges/${user.uid}/isThemeChanged`), !theme);
    };

    return <ThemeColorContext.Provider value={{ theme, setTheme, handleClickTheme }}>{children}</ThemeColorContext.Provider>;
};

export default ThemeColorContext;
