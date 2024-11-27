import React, { useContext, useEffect, useState } from "react";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { toast } from "react-toastify";
import { UserContext, BlureLevelContext } from "context/Context";
import "./BlurAdjuster.scss";
import CustomButton from "components/customButton/CustomButton";

const BlurAdjuster = () => {
    const { blurLevel, handleBlurChange } = useContext(BlureLevelContext);
    const { user } = useContext(UserContext);

    const [isStyleChanged, setIsStyleChanged] = useState(false); // Default to false

    // Fetch isStyleChanged from Firebase on component mount
    useEffect(() => {
        if (user?.uid) {
            const databaseRef = ref(getDatabase(), `stylechanges/${user.uid}/isStyleChanged`);

            const unsubscribe = onValue(
                databaseRef,
                (snapshot) => {
                    if (snapshot.exists()) {
                        const value = snapshot.val();
                        console.log("Realtime isStyleChanged value:", value); // Log realtime updates
                        setIsStyleChanged(value);
                    } else {
                        console.log("isStyleChanged not found, defaulting to false");
                        setIsStyleChanged(false);
                    }
                },
                (error) => {
                    console.error("Error subscribing to isStyleChanged:", error);
                    setIsStyleChanged(false); // Default to false on error
                }
            );

            // Cleanup the subscription on unmount
            return () => unsubscribe();
        }
    }, [user?.uid]);

    // Function to save blurLevel in Firebase
    const handleSubmit = () => {
        if (!user?.uid) {
            toast.error("User not logged in.");
            return;
        }

        const databaseRef = ref(getDatabase(), `stylechanges/${user.uid}/isBlurLevel`);
        set(databaseRef, blurLevel)
            .then(() => {
                toast.success("Blur level successfully saved!");
            })
            .catch((error) => {
                toast.error("Error saving blur level");
            });
    };

    return (
        <>
            {!isStyleChanged && (
                <div>
                    <p>Blur Adjuster</p>
                    <input
                        type="range"
                        min="0"
                        max="50"
                        value={blurLevel}
                        onChange={handleBlurChange}
                        className="blur-slider"
                        title="Adjust Blur"
                    />

                    <CustomButton
                        label={`Set blur to ${blurLevel}`}
                        onClick={handleSubmit}
                    />
                </div>
            )}
        </>
    );
};

export default BlurAdjuster;
