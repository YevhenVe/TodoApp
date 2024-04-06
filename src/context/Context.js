import { createContext, useState, useEffect } from "react";
import { getDatabase, remove, ref, set, onValue } from "firebase/database";
import { database, storage } from "../Firebase";
import { ref as storageRef, deleteObject } from "firebase/storage";

export const UserContext = createContext();
export const BackgroundContext = createContext();
export const ChangeStyleContext = createContext();
export const DdMenuContext = createContext();
export const OptionContext = createContext();
export const RemoveConfirmContext = createContext();
export const ThemeColorContext = createContext();
export const UserImageContext = createContext();

export const ContextProvider = (props) => {
    //UserContext
    const [user, setUser] = useState(null);
    const [role, setRole] = useState();
    const [allUsersData, setAllUsersData] = useState(null);
    const [showAllUsers, setShowAllUsers] = useState(false);

    //BackgroundContext
    const [images, setImages] = useState([]);
    const [progress, setProgress] = useState("");
    const [uploading, setUploading] = useState(false);
    const backgroundImage = images[0]?.url;

    const deleteImage = async (imageId, imageUrl) => {
        // Delete reference from database
        await remove(ref(database, `images/${user.uid}/${imageId}`));
        // Delete image from storage
        try {
            await deleteObject(storageRef(storage, imageUrl));
            console.log("Image deleted from storage");
        } catch (error) {
            console.error("Error deleting image from storage", error);
        }
    };

    //ChangeStyleContext
    const [data, setData] = useState(null);
    const [switcher, setSwitcher] = useState(null);

    //DdMenuContext
    const [isMenuClosed, setIsMenuClosed] = useState(true);

    //OptionContext
    const [selectedOption, setSelectedOption] = useState("");
    const [option, setOption] = useState("");
    const [input, setInput] = useState("");

    //RemoveConfirmContext
    const [removeConfirmation, setRemoveConfirmation] = useState(false);

    //ThemeContext
    const [theme, setTheme] = useState(true);

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
        document.documentElement.classList.add("dark-theme");
    } else {
        document.documentElement.classList.remove("dark-theme");
    }

    const handleClickTheme = () => {
        set(ref(getDatabase(), `stylechanges/${user.uid}/isThemeChanged`), !theme);
    };

    //UserImageContext
    const [userImages, setUserImages] = useState([]);
    const [userProgress, setUserProgress] = useState("");
    const [uploadingUserImage, setUploadingUserImage] = useState(false);
    const uploadedUserImage = userImages[0]?.url;

    const deleteUserImage = async (userImageId, userImageUrl) => {
        // Delete reference from database
        await remove(ref(database, `user_images/${user.uid}/${userImageId}`));
        // Delete image from storage
        try {
            await deleteObject(storageRef(storage, userImageUrl));
            console.log("Image deleted from storage");
        } catch (error) {
            console.error("Error deleting image from storage", error);
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, role, setRole, allUsersData, setAllUsersData, showAllUsers, setShowAllUsers }}>
            <BackgroundContext.Provider value={{ images, setImages, deleteImage, progress, setProgress, uploading, setUploading, backgroundImage }}>
                <ChangeStyleContext.Provider value={{ data, setData, switcher, setSwitcher }}>
                    <DdMenuContext.Provider value={{ isMenuClosed, setIsMenuClosed }}>
                        <OptionContext.Provider value={{ input, setInput, selectedOption, setSelectedOption, option, setOption }}>
                            <RemoveConfirmContext.Provider value={{ removeConfirmation, setRemoveConfirmation }}>
                                <ThemeColorContext.Provider value={{ theme, setTheme, handleClickTheme }}>
                                    <UserImageContext.Provider
                                        value={{ userImages, setUserImages, deleteUserImage, userProgress, setUserProgress, uploadingUserImage, setUploadingUserImage, uploadedUserImage }}
                                    >
                                        {props.children}
                                    </UserImageContext.Provider>
                                </ThemeColorContext.Provider>
                            </RemoveConfirmContext.Provider>
                        </OptionContext.Provider>
                    </DdMenuContext.Provider>
                </ChangeStyleContext.Provider>
            </BackgroundContext.Provider>
        </UserContext.Provider>
    );
};
