import React, { useContext } from "react";
import { ImageGallery, UserContext } from "context/Context";
import { ref, push } from "firebase/database";
import { toast } from "react-toastify";
import { database } from "../../../../Firebase";
import CustomButton from "components/customButton/CustomButton";

const LinkInput = () => {
    const { inputLink, setInputLink } = useContext(ImageGallery);
    const { user } = useContext(UserContext);
    // Add link
    const addLink = () => {
        if (user) {
            const userLinksRef = ref(database, "links/" + user.uid);
            push(userLinksRef, {
                link: inputLink,
            })
                .then(() => {
                    toast.success("Image added successfully!");
                    setInputLink("");
                })
                .catch(() => {
                    console.error("Failed to add the link.");
                });
        } else {
            toast.error("No user found.");
        }
    };

    return (
        <div className="top-section-box">
            <input
                className="input-links"
                value={inputLink}
                onChange={(e) => setInputLink(e.target.value)}
                placeholder="Type your text here"
            />
            <CustomButton
                className={!inputLink && "disabled"}
                label="Add"
                onClick={() => {
                    if (inputLink) {
                        addLink();
                    }
                }}
            />
        </div>
    );
};

export default LinkInput;
