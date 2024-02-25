import React, { useEffect, useState, useContext } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import UserContext from "../../context/UserContext";

const ImageList = () => {
    const { user } = useContext(UserContext);
    const [images, setImages] = useState([]);

    useEffect(() => {
        const db = getDatabase();
        const imagesRef = ref(db, "images" + user.uid); // adjust this path to where your images are stored

        onValue(imagesRef, (snapshot) => {
            const data = snapshot.val();
            const imageList = [];
            for (let id in data) {
                imageList.push(data[id].url);
            }
            setImages(imageList);
        });
    }, []);

    return (
        <div>
            {images.map((url, index) => (
                <img
                    key={index}
                    src={url}
                    alt=""
                />
            ))}
        </div>
    );
};

export default ImageList;
