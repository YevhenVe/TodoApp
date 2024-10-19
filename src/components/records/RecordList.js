import React from "react";
import CustomButton from "../customButton/CustomButton";
import { ReactComponent as DoneIcon } from "../../assets/done.svg";
import { ReactComponent as EditIcon } from "../../assets/edit.svg";
import { ReactComponent as RemoveTextIcon } from "../../assets/removeTextIcon.svg";
import RemoveConfirmation from "../removeConfirmation/RemoveConfirmation";

const RecordList = ({
    filteredRecords,
    editingRecordId,
    editedContent,
    setEditedContent,
    handleCheckRecord,
    submitEdit,
    removeRecordConfirmation,
    setRemoveRecordConfirmation,
    setSelectedRecordId,
    startEditing,
    selectedRecordId,
    deleteRecord,
}) => {
    return (
        <div className="records">
            {filteredRecords.map((record) => (
                <div
                    key={record.id}
                    className={`record ${record.checked ? "record-done" : ""}`}
                >
                    {editingRecordId === record.id ? (
                        <input
                            className="edit-input"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") submitEdit(record.id);
                            }}
                        />
                    ) : (
                        <p className="record-text">
                            <span className="record-timestamp">{new Date(record.timestamp).toLocaleString()}</span>
                            <br />
                            <span>{record.content}</span>
                        </p>
                    )}
                    <div className={`button-box ${removeRecordConfirmation ? "disabled" : ""}`}>
                        <CustomButton
                            className="check-record-text"
                            onClick={() => handleCheckRecord(record.id, !record.checked)}
                            icon={editingRecordId === record.id ? <></> : <DoneIcon />}
                        />
                        {!record.checked && (
                            <CustomButton
                                className="edit-record-text"
                                onClick={editingRecordId === record.id ? () => submitEdit(record.id) : () => startEditing(record.id, record.content)}
                                icon={editingRecordId === record.id ? <DoneIcon /> : <EditIcon />}
                            />
                        )}
                        <CustomButton
                            className="remove-record-text"
                            onClick={() => {
                                setSelectedRecordId(record.id);
                                setRemoveRecordConfirmation(true);
                            }}
                            icon={<RemoveTextIcon />}
                        />
                    </div>
                </div>
            ))}
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
    );
};

export default RecordList;
