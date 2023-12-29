import { createContext, useState, useContext } from "react";
import { ref as storageRef, deleteObject } from "firebase/storage";
import { ref, remove } from "firebase/database";
import { database, storage } from "../Firebase";
import UserContext from "./UserContext";

const UserImageContext = createContext();

export const UserImageProvider = ({ children }) => {
    const { user } = useContext(UserContext);
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
        <UserImageContext.Provider value={{ userImages, setUserImages, deleteUserImage, userProgress, setUserProgress, uploadingUserImage, setUploadingUserImage, uploadedUserImage }}>
            {children}
        </UserImageContext.Provider>
    );
};

export default UserImageContext;
