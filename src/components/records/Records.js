import React, { useState, useEffect, useContext } from "react";
import UserContext from "../../context/UserContext";
import CustomButton from "../customButton/CustomButton";
import { ref, onValue, push, remove, update } from "firebase/database";
import { ReactComponent as RemoveTextIcon } from "../../assets/removeTextIcon.svg";
import { ReactComponent as DoneIcon } from "../../assets/done.svg";
import { database } from "../../Firebase";
import "./Records.scss";

const Records = () => {
    const { user } = useContext(UserContext);
    const [records, setRecords] = useState([]);
    const [input, setInput] = useState("");
    const [checkedRecord, setCheckedRecord] = useState(null);

    useEffect(() => {
        if (user) {
            // Subscribing to user records
            const userRecordsRef = ref(database, "records/" + user.uid);
            onValue(userRecordsRef, (snapshot) => {
                const recordsData = snapshot.val();
                const recordsList = recordsData
                    ? Object.keys(recordsData).map((key) => ({
                          id: key,
                          ...recordsData[key],
                      }))
                    : [];
                setRecords(recordsList);
            });
        } else {
            setRecords([]);
        }
    }, []);

    // Adding a record
    const addRecord = () => {
        if (user) {
            const userRecordsRef = ref(database, "records/" + user.uid);
            push(userRecordsRef, {
                content: input,
                timestamp: Date.now(),
                checked: false,
            });
            setInput("");
        } else {
            alert("Пожалуйста, войдите в систему для добавления записей.");
        }
    };

    // Handle checking/unchecking a record
    const handleCheckRecord = (recordId, isChecked) => {
        if (user) {
            const recordRef = ref(database, "records/" + user.uid + "/" + recordId);
            update(recordRef, {
                checked: isChecked,
            });
            setCheckedRecord(isChecked ? recordId : null);
        }
    };

    // Deleting a record
    const deleteRecord = (recordId) => {
        if (user) {
            const recordRef = ref(database, "records/" + user.uid + "/" + recordId);
            remove(recordRef);
        } else {
            console.log("Please login");
        }
    };

    //Set Record by clicking "Enter" button
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            addRecord();
        }
    };

    return (
        <div className="records-wrapper">
            <input
                className="input-records"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your text here"
            />
            <div className="records">
                {records.map((record) => (
                    <div
                        key={record.id}
                        className={`record ${record.checked ? "record-done" : ""}`}
                    >
                        <p className="record-text">{record.content}</p>
                        <div className="button-box">
                            <CustomButton
                                className="check-record-text"
                                onClick={() => handleCheckRecord(record.id, !record.checked)}
                                icon={<DoneIcon />}
                            />
                            <CustomButton
                                className="remove-record-text"
                                onClick={() => deleteRecord(record.id)}
                                icon={<RemoveTextIcon />}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Records;
