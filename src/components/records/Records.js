import React, { useState, useEffect, useContext } from "react";
import { database } from "../../Firebase";
import { ref, onValue, push, remove, update } from "firebase/database";
import { ReactComponent as RemoveTextIcon } from "../../assets/removeTextIcon.svg";
import { ReactComponent as DoneIcon } from "../../assets/done.svg";
import UserContext from "../../context/UserContext";
import CustomButton from "../customButton/CustomButton";
import RemoveConfirmation from "../removeConfirmation/RemoveConfirmation";

import "./Records.scss";

const Records = () => {
    const { user } = useContext(UserContext);
    const [records, setRecords] = useState([]);
    const [input, setInput] = useState("");
    const [checkedRecord, setCheckedRecord] = useState(null);
    const [removeRecordConfirmation, setRemoveRecordConfirmation] = useState(false);
    const [selectedRecordId, setSelectedRecordId] = useState(null);

    useEffect(() => {
        if (user) {
            // Subscribing to user records
            const userRecordsRef = ref(database, "records/" + user.uid);
            onValue(userRecordsRef, (snapshot) => {
                const recordsData = snapshot.val();
                const recordsList = recordsData
                    ? Object.keys(recordsData)
                          .map((key) => ({
                              id: key,
                              ...recordsData[key],
                          }))
                          .sort((a, b) => {
                              if (a.checked === b.checked) {
                                  return b.timestamp - a.timestamp; // Sort by timestamp if both checked or unchecked
                              }
                              return a.checked ? 1 : -1; // Move checked records to the bottom
                          })
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
            console.log("Sign in with Google to add the record");
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
            if (input) {
                addRecord();
            } else return;
        }
    };

    return (
        <div className="records-wrapper">
            <div className="input-box">
                <input
                    className="input-records"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your text here"
                />
                <CustomButton
                    className={`set-item ${!input ? "disabled" : ""}`}
                    label=">"
                    onClick={() => {
                        if (input) {
                            addRecord();
                        } else return;
                    }}
                />
            </div>
            <div className="records">
                {records.map((record) => (
                    <div
                        key={record.id}
                        className={`record ${record.checked ? "record-done" : ""}`}
                    >
                        <p className="record-text">{record.content}</p>
                        <div className={`button-box ${removeRecordConfirmation ? "disabled" : ""}`}>
                            <CustomButton
                                className="check-record-text"
                                onClick={() => handleCheckRecord(record.id, !record.checked)}
                                icon={<DoneIcon />}
                            />
                            <CustomButton
                                className="remove-record-text"
                                onClick={() => {
                                    setSelectedRecordId(record.id);
                                    setRemoveRecordConfirmation(true);
                                }}
                                icon={<RemoveTextIcon />}
                            />
                        </div>
                        {removeRecordConfirmation && (
                            <RemoveConfirmation>
                                <CustomButton
                                    className="remove-yes"
                                    onClick={() => {
                                        if (selectedRecordId) {
                                            deleteRecord(selectedRecordId);
                                            setRemoveRecordConfirmation(false);
                                        }
                                    }}
                                    label="YES"
                                />
                                <CustomButton
                                    className="remove-no"
                                    onClick={() => setRemoveRecordConfirmation(false)}
                                    label="NO"
                                />
                            </RemoveConfirmation>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Records;
