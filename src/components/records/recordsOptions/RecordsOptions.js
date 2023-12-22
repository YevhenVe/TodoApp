import React, { useEffect, useContext } from "react";
import { FormControl, MenuItem, InputLabel, Select } from "@mui/material";
import OptionContext from "../../../context/OptionContext";
const RecordsOptions = () => {
    const { input, setInput, selectedOption, setSelectedOption, setOption } = useContext(OptionContext);
    // Changing of useEffect to listen changes in 'option'
    useEffect(() => {
        if (selectedOption !== "") {
            setInput(`${selectedOption} ${input}`);
        }
    }, [selectedOption]);

    // Update listener of value 'option'
    const handleOptionChange = (e) => {
        const newValue = e.target.value;
        setInput((prevInput) => prevInput.replace(`${selectedOption} `, "")); // Removing previous value
        setSelectedOption(newValue);
        setOption(newValue); // Update the 'option' value to retain the selection
    };
    return (
        <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Prefix</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Prefix"
                value={selectedOption}
                onChange={handleOptionChange}
            >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Work -">Work</MenuItem>
                <MenuItem value="Home - ">Home</MenuItem>
                <MenuItem value="Family - ">Family</MenuItem>
                <MenuItem value="Personal - ">Personal</MenuItem>
            </Select>
        </FormControl>
    );
};

export default RecordsOptions;
